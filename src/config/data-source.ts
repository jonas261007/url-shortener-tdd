import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../../database.sqlite'),
  synchronize: true, // Em produção, usar migrations!
  logging: false,
  entities: [path.join(__dirname, '../entities/*.{ts,js}')],
});
