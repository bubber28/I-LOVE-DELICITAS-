import { Router } from 'express';
import { signMockToken } from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { email } = req.body as { email?: string; password?: string };
  const isAdmin = Boolean(email && email.toLowerCase().includes('admin'));

  const user = {
    id: 'user_001',
    role: isAdmin ? 'admin' : 'user'
  } as const;

  const token = signMockToken({ id: user.id, role: user.role });

  res.json({
    message: 'Login mock realizado com sucesso.',
    token,
    user
  });
});

export { authRouter };
