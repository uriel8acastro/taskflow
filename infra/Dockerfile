# CI: taskflow-infra
# La versión de Node se inyecta desde docker-compose (engines de backend/package.json)
ARG NODE_VERSION=24

# --- Etapa 1: tests (jest + supertest). Si un test falla, el build se aborta. ---
FROM node:${NODE_VERSION}-slim AS test
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm ci
COPY backend ./backend
COPY migrations ./migrations
RUN cd backend && npm test && touch /tmp/tests-ok

# --- Etapa 2: imagen final de producción (solo dependencias de runtime) ---
FROM node:${NODE_VERSION}-slim AS runtime
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev
COPY backend/server.js ./backend/server.js
COPY backend/db.js ./backend/db.js
COPY frontend ./frontend
COPY migrations ./migrations
# Referencia al artefacto de la etapa de tests: obliga a BuildKit a ejecutar los tests en cada build.
COPY --from=test /tmp/tests-ok /tmp/tests-ok
WORKDIR /app/backend
EXPOSE 3000
CMD ["node", "server.js"]
