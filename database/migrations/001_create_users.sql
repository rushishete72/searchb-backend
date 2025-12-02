CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (email, password_hash, role) SELECT 'rushikeshshete@synkro.in', '$2a$10$abcdefghijklmnopqrstuv1234567890abcde', 'admin' WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='rushikeshshete@synkro.in');

