import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { connectToDatabase } from './config/database.ts';
import userRoutes from './routes/user.routes.ts';

const app = express();

connectToDatabase();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/users', userRoutes);

export default app;
