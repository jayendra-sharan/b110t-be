import express, { Request, Response } from 'express';
import { createUser, verifyUser } from '../services/authService';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest, requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Invalid email or password' });
  }

  try {
    const user = await createUser(email, password);
    res.status(201).json(user);
  } catch (err: any) {
    const msg = err.message === 'Email already registered' ? err.message : 'Signup failed';
    console.error('DB error during user creation:', err);
    res.status(400).json({ error: msg });
  }
});

router.post('/login', async(req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Invalid email or password'});
    return;
  }

  try {
    const user = await verifyUser(email, password);
    const token = generateToken(user);
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (err: any) {
    console.error(err);
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({
    message: 'You are authenticated!',
    user: req.user,
  })
});

export default router;
