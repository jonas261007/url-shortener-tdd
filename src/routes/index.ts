import { Router } from 'express';
import authRoutes from './auth';
import linkRoutes from './links';
import { RedirectController } from '../controllers/RedirectController';

const router = Router();

router.use('/auth', authRoutes);
router.use('/links', linkRoutes);

// ✅ Redirecionamento público
router.get('/s/:slug', RedirectController.resolve);

router.get('/', (_req, res) => {
  res.json({ message: 'API funcionando 🚀' });
});

export default router;
