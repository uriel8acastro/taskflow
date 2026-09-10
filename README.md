# TaskFlow — Repo de ejemplo para el módulo de Gestión de la Configuración

Este repositorio es el soporte práctico del `SCMP_Ejemplo_TaskFlow_Didactico.md` visto en clase. Está pensado para que el instructor lo use como demo en vivo del flujo completo de gestión de la configuración: identificación de CIs, control de cambios, versionado, CI/CD y rollback.

## Estructura del proyecto (mapeada a los CIs del SCMP)

```
taskflow/
├── backend/            → CI: taskflow-api (Node.js + Express + SQLite)
│   ├── server.js
│   ├── db.js            (runner de migraciones)
│   ├── package.json      (versión = versión de taskflow-api)
│   └── tests/
├── frontend/           → CI: taskflow-frontend (HTML/CSS/JS estático)
├── migrations/         → CI: taskflow-db-schema (archivos SQL numerados)
├── infra/              → CI: taskflow-infra (Dockerfile + docker-compose)
├── .github/workflows/  → Pipeline de CI/CD (GitHub Actions)
├── CHANGELOG.md         (historial de versiones)
└── LIVE-DEMO-SCRIPT.md  (guion paso a paso para la clase en vivo)
```

## Requisitos

- Node.js 18+ (probado con Node 22)
- Docker y Docker Compose (para la demo de infraestructura/despliegue)
- Una cuenta de GitHub (para ver el pipeline de CI/CD en acción)

## Cómo correrlo localmente (sin Docker)

```bash
cd backend
npm ci
npm test        # corre la suite de pruebas
npm start        # levanta el servidor en http://localhost:3000
```

La primera vez que arranca, `db.js` crea automáticamente `data/taskflow.db` y aplica las migraciones pendientes de la carpeta `migrations/`.

## Cómo correrlo con Docker (simula "producción")

```bash
docker compose -f infra/docker-compose.yml up --build
```

Luego abre `http://localhost:3000`.

## Cómo subirlo a GitHub y activar el pipeline

```bash
git init
git add .
git commit -m "chore: baseline inicial v1.4.0"
git tag -a v1.4.0 -m "LB-01: TaskFlow inicial verificado"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/taskflow-demo.git
git push -u origin main --tags
```

El workflow en `.github/workflows/ci-cd.yml` correrá automáticamente: instala dependencias, ejecuta las pruebas, construye la imagen Docker y hace un *smoke test* contra el endpoint `/api/health`.

## Para la demo en vivo

Sigue **`LIVE-DEMO-SCRIPT.md`** — recorre en comandos exactos el caso de la sección 7 del SCMP ("agregar fecha límite a las tareas"), incluyendo cómo provocar un fallo a propósito para discutir el orden de despliegue.

## Notas pedagógicas

- El frontend se sirve como archivos estáticos desde el mismo servidor Express, para simplificar la demo a un solo contenedor. En un sistema real normalmente serían despliegues independientes — vale la pena aclararlo en clase.
- `better-sqlite3` se usó por ser síncrono y fácil de leer en vivo frente a estudiantes; en producción real se usaría típicamente Postgres/MySQL con una herramienta de migraciones dedicada (Flyway, Alembic, Prisma Migrate, etc.) — el *concepto* de migración numerada y versionada es el mismo.

## Edición estudiantil corregida

Lee `GUIA_ESTRUCTURA_TASKFLOW.md` antes de comenzar. Esta edición conserva la versión didáctica 1.4.0 y corrige el aislamiento de pruebas; no es idéntica al ZIP original. Consulta `NOTAS_EDICION.md`.
