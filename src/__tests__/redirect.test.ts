// src/__tests__/redirect.test.ts
import request from 'supertest';
import { app } from '../app'; // corrigido do default export
import { AppDataSource } from '../config/data-source'; // ajuste de caminho
import { User } from '../entities/User';
import { Link } from '../entities/Link';

let user: User;
let token: string;

beforeAll(async () => {
  await AppDataSource.initialize();

  // Limpa tabelas para evitar conflito de UNIQUE
  await Link.clear();
  await User.clear();

  // Cria usuário com email aleatório
  const randomEmail = `redirect_${Date.now()}@test.com`;
  user = User.create({
    name: 'Teste Redirect',
    email: randomEmail,
    password_hash: '123456',
  });
  await user.save();

  // Aqui você precisaria gerar token JWT se o teste depender dele
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
      slug: `teste_${Date.now()}`, // slug aleatório
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
      slug: `expirado_${Date.now()}`, // slug aleatório
      status: 'active',
      expires_at: new Date(Date.now() - 1000), // passado
    });
    await expiredLink.save();

    const res = await request(app).get(`/s/${expiredLink.slug}`);

    expect(res.status).toBe(410);
    expect(res.text).toContain('Link expirado');
  });
});
