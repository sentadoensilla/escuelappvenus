# Pendientes, Deuda Técnica y Riesgos

## Control de calidad de formularios

El seguimiento de pruebas manuales de todas las pantallas está en
`venus/control_calidad_formularios.csv` (tab-separado; estados:
`PENDIENTE`, `EN_PRUEBAS`, `APROBADO`, `CON_OBSERVACIONES`, `BLOQUEADO`).
Compartir con el equipo para que cada probador marque sus avances.

## Pendientes (frontend)
- **Novedades/Asistencias SAE** (`public.tabnove`): página dedicada (hoy solo genérico).
- **Disciplina** (`tabdisci`, `tabdiscinst`, `tabdiscnota`): página dedicada.
- **PQRS, ayuda, condiciones, solicitudes, mediciones, tipos certificado, avisos internos,
  plantillas WhatsApp** (`pqrs`, `configapp`, `templates` API): sin UI.
- **Reportes**: boletines, certificados, constancias, paz y salvo (PDF/Excel) — falta
  endpoint de generación en la API y pantalla de solicitud/descarga.
- **Planilla de calificación** por curso (fila=estudiante, columna=competencia): requiere
  página dedicada + endpoint de guardado masivo.
- **Variantes por rol** (`co.*`, `coor.*`, `se.*`) y homes por rol.
- **Cargas masivas** (CSV/Excel) de docentes, estudiantes, matrículas.
- **Menú SAE**: el login lee directamente `logic.tabmenu`/`tabopcimenu` + `logic.tabrollopci`/`tabusuaopci` (hecho; ya **no** se importa a `engine.aemenu`/`aeopcmenu`).

## Siguiente módulo recomendado

Tras el piloto de Avisos, el patrón quedó fijado. Candidatos naturales (API lista, falta UI):

1. **Novedades/Asistencias SAE** (`/sae/novedades/*`) — CRUD simple tipo Avisos; buen
   siguiente paso para consolidar el patrón.
2. **Disciplina** (`/sae/disciplinas|discinst|discnotas/*`) — tres tablas; algo más de
   complejidad (selección de matrícula).
3. **Reportes/boletines** — requiere primero endpoint PDF/Excel en la API.

Cada uno debe incluir: páginas `pages/<modulo>/`, registro de rutas y **menú dinámico en BD**
(esquema `logic`) con `api/scripts/sync_logic_menu.js`.

## Deuda técnica
- Muchas rutas de `mainroutes.js` apuntan a `pages/login` (placeholders): exámenes, tareas,
  consultas, calendario, help, config.
- `services/navigator.js` hardcodeado ("Hizrian"); no usar de referencia.
- JWT del backend expira en 2 minutos.
- Sesión solo conoce la institución Escuelapp (`aeinst_id`), no la SAE (`cinstid`);
  falta mapeo vía `migracion.map_institucion`/`integration.tabenla` para precargar
  institución en formularios SAE.
- **Tableros: validar respuestas antes de guardar estado.** Los endpoints
  `/totals/statsinitial/*` responden `{status:'error', statusCode:400, rows:{}}` cuando no hay
  datos. Comparar `rows !== "{}"` (objeto vs string) siempre es `true`, deja `title`/`data`
  `undefined` y revienta componentes que asumen `data.length`. Usar
  `statusCode === 200 && rows` con contenido real. `Listado`
  (`src/pages/components/tables.js`) ahora normaliza `data`/`columns` con `Array.isArray`.

## Corregido
- **Pantalla en blanco del estudiante (rama `dashstudent`)**: `src/pages/dashboardStudent.js`
  ya no invoca endpoints con guarda `isDirector_and_tecaher` (`attendancesteacher`,
  `attendancesteacherbyday`, `listUnnattendance`, `listUnnattendanceGroup`) ni monta sus widgets;
  valida las respuestas con `respuestaConDatos()` y `useEffect` quedó antes del `return`
  condicional (regla de hooks). Ver `.agents/frontend.md` §11.

## Riesgos
- **IDs históricos**: nunca reutilizar IDs; respetar `MAX(id)+1` y tablas históricas
  (`tabnota2013..2016`, copias `ae*_old`).
- **Borrado lógico** en dos convenciones: SAE `8/9/2` vs Escuelapp `9/0`.
- **Encriptación PK/FK**: el frontend debe `tool.encriptar()` las FKs crudas; el PK ya
  llega encriptado y se reenvía tal cual.
- **Sin FKs físicas** en `data`/`engine`: integridad por lógica de app.
- **Reportes con formato** complejo (logos, firmas, sellos): definir bien el layout en API.
- No duplicar entidades académicas: SAE es fuente de verdad para datos institucionales/
  académicos; Escuelapp gestiona agenda/comunicación.
