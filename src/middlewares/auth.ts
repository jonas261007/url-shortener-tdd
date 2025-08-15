import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token ausente' });

  const [, token] = authHeader.split(' ');
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    (req as any).userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
