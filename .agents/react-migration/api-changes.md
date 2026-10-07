# Cambios en la API requeridos por la migración

Registro de endpoints/ajustes necesarios en `venus/api` para soportar las vistas migradas.
Se actualiza a medida que se migran módulos.

| Módulo | Cambio | Estado |
|---|---|---|
| Avisos institucionales | `controllers/avisos/` (CRUD tabavisroll, tabavisusua, avisrolldest) | ✅ Implementado |
| Avisos — upload imagen/archivo | rutas con `uploadAlert.any()` + `imagen='p/c/<idInst>/<file>'` (carpeta `public/archivos/avisos/<idInst>/`) | ✅ Implementado |
| Novedades/Asistencias SAE | `controllers/novedades/` (public.tabnove) | ✅ Implementado |
| Disciplina | `controllers/disciplina/` (tabdisci, tabdiscinst, tabdiscnota) | ✅ Implementado |
| PQRS | `controllers/pqrs/` (aepqr, respuestas, tipos) | ✅ Implementado |
| Config/Ayuda | `controllers/configapp/` (ayuda, condiciones, solicitudes, mediciones, tipos certificado, avisos internos, tipos citación) | ✅ Implementado |
| Plantillas WhatsApp | `controllers/templates/` (contact.aetempmess*) | ✅ Implementado |
| Mapeo identidad SAE↔Escuelapp | `controllers/migracion/` (map_*) | ✅ Implementado |
| Catálogos simples adicionales | `controllers/catalogos/` (config, evaluaciones, log competencias, sucursales, utilidades, cursem, eventos, motivos) | ✅ Implementado |
| Reportes PDF/Excel | Endpoint `GET/POST /sae/reportes/:tipo` (boletines, certificados, constancias) con `exceljs`/`excel4node` | ⏳ Pendiente |
| Planilla de calificación | Endpoint masivo de notas por curso/periodo | ⏳ Pendiente |
| Promoción masiva | `POST /sae/promover` | ✅ Implementado |
| Estadísticas | `controllers/estadisticassae/` | ✅ Implementado |
