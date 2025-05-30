import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { env } from '../config/env';

interface JwtPayload {
  id: string;
}

export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({
      id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.json({ message: 'Logged out successfully. Please discard token on client.' });
};

export const refreshToken = (req: Request, res: Response): void => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ error: 'Refresh token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as JwtPayload;
    const newAccessToken = jwt.sign({ id: decoded.id }, env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};