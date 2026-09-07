import express from 'express';
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const db = new Database(path.join(__dirname, 'reservations.db'));

db.exec(`CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/reservations', (req, res) => {
  const { name, email, phone, date, time, guests, notes } = req.body;
  if (!name || !email || !date || !time || !guests) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }
  const insert = db.prepare(`INSERT INTO reservations (name, email, phone, date, time, guests, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const result = insert.run(name.trim(), email.trim(), phone?.trim() || '', date, time, Number(guests), notes?.trim() || '');
  res.status(201).json({ id: result.lastInsertRowid, message: 'Your table is held.' });
});

app.use((req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`The Ivory Table is pouring at http://localhost:${port}`));
