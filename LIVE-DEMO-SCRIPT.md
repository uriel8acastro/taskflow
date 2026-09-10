# Script de la demo en vivo — "Agregar fecha límite a las tareas"

Este documento recorre en comandos exactos el caso de la sección 7 del SCMP de TaskFlow (`SCMP_Ejemplo_TaskFlow_Didactico.md`). Está pensado para que **tú lo ejecutes en vivo frente a los estudiantes**, narrando cada paso.

**Estado de partida:** el repo está en `v1.4.0`, sin el campo `fecha_limite`. Duración estimada de la demo: 15-20 minutos.

> 💻 **Nota sobre la terminal según tu sistema operativo:** en **Windows**, corre esta demo desde **Git Bash** (se instala junto con Git) — así los comandos son idénticos a Mac/Linux, incluyendo el paso de crear la migración.

---

## Preparación (antes de clase, no en vivo)

```bash
# 1. Verifica que todo corre localmente
cd backend
npm ci
npm test

# 2. Súbelo a un repositorio de GitHub (reemplaza la URL)
cd ..
git init
git add .
git commit -m "chore: baseline inicial v1.4.0"
git tag v1.4.0
git branch -M main
git remote add origin https://github.com/TU_USUARIO/taskflow-demo.git
git push -u origin main --tags
```

> Verifica que la pestaña **Actions** de GitHub muestre el pipeline corriendo en verde antes de entrar a clase.

---

## Paso 1 — El "ticket" (narrado, sin herramienta)

Di en voz alta: *"Un usuario pidió: 'agregar fecha límite a las tareas'. Vamos a seguir el flujo completo de control de cambios del SCMP."*

Recuerda a los estudiantes la regla del SCMP (sección 2): **esto toca el esquema de base de datos → requiere aprobación del CCB.** Simula esa aprobación diciendo quién la daría en un caso real.

---

## Paso 2 — Crear la rama de feature

```bash
git checkout -b feature/fecha-limite
```

---

## Paso 3 — Crear la migración (CI: `taskflow-db-schema`)

Abre el archivo en tu editor (funciona igual en Mac, Linux y Windows — evita el heredoc de terminal, que da problemas de comillas en algunos sistemas):
```bash
code migrations/0002_add_fecha_limite.sql
```
Escribe este contenido dentro del archivo (no en la terminal) y guarda:
```sql
-- Migración 0002: agrega fecha límite a las tareas
ALTER TABLE tasks ADD COLUMN fecha_limite TEXT;
```

**Punto de discusión:** pregunta a la clase — *"¿por qué no simplemente borramos la tabla y la creamos de nuevo con la nueva columna?"* (Respuesta esperada: se perderían los datos existentes; las migraciones incrementales son la forma segura de evolucionar un esquema en producción.)

---

## Paso 4 — Modificar el backend (CI: `taskflow-api`)

Edita `backend/server.js`:

En el endpoint `POST /api/tasks`, cambia:
```js
const { title } = req.body;
```
por:
```js
const { title, fecha_limite } = req.body;
```

Y el INSERT:
```js
const result = db
  .prepare('INSERT INTO tasks (title, fecha_limite) VALUES (?, ?)')
  .run(title.trim(), fecha_limite || null);
```

En el endpoint `PUT /api/tasks/:id`, agrega el manejo de `fecha_limite` de forma análoga a `title`.

Sube la versión en `backend/package.json`: `"version": "1.5.0"`.

---

## Paso 5 — Modificar el frontend (CI: `taskflow-frontend`)

En `frontend/index.html`, agrega un segundo input dentro del `<form>`:
```html
<input type="date" id="due-date-input" />
```

En `frontend/app.js`, envía el campo en el `POST` del formulario (agrega `fecha_limite: document.getElementById('due-date-input').value` al body).

---

## Paso 6 — Pruebas locales

```bash
cd backend
npm test
```

**Punto de discusión:** los tests existentes deben seguir pasando (no rompimos nada) — esto ilustra por qué las pruebas de regresión son parte de la GC, no un extra.

---

## Paso 7 — Commit, push y Pull Request

```bash
git add .
git commit -m "feat: agregar fecha_limite a las tareas (TASKFLOW-101)"
git push origin feature/fecha-limite
```

Abre GitHub → **Compare & pull request** → muestra en vivo cómo el pipeline de Actions corre automáticamente sobre el PR.

---

## Paso 8 — Merge y etiquetado de versión

```bash
git checkout main
git merge feature/fecha-limite
git tag v1.5.0
git push origin main --tags
```

---

## Paso 9 — "Desplegar" (simular producción localmente)

```bash
docker compose -f infra/docker-compose.yml up --build
```

Abre `http://localhost:3000` y crea una tarea con fecha límite para mostrar que funciona de punta a punta.

---

## Paso 10 — Congelar la baseline de release

Narra: *"Esta es la nueva baseline de release: `taskflow-api v1.5.0` + `taskflow-frontend v1.5.0` + migración `0002` aplicada + `taskflow-infra` en el tag `v1.5.0`."* Esto es exactamente la sección 3.2 del SCMP en acción.

---

## Bono — Provocar el fallo a propósito (para la pregunta de discusión de la sección 7 del SCMP)

Para ilustrar *"¿qué pasa si el orden de despliegue es incorrecto?"*:

```bash
# Detén el contenedor
docker compose -f infra/docker-compose.yml down

# Vuelve a un estado donde el CÓDIGO espera fecha_limite
# pero la BASE DE DATOS aún no tiene la migración 0002 aplicada
# (borra el volumen de datos para simular una BD "vieja" sin la migración)
docker volume rm infra_taskflow-data

# Comenta temporalmente la línea que ejecuta runMigrations() en server.js
# y vuelve a levantar — verás el error "no such column: fecha_limite"
```

Muestra el error en la terminal o en los logs (`docker compose logs`). Esto conecta directamente con la pregunta de discusión del SCMP: **el orden de despliegue también es parte de la gestión de la configuración.**

**Para revertir la demo del fallo:** vuelve a descomentar `runMigrations()` y reinicia el contenedor.

---

## Paso 11 (opcional) — Mostrar un rollback real

```bash
git checkout tags/v1.4.0 -- backend frontend migrations
docker compose -f infra/docker-compose.yml up --build
```

Esto vuelve todo el código a la versión anterior sin perder el historial — ilustra por qué los tags de Git son la base de un rollback confiable.
