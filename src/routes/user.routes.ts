import express from 'express';
import { register, login, getUsers, updateUser, deleteUser } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema, updateUserSchema, userIdParam } from '../validations/user.validation.js';

const router = express.Router();

router.post('/register', validate(registerSchema, 'body'), register);
router.post('/login', validate(loginSchema, 'body'), login);
router.get('/', getUsers);
router.put('/:id', validate(userIdParam, 'params'), validate(updateUserSchema, 'body'), updateUser);
router.delete('/:id', validate(userIdParam, 'params'), deleteUser);

export default router;
