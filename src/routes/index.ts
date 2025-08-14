import { Router } from 'express';
import authRoutes from './auth';
import linkRoutes from './links';

const router = Router();

router.use('/auth', authRoutes);
router.use('/links', linkRoutes);

router.get('/', (_req, res) => {
  res.json({ message: 'API funcionando 🚀' });
});

export default router;
