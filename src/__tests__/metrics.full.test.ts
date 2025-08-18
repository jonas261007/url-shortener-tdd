import request from "supertest";
import { app } from "../app";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Link } from "../entities/Link";
import bcrypt from "bcryptjs";

let token: string;

beforeAll(async () => {
  await AppDataSource.initialize();

  const user = new User();
  (user as any).email = "metrics@test.com";
  (user as any).password = await bcrypt.hash("123456", 10);
  await AppDataSource.getRepository(User).save(user);

  const login = await request(app)
    .post("/auth/login")
    .send({ email: "metrics@test.com", password: "123456" });
  token = login.body.token;

  const link = new Link();
  (link as any).slug = "metric_slug";
  (link as any).target = "http://example.com";
  (link as any).user = user;
  (link as any).clicks = 5;
  await AppDataSource.getRepository(Link).save(link);
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Metrics rotas protegidas", () => {
  it("GET /metrics/summary retorna 200 com token", async () => {
    const res = await request(app)
      .get("/metrics/summary")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalLinks");
  });

  it("GET /metrics/top retorna 200 com token", async () => {
    const res = await request(app)
      .get("/metrics/top")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
