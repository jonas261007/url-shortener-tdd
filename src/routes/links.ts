import { Router } from 'express';
import { LinkController } from '../controllers/LinkController';
import { authMiddleware } from '../middlewares/auth';
import { rateLimitCreateLink } from '../middlewares/rateLimit';

const router = Router();

router.post('/', authMiddleware, rateLimitCreateLink, LinkController.create);
router.get('/', authMiddleware, LinkController.list);
router.get('/:id', authMiddleware, LinkController.show);

export default router;
