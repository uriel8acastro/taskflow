// db.js
// Responsable de: abrir la base de datos SQLite y aplicar migraciones pendientes.
// Esto materializa el CI "taskflow-db-schema" del SCMP: cada archivo en /migrations
// es una línea base incremental del esquema, aplicada de forma secuencial y registrada.

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_PATH =
  process.env.NODE_ENV === 'test'
    ? ':memory:'
    : path.join(DB_DIR, 'taskflow.db');
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

function ensureMigrationsTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function appliedMigrations() {
  ensureMigrationsTable();
  const rows = db.prepare('SELECT filename FROM schema_migrations').all();
  return new Set(rows.map((r) => r.filename));
}

function runMigrations() {
  ensureMigrationsTable();
  const already = appliedMigrations();

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // el orden numérico del nombre define el orden de aplicación

  const insertRecord = db.prepare(
    'INSERT INTO schema_migrations (filename) VALUES (?)'
  );

  for (const file of files) {
    if (already.has(file)) continue;

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    console.log(`[migrations] aplicando ${file} ...`);

    const applyTx = db.transaction(() => {
      db.exec(sql);
      insertRecord.run(file);
    });
    applyTx();

    console.log(`[migrations] ${file} aplicada correctamente.`);
  }
}

module.exports = { db, runMigrations, DB_PATH };
