import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const profile = (req: Request, res: Response) => {
  res.json({ message: `Hello user ${req.user?.id}!` });
};

export const logout = (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully. Please discard token on client.' });
};

export const refreshToken = (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token missing' });

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as { id: string };
    const newToken = jwt.sign({ id: decoded.id }, env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};
