import jwt from 'jsonwebtoken';
import { User } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const EXPIRES_IN = '2h';

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

export function verifyToken(token: string): { id: string; email: string;} {
  return jwt.verify(token, JWT_SECRET) as { id: string; email: string }
}
