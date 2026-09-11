# SBOM — TaskFlow v1.6.0 (LB-03)

- **Fecha de generación:** 2026-09-10
- **Versión:** v1.6.0 (línea base LB-03, rama `feature/fecha-limite`)
- **Formato:** CycloneDX JSON (spec 1.5)
- **Archivo:** `SBOM_v1.6.0.cdx.json` (382 componentes)
- **Entorno de generación:** contenedor `node:24-slim` (sin Node local)
  - Node `v24.21.0`
  - npm `11.19.0`

## Comando utilizado

Desde `backend/` (ejecutado dentro del contenedor), previo bump de versión:

```bash
npm version 1.6.0 --no-git-tag-version
npm sbom --sbom-format=cyclonedx --package-lock-only > ../docs/evidencias/SBOM_v1.6.0.cdx.json
```

## Componentes observados (muestra)

| Componente | Versión |
|---|---|
| better-sqlite3 | 12.11.1 |
| express | 4.22.2 |
| cors | 2.8.6 |

## Hallazgos de npm audit

- **Auditoría completa (incluye devDependencies):** 5 vulnerabilidades (3 moderadas, 2 altas).
- **Solo dependencias de producción (`--omit=dev`):** 3 vulnerabilidades moderadas.

El SBOM inventaría componentes y versiones; no corrige vulnerabilidades ni demuestra funcionamiento de la aplicación.
