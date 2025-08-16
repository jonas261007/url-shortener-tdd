import { Router } from 'express';
import authRoutes from './auth';
import linkRoutes from './links';
import { RedirectController } from '../controllers/RedirectController';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Autenticação
router.use('/auth', authRoutes);

// Links
router.use('/links', linkRoutes);

// Redirecionamento público
router.get('/s/:slug', RedirectController.resolve);

// Dashboard HTML (público por enquanto)
router.get('/dashboard', authMiddleware, DashboardController.render);

// Métricas protegidas
router.get('/metrics/summary', authMiddleware, DashboardController.summary);
router.get('/metrics/top', authMiddleware, DashboardController.top);

// Root API
router.get('/', (_req, res) => {
  res.json({ message: 'API funcionando 🚀' });
});

export default router;
