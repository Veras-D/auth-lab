import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { connectToDatabase } from './config/database';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

const app = express();

connectToDatabase();

app.use(cors());
app.use(helmet());
app.use(express.json());

const swaggerDocument = YAML.load(path.join('src', 'docs', 'openapi.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Auth Lab API Documentation',
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true
  }
}));


app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Auth Lab API',
    documentation: '/api-docs',
    version: '1.0.0'
  });
});

export default app;
