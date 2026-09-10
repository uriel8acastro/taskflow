# Estructura de TaskFlow para estudiantes

TaskFlow permite crear, consultar, completar y eliminar tareas. El navegador envía solicitudes HTTP al servidor, y el servidor consulta SQLite.

## Tecnologías

- Node.js ejecuta JavaScript en el servidor. La práctica docente se ejecutó con Node 24.19.0 y npm 11.17.0.
- npm instala dependencias y ejecuta los comandos de package.json.
- Express organiza rutas HTTP y respuestas, y entrega la interfaz al navegador.
- better-sqlite3 conecta el servidor con SQLite.
- cors configura acceso desde otros orígenes web.
- Jest ejecuta pruebas y Supertest envía solicitudes a la API durante ellas. Son dependencias de desarrollo.
- La interfaz usa HTML, CSS y JavaScript, sin un framework de frontend.

## Dónde está cada cosa

| Archivo o carpeta | Función |
|---|---|
| frontend/index.html | Estructura de la pantalla y formulario |
| frontend/style.css | Colores, tamaños y distribución |
| frontend/app.js | Solicitudes a la API y actualización de pantalla |
| backend/server.js | Rutas de la API, validación y entrega de archivos de interfaz |
| backend/db.js | Apertura de SQLite y ejecución de migraciones |
| backend/package.json | Nombre, versión, dependencias y scripts start y test |
| backend/package-lock.json | Versiones exactas resueltas, relaciones, origen e integridad |
| backend/tests/api.test.js | Seis comprobaciones de la API |
| migrations/0001_init.sql | Creación del esquema inicial de tareas |
| data/taskflow.db | Datos locales; se genera al arrancar normalmente |
| infra/Dockerfile | Construcción de la imagen Docker |
| infra/docker-compose.yml | Puerto, construcción y volumen del contenedor |
| .github/workflows/ci-cd.yml | Pruebas, construcción Docker y comprobación de arranque |
| CHANGELOG.md | Historial del proyecto |
| docs/SCMP.md | Plan que el equipo debe elaborar |
| docs/evidencias/ | Carpeta que el equipo crea para SBOM y evidencias |

Las carpetas que comienzan con punto pueden estar ocultas en el explorador.

## Dependencias

package.json declara dependencias directas y rangos permitidos. package-lock.json registra las versiones concretas de estas y de las dependencias transitivas, que son las que necesitan otras bibliotecas. Por ejemplo, Express utiliza qs.

node_modules contiene los paquetes instalados. No se entrega ni se versiona; se reconstruye con npm ci. Node.js se instala aparte, no dentro de esa carpeta.

## Recorrido de una tarea

1. El usuario escribe un título y pulsa Agregar.
2. frontend/app.js envía POST /api/tasks.
3. Express recibe la solicitud en server.js y el código valida el título.
4. better-sqlite3 ejecuta SQL para guardar la tarea.
5. La API devuelve la tarea y el navegador actualiza la pantalla.

GET /api/tasks lista tareas; PUT /api/tasks/:id actualiza una; DELETE /api/tasks/:id la elimina. GET /api/health devuelve estado y versión; no sustituye las pruebas funcionales.

## Primera ejecución

Desde la raíz taskflow:

```bash
cd backend
npm ci
npm test
npm start
```

Abrir http://localhost:3000 y crear y completar una tarea. Ctrl+C detiene el servidor.

npm test ejecuta Jest y seis pruebas: salud, creación, listado, actualización, eliminación y rechazo de título ausente. En esta edición usan SQLite en memoria y no borran el archivo de datos de la aplicación. Que pasen no demuestra ausencia de todos los defectos ni vulnerabilidades.

## SBOM y evidencias

npm audit consulta vulnerabilidades conocidas. El SBOM inventaría componentes y versiones; no corrige vulnerabilidades ni demuestra funcionamiento.

Desde backend:

```bash
mkdir -p ../docs/evidencias
npm sbom --sbom-format=cyclonedx --package-lock-only > ../docs/evidencias/SBOM_v1.4.0.cdx.json
```

Crear también SBOM_v1.4.0.md con fecha, versiones de Node/npm, comando, tres componentes observados y hallazgos. Si el comando falla, registrar el error y no presentar un JSON vacío como evidencia válida.

Antes de crear el commit y tag iniciales, preparar docs/SCMP.md y las evidencias. Código, manifiestos, lock, migraciones, infraestructura, workflow y documentación son elementos de configuración controlados. data/ y node_modules/ son locales y están excluidos por .gitignore.
