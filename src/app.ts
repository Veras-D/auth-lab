import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { connectToDatabase } from './config/database';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

const app = express();

connectToDatabase();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app;
