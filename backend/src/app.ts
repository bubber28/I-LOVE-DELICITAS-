import cors from 'cors';
import express from 'express';
import { authRouter } from './routes/auth';
import { catalogRouter } from './routes/catalog';
import { ordersRouter } from './routes/orders';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'delicitas-api' });
});

app.use('/auth', authRouter);
app.use('/catalog', catalogRouter);
app.use('/orders', ordersRouter);
