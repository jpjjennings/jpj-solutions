import express from 'express';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'ymmijination.db'));
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, category TEXT NOT NULL, price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0, image TEXT NOT NULL, size TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '', created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`);

const count = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
if (!count) {
  const insert = db.prepare('INSERT INTO products (name, category, price, stock, image, size, description) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const seed = [
    ['Where the Sea Meets Sky', 'Photography', 32, 8, 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85', 'A3 / unframed', 'A quiet study of the north coast in its softest light.'],
    ['Mussenden at Dusk', 'Photography', 38, 4, 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=85', 'A2 / unframed', 'The last blue hour over one of the north coast’s most loved landmarks.'],
    ['Wild Atlantic', 'Canvas', 85, 6, 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1000&q=85', '60 × 40 cm', 'Textured canvas, hand-stretched and ready to hang.'],
    ['Green Fields, Home', 'Photography', 28, 12, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85', 'A3 / unframed', 'A little reminder that home is never very far away.'],
    ['Tide Lines', 'Limited edition', 55, 3, 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1000&q=85', 'A2 / signed', 'A numbered edition of 50, signed and printed locally.'],
    ['The North Coast', 'Canvas', 105, 2, 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=85', '80 × 50 cm', 'A warm, expansive canvas for walls that need a little horizon.']
  ];
  const transaction = db.transaction(() => seed.forEach(item => insert.run(...item)));
  transaction();
}

const app = express();
app.use(express.json());
app.get('/api/products', (_req, res) => res.json(db.prepare('SELECT * FROM products ORDER BY id').all()));
app.post('/api/products', (req, res) => {
  const { name, category, price, stock, image, size, description = '' } = req.body;
  if (!name || !category || price == null || stock == null || !image || !size) return res.status(400).json({ error: 'Please complete every required field.' });
  const result = db.prepare('INSERT INTO products (name, category, price, stock, image, size, description) VALUES (?, ?, ?, ?, ?, ?, ?)').run(name, category, Number(price), Number(stock), image, size, description);
  res.status(201).json(db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid));
});
app.patch('/api/products/:id', (req, res) => {
  const stock = Number(req.body.stock);
  if (!Number.isInteger(stock) || stock < 0) return res.status(400).json({ error: 'Stock must be a whole number.' });
  db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(stock, req.params.id);
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get(/.*/, (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
app.listen(process.env.PORT || 5173, () => console.log('Ymmijination listening on http://localhost:5173'));
