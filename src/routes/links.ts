import { Router } from 'express';
import { LinkController } from '../controllers/LinkController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/', authMiddleware, LinkController.create);

export default router;
