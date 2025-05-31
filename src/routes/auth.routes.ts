import { Router } from 'express';
import { profile, logout, refreshToken } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { refreshTokenSchema } from '../validations/auth.validation.js';

const router = Router();

router.get('/profile', authenticateToken, profile);
router.post('/logout', authenticateToken, logout);
router.post('/token/refresh', validate(refreshTokenSchema, 'body'), refreshToken);

export default router;
