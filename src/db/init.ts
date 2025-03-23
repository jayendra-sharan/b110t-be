import pool from "./client";

const createUsersTable =`
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

async function initDB() {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await pool.query(createUsersTable);
    console.log('✅ Users table created');
  } catch (err) {
    console.log('❎ Error initializing DB: ', err);
  } finally {
    await pool.end();
  }
}

initDB();
