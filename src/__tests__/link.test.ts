import request from 'supertest';
import { AppDataSource } from '../config/data-source';
import { app } from '../app';

let token: string;

beforeAll(async () => {
  await AppDataSource.initialize();

  // Criar usuário e pegar token
  await request(app).post('/auth/register').send({
    name: 'Jonas',
    email: 'jonas@test.com',
    password: '123456',
  });
  const res = await request(app).post('/auth/login').send({
    email: 'jonas@test.com',
    password: '123456',
  });
  token = res.body.token;
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('LinkController', () => {
  it('deve criar link curto com slug e QR code', async () => {
    const res = await request(app)
      .post('/links')
      .set('Authorization', `Bearer ${token}`)
      .send({ original_url: 'https://example.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('slug');
    expect(res.body).toHaveProperty('qr_code');
  });

  it('não deve criar link com URL inválida', async () => {
    const res = await request(app)
      .post('/links')
      .set('Authorization', `Bearer ${token}`)
      .send({ original_url: 'invalid-url' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'URL inválida');
  });

  it('não deve criar link com expires_at no passado', async () => {
    const res = await request(app)
      .post('/links')
      .set('Authorization', `Bearer ${token}`)
      .send({ original_url: 'https://example.com', expires_at: '2000-01-01' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'expires_at deve ser maior que agora');
  });
});
