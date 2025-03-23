import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: `.env.development`, debug: true });
}

import express from 'express';

import pool from './db/client';
import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/', (_req, res) => {
  res.send('b110t backend is running!');
});

pool.query('SELECT NOW()')
  .then(res => {
    console.log('DB connected:', res.rows[0]);
  })
  .catch(err => {
    console.error('DB connection error:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
