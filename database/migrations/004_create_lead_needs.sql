CREATE TABLE IF NOT EXISTS lead_needs (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  need_type TEXT,
  priority TEXT,
  extra_notes TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
