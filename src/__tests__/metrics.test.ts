import request from 'supertest';
import { hash } from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Link } from '../entities/Link';
import { Visit } from '../entities/Visit';
import { app } from '../app';

let dataSource: DataSource;
let userId: number;
let token: string;
let slug: string;

beforeAll(async () => {
  dataSource = await AppDataSource.initialize();

  // Limpa em ordem de FK
  await dataSource.getRepository(Visit).clear();
  await dataSource.getRepository(Link).clear();
  await dataSource.getRepository(User).clear();

  const password_hash = await hash('123456', 8);
  const user = await User.create({
    name: 'Metrics User',
    email: `metrics_${Date.now()}@test.com`,
    password_hash,
  }).save();

  userId = user.id;
  token = `test-user-${userId}`;

  slug = `test_${Date.now()}`;
  const link = await Link.create({
    user,
    original_url: 'https://example.com',
    slug,
    status: 'active',
  }).save();

  await Visit.create({
    link,
    ip_hash: 'abc123',
    user_agent: 'jest-agent',
  }).save();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('MetricsController', () => {
  it('summary: retorna totais', async () => {
    const res = await request(app)
      .get('/metrics/summary')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.total_links).toBe(1);
    expect(res.body.active_links).toBe(1);
    expect(res.body.expired_links).toBe(0);
    expect(res.body.total_clicks).toBe(1);
  });

  it('top: retorna top links', async () => {
    const res = await request(app)
      .get('/metrics/top')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.top)).toBe(true);
    expect(res.body.top.length).toBe(1);
    expect(res.body.top[0].slug).toBe(slug);
  });
});
