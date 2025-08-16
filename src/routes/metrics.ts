// src/routes/metrics.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { MetricsController } from '../controllers/MetricsController';

const router = Router();

router.get('/summary', authMiddleware, MetricsController.summary);
router.get('/top', authMiddleware, MetricsController.top);

export default router;
