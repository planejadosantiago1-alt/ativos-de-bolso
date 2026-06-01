import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Banco de Dados SQLite
const dbPath = path.join(process.cwd(), 'leads.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    date TEXT NOT NULL
  )
`);

// Endpoints da API
app.get('/api/leads', (req, res) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY date DESC').all();
    res.json(leads);
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

app.post('/api/leads', (req, res) => {
  const { id, name, email, phone, message, date } = req.body;
  
  try {
    const insert = db.prepare(`
      INSERT INTO leads (id, name, email, phone, message, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insert.run(id, name, email, phone, message, date);
    
    const updatedLeads = db.prepare('SELECT * FROM leads ORDER BY date DESC').all();
    res.status(201).json(updatedLeads);
  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    res.status(500).json({ error: 'Erro ao salvar lead' });
  }
});

app.delete('/api/leads', (req, res) => {
  try {
    db.prepare('DELETE FROM leads').run();
    res.json({ message: 'Leads deletados com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar leads:', error);
    res.status(500).json({ error: 'Erro ao deletar leads' });
  }
});

// Middleware do Vite (Apenas para Desenvolvimento) e Arquivos Estáticos (Produção)
async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();
