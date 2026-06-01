import express from "express";
import path from "path";
import Database from "better-sqlite3";
import cors from "cors";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Configurar o SQLite
const db = new Database(':memory:'); // Em produção, mude para 'leads.db' para persistência em disco. Como o container é efêmero, deixarei em memória, mas idealmente seria Supabase/Firebase.
// O usuário no momento quer o SQLite para testar o painel
// Vamos criar um banco de dados real em arquivo para teste:
const isProduction = process.env.NODE_ENV === "production";
const dbPath = isProduction ? path.join(process.cwd(), 'leads.db') : 'leads.db';
const persistentDb = new Database(dbPath);

persistentDb.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    date TEXT
  )
`);

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/leads", (req, res) => {
  try {
    const stmt = persistentDb.prepare("SELECT * FROM leads ORDER BY date DESC");
    const leads = stmt.all();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

app.post("/api/leads", (req, res) => {
  const { id, name, email, phone, message } = req.body;
  if (!email || !phone) {
    return res.status(400).json({ error: "Email and phone are required" });
  }
  
  try {
    const date = new Date().toLocaleString('pt-BR');
    const stmt = persistentDb.prepare(
      "INSERT INTO leads (id, name, email, phone, message, date) VALUES (?, ?, ?, ?, ?, ?)"
    );
    stmt.run(id, name, email, phone, message, date);
    
    // Retorna a lista atualizada
    const getStmt = persistentDb.prepare("SELECT * FROM leads ORDER BY date DESC");
    const leads = getStmt.all();
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
