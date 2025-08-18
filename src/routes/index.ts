import { Router } from 'express';
import authRoutes from './auth';
import linkRoutes from './links';
import { RedirectController } from '../controllers/RedirectController';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use('/auth', authRoutes);
router.use('/links', linkRoutes);

// Redirecionamento público
router.get('/s/:slug', RedirectController.resolve);

// Dashboard HTML (protegido)
router.get('/dashboard', authMiddleware, DashboardController.render);

// Métricas JSON (protegidas)
router.get('/metrics/summary', authMiddleware, DashboardController.summary);
router.get('/metrics/top', authMiddleware, DashboardController.top);

// Root
router.get('/', (_req, res) => res.json({ message: 'API funcionando 🚀' }));

export default router;
