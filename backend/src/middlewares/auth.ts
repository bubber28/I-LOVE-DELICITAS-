import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token ausente.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET) as Express.UserPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalido.' });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Nao autenticado.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso restrito a admins.' });
  }

  next();
}

export function signMockToken(payload: Express.UserPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}
