import { Router } from 'express';
import { profile, logout, refreshToken } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticateToken, profile);
router.post('/logout', authenticateToken, logout);
router.post('/token/refresh', refreshToken);

export default router;
