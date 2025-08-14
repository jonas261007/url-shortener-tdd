import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

router.use('/auth', authRoutes);

router.get('/', (_req, res) => {
  res.json({ message: 'API funcionando 🚀' });
});

export default router;
