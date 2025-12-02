CREATE TABLE IF NOT EXISTS lead_status (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  status TEXT,
  message_sent TEXT,
  reply TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
