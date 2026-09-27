import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'interior.db'));
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin','employee')), created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    project TEXT NOT NULL, message TEXT NOT NULL, status TEXT DEFAULT 'new', created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL,
    cover_image TEXT NOT NULL, gallery_json TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const seedUsers = [
  ['Ava Hart', 'admin@interior.com', 'Admin@123', 'admin'],
  ['Leah Chen', 'employee@interior.com', 'Employee@123', 'employee'],
];
for (const [name, email, password, role] of seedUsers) {
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (!exists) db.prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)').run(name, email, bcrypt.hashSync(password, 12), role);
}

const seedProjects = [
  ['The Meridian Loft', 'Urban living', 'A calm, tactile city home built around natural light and considered storage.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85', ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85']],
  ['Sable Residence', 'Luxury home', 'Soft contrast, sculptural furniture, and warm stone create an easy sense of quiet luxury.', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85', ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85']],
  ['Noma Studio', 'Creative workspace', 'A high-energy studio with flexible zones for focused work and spontaneous collaboration.', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85', ['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85']],
];
if (db.prepare('SELECT COUNT(*) AS count FROM projects').get().count === 0) {
  const insert = db.prepare('INSERT INTO projects (title,category,description,cover_image,gallery_json) VALUES (?,?,?,?,?)');
  for (const [title, category, description, cover, gallery] of seedProjects) insert.run(title, category, description, cover, JSON.stringify(gallery));
}

function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try { req.user = jwt.verify(token, JWT_SECRET); next(); } catch { res.status(401).json({ error: 'Authentication required' }); }
}
function staffOnly(req, res, next) { return ['admin', 'employee'].includes(req.user.role) ? next() : res.status(403).json({ error: 'Staff access required' }); }

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email || '').trim().toLowerCase());
  if (!user || !bcrypt.compareSync(String(password || ''), user.password_hash)) return res.status(401).json({ error: 'Invalid email or password' });
  const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
app.get('/api/auth/me', auth, (req, res) => res.json({ user: req.user }));
app.get('/api/projects', (_req, res) => res.json(db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all().map((p) => ({ ...p, gallery: JSON.parse(p.gallery_json) }))));
app.get('/api/projects/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  res.json({ ...p, gallery: JSON.parse(p.gallery_json) });
});
app.post('/api/leads', (req, res) => {
  const { name, email, phone, project, message } = req.body;
  if (!name || !email || !phone || !project || !message) return res.status(400).json({ error: 'All fields are required' });
  const result = db.prepare('INSERT INTO leads (name,email,phone,project,message) VALUES (?,?,?,?,?)').run(name, email, phone, project, message);
  res.status(201).json({ id: result.lastInsertRowid, message: 'Inquiry received' });
});
app.get('/api/leads', auth, staffOnly, (_req, res) => res.json(db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all()));
app.patch('/api/leads/:id', auth, staffOnly, (req, res) => {
  db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json({ ok: true });
});

const dist = path.join(__dirname, '..', 'dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Atelier Forme API listening on ${port}`));
