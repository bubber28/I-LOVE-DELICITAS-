import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';

const ordersRouter = Router();

ordersRouter.post('/', authMiddleware, (req, res) => {
  const items = (req.body?.items as Array<{ productId: string; quantity: number }>) || [];

  res.status(201).json({
    orderId: `order_${Date.now()}`,
    items,
    status: 'created',
    userId: req.user?.id
  });
});

export { ordersRouter };
