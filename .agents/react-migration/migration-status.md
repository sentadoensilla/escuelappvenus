# Estado de Migración por Módulo

| Módulo | Vistas PHP | Estado | Notas |
|---|---|---|---|
| Instituciones / Sedes | `institucion*`, `institulst`, `institucioncambio` | MIGRATED | CRUD dedicado + genérico |
| Docentes | `docente*`, `tabdoce`, `docentescambio*` | MIGRATED | CRUD dedicado |
| Estudiantes / Matrículas | `estudiante*`, `matricula*`, `prematri*` | MIGRATED | CRUD dedicado + genérico |
| Cursos | `cursos`, `co.cursos` | MIGRATED | CRUD dedicado |
| Pensum (áreas/asignaturas) | `areas*`, `asignaturas*`, `temas*` | MIGRATED | CRUD dedicado |
| Indicadores / Competencias | `competencias`, `indicadores*` | MIGRATED | CRUD dedicado |
| Calificaciones | `calificar*`, `notasestudiantes`, `promedioestudiantes` | MIGRATED | CRUD (falta planilla por curso) |
| Observador | `observaciones*`, `observaestu`, `observadorestu` | MIGRATED | CRUD + vista dedicada |
| Menús y opciones | `menu*`, `menuopcion` | MIGRATED | Página dedicada |
| Usuarios / roles / permisos | `usuario*`, `permisos`, `privilegios`, `asociarusuario` | MIGRATED | Página dedicada + genérico |
| Catálogos SAE | `grado*`, `jornada*`, `anolec*`, `tiposangre`, `zonaresi*`, `sisben*`, etc. | MIGRATED | CRUD genérico `/catalogos/*` |
| Configuración institucional | `configuracion_institucion*`, `configureinst` | MIGRATED | CRUD genérico |
| Preescolar | `boletinespre*`, `listaspre*`, `asignacionespre` | MIGRATED | CRUD genérico `/preescolar/*` |
| **Avisos institucionales** | **`avisos`** | **MIGRATED (piloto)** | `pages/avisos/avisosList.js` + `avisosAdd.js` (patrón menu) |
| Novedades / Asistencias | `inasistencias*`, `faltasestudiantes`, `estadomatricula` | ANALYZED | CRUD genérico disponible |
| Disciplina | `calificardisciplina` | ANALYZED | CRUD genérico disponible |
| Reportes (boletines, certificados, constancias) | `boletines*`, `certificados`, `constancias`, `form*`, `piepagbole` | NOT_ANALYZED | Requiere endpoints PDF/Excel en API |
| Promoción | `promociones*`, `promover_opcional` | PARTIAL | Página dedicada `reportes/promocion` |
| Estadísticas | `estadisticas*`, `resumen*`, `rendimientoareas` | PARTIAL | Página dedicada `reportes/estadisticas` |
| Auth / landing | `login`, `inicial`, `ingreso`, `recuperarclave`, `outservice` | MIGRATED | — |
| Homes por rol | `index.*` | PARTIAL | Dashboards |
| Variantes rol (co/coor/se) | `co.*`, `coor.*`, `se.docente`, `secretaria` | NOT_ANALYZED | Reutilizan módulos base |
| Varios (instructivos, gantt, mapas, listas) | `instructivos*`, `granttuser`, `mapaurbano`, `mapinfo`, `seguimientocursos`, `listas*` | NOT_ANALYZED | — |
| Cargas masivas | `cargasmasivas`, `matriculamasiva` | NOT_ANALYZED | — |
