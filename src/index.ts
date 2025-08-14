import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';
import routes from './routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use(routes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Banco de dados conectado');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao inicializar o banco de dados:', err);
  });
