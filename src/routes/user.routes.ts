import express, { Request, Response } from 'express';
import { register, login, getUsers, updateUser, deleteUser } from '../controllers/user.controller.ts';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
