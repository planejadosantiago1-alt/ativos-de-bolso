import Database from 'better-sqlite3';

const db = new Database('leads.db');
try {
  const config = db.prepare('SELECT * FROM config').all();
  console.log('Config:', config);
} catch (e) {
  console.log('No config table yet');
}

try {
  const leads = db.prepare('SELECT * FROM leads').all();
  console.log('Leads:', leads);
} catch (e) {
  console.log('No leads table yet');
}
