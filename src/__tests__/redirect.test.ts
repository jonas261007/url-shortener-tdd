import request from 'supertest';
import { app } from '../app';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Link } from '../entities/Link';

let user: User;
let token: string;

beforeAll(async () => {
  await AppDataSource.initialize();

  await Link.clear();
  await User.clear();

  const randomEmail = `redirect_${Date.now()}@test.com`;
  user = User.create({
    name: 'Teste Redirect',
    email: randomEmail,
    password_hash: '123456',
  });
  await user.save();

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExNiwiaWF0IjoxNzU1MjY0NTM4LCJleHAiOjE3NTUzNTA5Mzh9.rlWhrnc9AL1mZv9KbTpifPBelLD-pbrAVonBQz_s7lc'; 
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('RedirectController', () => {
  it('deve redirecionar link ativo', async () => {
    const link = Link.create({
      user,
      original_url: 'https://example.com',
      slug: `teste_${Date.now()}`,
      status: 'active',
    });
    await link.save();

    const res = await request(app).get(`/s/${link.slug}`);

    expect(res.status).toBe(302);
    expect(res.header['location']).toBe(link.original_url);
  });

  it('deve retornar link expirado', async () => {
    const expiredLink = Link.create({
      user,
      original_url: 'https://example.com',
      slug: `expirado_${Date.now()}`,
      status: 'active',
      expires_at: new Date(Date.now() - 1000),
    });
    await expiredLink.save();

    const res = await request(app).get(`/s/${expiredLink.slug}`);

    expect(res.status).toBe(410);
    expect(res.text).toContain('Link expirado');
  });
});
