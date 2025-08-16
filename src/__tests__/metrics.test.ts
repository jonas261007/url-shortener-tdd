import request from 'supertest';
import { hash } from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Link } from '../entities/Link';
import { Visit } from '../entities/Visit';
import { app } from '../app'; // 👈 agora está correto

import { DataSource } from 'typeorm';

let dataSource: DataSource;
let userId: number;

beforeAll(async () => {
  dataSource = await AppDataSource.initialize();

  const password_hash = await hash('123456', 8);
  const user = await User.create({ name: 'Test', email: 'test@test.com', password_hash });
  await user.save();
  userId = user.id;

  const link = await Link.create({
    user,
    original_url: 'https://example.com',
    slug: 'test123',
    status: 'active',
  }).save();

  await Visit.create({ link, ip_hash: 'abc123', user_agent: 'test-agent' }).save();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('MetricsController', () => {
  it('summary: retorna totais', async () => {
    const res = await request(app)
      .get('/metrics/summary')
      .set('Authorization', `Bearer fake-token-for-test`)
      .expect(200);

    expect(res.body.total_links).toBe(1);
    expect(res.body.active_links).toBe(1);
    expect(res.body.expired_links).toBe(0);
    expect(res.body.total_clicks).toBe(1);
  });

  it('top: retorna top links', async () => {
    const res = await request(app)
      .get('/metrics/top')
      .set('Authorization', `Bearer fake-token-for-test`)
      .expect(200);

    expect(res.body.top.length).toBe(1);
    expect(res.body.top[0].slug).toBe('test123');
  });
});
