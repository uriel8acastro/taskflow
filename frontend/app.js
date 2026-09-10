// app.js — CI: taskflow-frontend
// NOTA PARA LA DEMO EN VIVO:
// Este archivo representa la versión v1.4.0 (sin campo "fecha límite").
// El paso 4 del LIVE-DEMO-SCRIPT.md pide agregar aquí el campo fecha_limite.

const API = '/api/tasks';

const form = document.getElementById('task-form');
const input = document.getElementById('title-input');
const list = document.getElementById('task-list');
const versionEl = document.getElementById('version');

async function loadVersion() {
  const res = await fetch('/api/health');
  const data = await res.json();
  versionEl.textContent = `taskflow-api v${data.version}`;
}

async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();
  render(tasks);
}

function render(tasks) {
  list.innerHTML = '';
  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!task.completed;
    checkbox.addEventListener('change', () => toggleTask(task));

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.title;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '✕';
    del.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(del);
    list.appendChild(li);
  }
}

async function toggleTask(task) {
  await fetch(`${API}/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !task.completed }),
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadTasks();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  input.value = '';
  loadTasks();
});

loadVersion();
loadTasks();
