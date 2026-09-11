# Changelog — TaskFlow

Todas las versiones siguen [SemVer](https://semver.org/lang/es/): `MAJOR.MINOR.PATCH`.

## [1.6.0] - 2026-09-10 — LB-03 (línea base candidata, rama `feature/fecha-limite`)
### Added
- Campo opcional `due_date` (YYYY-MM-DD) en las tareas (TASKFLOW-101).
  - `POST /api/tasks` acepta y valida `due_date`; `GET` la devuelve cuando existe.
  - `PUT /api/tasks/:id` permite actualizar o limpiar `due_date`.
- Migración `0002_add_due_date.sql`: columna `due_date` en `tasks` (conserva las tareas existentes).
- Pruebas de `due_date` en `backend/tests/api.test.js` (8/8 verdes).
- SBOM CycloneDX v1.6.0 en `docs/evidencias/` (382 componentes).

### Changed
- `PUT /api/tasks/:id` valida y normaliza `title` igual que `POST` (HTTP 400 si está vacío o no es texto).
- Versión del paquete a `1.6.0` en `backend/package.json` y `backend/package-lock.json`.

## [1.5.0] - 2026-09-09 — LB-02
### Added
- Evidencias SBOM CycloneDX v1.4.0 y v1.5.0 en `docs/evidencias/` (generadas en contenedor `node:24-slim`).

### Changed
- Versión del paquete a `1.5.0` en `backend/package.json` y `backend/package-lock.json`.

## [1.4.0] - Baseline de release actual
### Added
- Marcado de tareas como completadas.
- Eliminación de tareas.

## [1.3.0]
### Added
- Listado de tareas ordenado por más recientes.

## [1.2.0]
### Added
- Endpoint de creación de tareas (`POST /api/tasks`).
- Validación de campo `title` requerido.

## [1.1.0]
### Added
- Runner de migraciones (`schema_migrations`), aplicado automáticamente al iniciar.

## [1.0.0]
### Added
- Esquema inicial de base de datos (migración `0001_init.sql`).
- Servicio base Express con health check (`GET /api/health`).
