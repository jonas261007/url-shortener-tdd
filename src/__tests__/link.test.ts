import request from 'supertest';
import { AppDataSource } from '../config/data-source';
import { DataSource } from 'typeorm';
import { app } from '../app';
import { User } from '../entities/User';

let dataSource: DataSource;
let token: string;

beforeAll(async () => {
  dataSource = await AppDataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

beforeEach(async () => {
  await dataSource.getRepository('Link').clear();
  await dataSource.getRepository('User').clear();

  // Criar usuário e gerar token
  const userData = { name: 'Jonas', email: 'jonas@test.com', password: '123456' };
  await request(app).post('/auth/register').send(userData);
  const res = await request(app).post('/auth/login').send({
    email: userData.email,
    password: userData.password,
  });
  token = res.body.token;
});

describe('LinkController - listagem', () => {
  it('deve retornar lista de links do usuário', async () => {
    // Criar alguns links
    await request(app)
      .post('/links')
      .set('Authorization', `Bearer ${token}`)
      .send({ original_url: 'https://example.com' });

    await request(app)
      .post('/links')
      .set('Authorization', `Bearer ${token}`)
      .send({ original_url: 'https://example.org' });

    const res = await request(app)
      .get('/links')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('slug');
    expect(res.body[0]).toHaveProperty('click_count');
    expect(res.body[0]).toHaveProperty('visits');
  });
});
