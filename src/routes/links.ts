import { Router } from 'express';
import { LinkController } from '../controllers/LinkController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/', authMiddleware, LinkController.create);
router.get('/', authMiddleware, LinkController.list);

export default router;
