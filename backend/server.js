// server.js — CI: taskflow-api
const path = require('path');
const express = require('express');
const cors = require('cors');
const { db, runMigrations } = require('./db');
const pkg = require('./package.json');

runMigrations();

const app = express();
app.use(cors());
app.use(express.json());

// Sirve el frontend estático (para simplificar la demo, un solo contenedor)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// --- Health check: útil para el smoke test del pipeline CI/CD ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: pkg.version });
});

// --- Listar tareas ---
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
  res.json(tasks);
});

// --- Crear tarea ---
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'El campo "title" es requerido.' });
  }
  const result = db
    .prepare('INSERT INTO tasks (title) VALUES (?)')
    .run(title.trim());
  const task = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(result.lastInsertRowid);
  res.status(201).json(task);
});

// --- Actualizar tarea (marcar completada, editar título) ---
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Tarea no encontrada.' });

  const title = req.body.title ?? existing.title;
  const completed =
    req.body.completed !== undefined ? (req.body.completed ? 1 : 0) : existing.completed;

  db.prepare('UPDATE tasks SET title = ?, completed = ? WHERE id = ?').run(
    title,
    completed,
    id
  );
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(updated);
});

// --- Eliminar tarea ---
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`TaskFlow API (v${pkg.version}) escuchando en puerto ${PORT}`);
  });
}

module.exports = app;
