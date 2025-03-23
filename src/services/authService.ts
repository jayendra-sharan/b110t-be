import { QueryResult } from 'pg';
import bcrypt from 'bcryptjs';
import pool from '../db/client';
import { User } from '../types/user';

export async function createUser(email: string, password: string): Promise<User> {
  const existing = await pool.query('SELECT id from users where email = $1', [email]);
  if ((existing.rowCount ?? 0) > 0) {
    throw new Error('Email already registered');
  }

  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, hashed]
  );

  return result.rows[0];
}

export async function verifyUser(email:string, password: string): Promise<User> {
  const result: QueryResult = await pool.query(
    'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
    [email]
  );

  if (result.rowCount === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error('Invalid email or password');
  }
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  }
}
