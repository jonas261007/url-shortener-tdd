import { app } from "../app";
import request from "supertest";
import { AppDataSource } from "../config/data-source";

beforeAll(async () => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
});

afterAll(async () => {
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
});

describe("Server bootstrap", () => {
  it("deve importar o server sem erros", () => {
    expect(app).toBeDefined();
  });

  it("deve responder health check", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.text).toBe("ok");
  });
});
