import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  // ✅ Atalho para testes: "Bearer test-user-<id>"
  if (process.env.NODE_ENV === 'test' && token) {
    if (token === 'fake-token-for-test') {
      (req as any).userId = 1;
      return next();
    }
    if (token.startsWith('test-user-')) {
      const idStr = token.replace('test-user-', '');
      const id = Number(idStr);
      if (!Number.isNaN(id)) {
        (req as any).userId = id;
        return next();
      }
    }
  }

  if (!token) return res.status(401).json({ error: 'Token ausente' });

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    (req as any).userId = payload.userId ?? payload.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
