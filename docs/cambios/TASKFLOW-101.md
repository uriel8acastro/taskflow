# TASKFLOW-101 · Fecha límite opcional para las tareas
 
## Solicitud
Permitir que una tarea tenga una fecha límite opcional YYYY-MM-DD.
 
## Alcance
API, persistencia, migración, pruebas, versión, SBOM y CI.
 
## Criterios de aceptación
1. POST /api/tasks acepta una fecha opcional.
2. POST y GET devuelven la fecha cuando existe.
3. Una tarea sin fecha continúa siendo válida.
4. Una fecha inválida obtiene HTTP 400.
5. La migración conserva las tareas existentes.
6. Pruebas anteriores y nuevas quedan verdes.
 
## Riesgos
Fechas inválidas; incompatibilidad; pérdida de datos;
desalineación entre versión interna, SBOM y tag.
 
## Responsables y decisión
Desarrollo: Cesar. Revisión: Juan. CCB: Brandon.
Autorizado para implementar; liberación condicionada a PR aprobado y CI verde.
