import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { env } from '../config/env';

interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const generateTokens = (user: any) => {
  const userId = user._id ? user._id.toString() : user.id;
  const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }
    const user = new User({ username, email, password });
    const savedUser = await user.save();

    const userResponse = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email
    };

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const { accessToken, refreshToken } = generateTokens(user);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    if (users.length === 0) {
      res.status(404).json({ error: 'No users found' });
      return;
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
