import request from "supertest";
import { app } from "../app";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

let token: string;

beforeAll(async () => {
  await AppDataSource.initialize();

  const user = new User();
  (user as any).email = "linkerrors@test.com";
  (user as any).password = await bcrypt.hash("123456", 10);
  await AppDataSource.getRepository(User).save(user);

  const login = await request(app)
    .post("/auth/login")
    .send({ email: "linkerrors@test.com", password: "123456" });
  token = login.body.token;
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("LinkController - erros de validação", () => {
  it("deve retornar 400 se target estiver ausente", async () => {
    const res = await request(app)
      .post("/links")
      .set("Authorization", `Bearer ${token}`)
      .send({ slug: "sem_target" });
    expect(res.status).toBe(400);
  });

  it("deve retornar 400 se slug estiver ausente", async () => {
    const res = await request(app)
      .post("/links")
      .set("Authorization", `Bearer ${token}`)
      .send({ target: "http://exemplo.com" });
    expect(res.status).toBe(400);
  });

  it("deve retornar 401 se não tiver autenticação", async () => {
    const res = await request(app).post("/links").send({
      target: "http://exemplo.com",
      slug: "sem_auth",
    });
    expect(res.status).toBe(401);
  });
});
