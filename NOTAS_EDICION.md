# Edición estudiantil corregida

Esta distribución conserva la versión didáctica 1.4.0 para mantener el recorrido del curso hacia 1.5.0. Es una revisión del paquete original, no el mismo artefacto ni una sustitución de etiquetas Git existentes.

## Cambios

- backend/db.js selecciona SQLite en memoria cuando NODE_ENV es test.
- backend/tests/api.test.js activa ese entorno antes de cargar el servidor, elimina el borrado del archivo real y cierra la conexión al terminar.
- README usa npm ci y un tag anotado.
- Se incluye una guía de estructura para estudiantes.

No se actualizaron dependencias: los hallazgos de npm audit observados en la práctica siguen pendientes de tratamiento. No incluye datos personales, node_modules ni evidencias de la práctica del docente.

Si ya existe una línea base etiquetada, registrar esta corrección en una rama y asignar una nueva versión según el SCMP; no mover ni recrear el tag existente. En un repositorio nuevo, elaborar SCMP y evidencias antes de congelar la línea base inicial.

## Verificación de esta distribución

Los dos archivos de código corregidos coinciden con la copia de práctica del docente, donde se observaron seis pruebas aprobadas y conservación de la tarea original. Se verificaron nuevamente la selección de SQLite en memoria, la migración y la escritura temporal. La repetición completa con Supertest en el entorno de empaquetado quedó bloqueada por restricciones de apertura de puertos (EPERM). No se realizó una instalación limpia ni una prueba Docker en este empaquetado.
