import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { app } from '../app';

let dataSource: DataSource;

beforeAll(async () => {
  dataSource = await AppDataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

beforeEach(async () => {
  // Limpa a tabela de usuários antes de cada teste
  await dataSource.getRepository('User').clear();
});

describe('AuthController', () => {
  const userData = { name: 'Jonas', email: 'jonas@test.com', password: '123456' };

  it('deve registrar um usuário', async () => {
    const res = await request(app).post('/auth/register').send(userData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', userData.name);
    expect(res.body).toHaveProperty('email', userData.email);
  });

  it('não deve registrar email duplicado', async () => {
    await request(app).post('/auth/register').send(userData);
    const res = await request(app).post('/auth/register').send(userData);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'E-mail já cadastrado');
  });

  it('deve logar usuário com token JWT', async () => {
    await request(app).post('/auth/register').send(userData);
    const res = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('não deve logar com senha inválida', async () => {
    await request(app).post('/auth/register').send(userData);
    const res = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: 'senhaerrada' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Credenciais inválidas');
  });

  it('logout retorna mensagem de sucesso', async () => {
    const res = await request(app).post('/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logout efetuado');
  });
});
