import request from 'supertest';
import { hash } from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Link } from '../entities/Link';
import { Visit } from '../entities/Visit';
import { app } from '../app'; // aqui está correto

import { DataSource } from 'typeorm'; // 👈 import explícito

let dataSource: DataSource; // 👈 agora tipado
let userId: number;

beforeAll(async () => {
  dataSource = await AppDataSource.initialize();

  const password_hash = await hash('123456', 8);
  const user = await User.create({ name: 'DashTest', email: 'dash@test.com', password_hash });
  await user.save();
  userId = user.id;

  const link = await Link.create({
    user,
    original_url: 'https://example.com',
    slug: 'dash123',
    status: 'active',
  }).save();

  await Visit.create({ link, ip_hash: 'xyz789', user_agent: 'dash-agent' }).save();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('DashboardController', () => {
  it('summary: retorna métricas corretas', async () => {
    const res = await request(app)
      .get('/metrics/summary')
      .set('Authorization', `Bearer fake-token-for-test`)
      .expect(200);

    expect(res.body.total_links).toBe(1);
    expect(res.body.active_links).toBe(1);
    expect(res.body.expired_links).toBe(0);
    expect(res.body.total_clicks).toBe(1);
  });

  it('top: retorna top links por cliques', async () => {
    const res = await request(app)
      .get('/metrics/top')
      .set('Authorization', `Bearer fake-token-for-test`)
      .expect(200);

    expect(res.body.top.length).toBe(1);
    expect(res.body.top[0].slug).toBe('dash123');
  });
});
