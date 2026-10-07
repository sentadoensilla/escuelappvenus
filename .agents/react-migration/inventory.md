# Inventario de Vistas SAE → ReactJS

Vistas fuente: `/Users/sentadoensilla/side projects/sae/view/*.php` (la carpeta `look/` solo
contiene CSS; las vistas reales están en `view/`). Lógica: `factory/control.*.php`.

Clasificación de cobertura en el frontend de Venus (`src/pages/`):

| Vista PHP | Módulo React / Entidad | Estado | Notas |
|---|---|---|---|
| `institucion`, `institulst`, `institucioncambio`, `confi_inst_secre` | `pages/instituciones/` + `gestion: institucion` | MIGRATED (CRUD) | API `/institucion/*` |
| `docente`, `docentelst`, `tabdoce`, `docentescambio*`, `docentesdistrito` | `pages/docentes/` + `gestion: docentes` | MIGRATED (CRUD) | API `/sae/docentes/*` |
| `estudiante`, `estudiantescambio`, `matricula*`, `coor.matricula*`, `prematri*`, `fichamatricula` | `pages/estudiantes/`, `pages/matriculas/`, `gestion: estudiantes|matriculas` | MIGRATED (CRUD) | API `/sae/estudiantes/*` |
| `cursos`, `co.cursos` | `pages/cursos/` + `gestion: cursos` | MIGRATED (CRUD) | API `/sae/cursos/*` |
| `areas`, `areasedit`, `asignaturas*`, `asigareas`, `temas*` | `pages/areas/`, `pages/asignaturas/`, `gestion: areas|asignaturas` | MIGRATED (CRUD) | API `/sae/pensum` |
| `competencias` | `pages/competencias/` + `gestion: competencias` | MIGRATED (CRUD) | API `/sae/competencias/*` |
| `notasestudiantes`, `calificar*`, `promedioestudiantes` | `pages/notas/` + `gestion: notas` | MIGRATED (CRUD) | API `/sae/notas/*` |
| `observaciones`, `observaestu`, `observadorestu` | `pages/observaciones/` + `gestion: obs*` | MIGRATED (CRUD) | API `/sae/observador` |
| `menu`, `menulst`, `menuopcion` | `pages/menu/` + `gestion: menus|opciones` | MIGRATED | API `/menu`, `/sae/*` |
| `usuario`, `usuariolst`, `asociarusuario`, `permisos`, `privilegios`, `cambioclave`, `editperfil` | `pages/usuarios/` + `gestion: usuarios|roles` | MIGRATED (CRUD) | API `/sae/usuarios` |
| `grado`, `gradolst`, `jornada`, `jornadalst`, `anolec*`, `tiposangre`, `zonaresi*`, `sisben*`, `espeinst*`, `metoinst*`, `estados*`, `tipsubsidio*`, `territorios` | `gestion: grados|jornadas|...` (catálogos) | MIGRATED (CRUD genérico) | API `/catalogos/*` |
| `configuracion_institucion`, `configureinst`, `configuracion_institucion_v` | `gestion: escalas|sie|certificados|constancias|pazsalvo|firmas|resoluciones` | MIGRATED (CRUD genérico) | API `/configuracion/*`, `/catalogos/*` |
| `preescolar` (`boletinespre*`, `listaspre*`, `asignacionespre`) | `gestion: ambitos|dimensiones|preasignaciones|prenotas|prenovedades` | MIGRATED (CRUD genérico) | API `/preescolar/*` |
| **`avisos`** | **`pages/avisos/`** | **MIGRATED (piloto)** | API `/avisos/*` (tabavisroll, tabavisusua, avisrolldest) |
| `inasistencias*`, `faltasestudiantes`, `estadomatricula` | `gestion: novedades` | ANALYZED (CRUD genérico) | API `/sae/novedades/*` (public.tabnove) |
| `calificardisciplina` | `gestion: disciplinas|discinst|discnotas` | ANALYZED (CRUD genérico) | API `/sae/disciplina` |
| `boletines*`, `generarboletin`, `certificados`, `constancias`, `formcertificados` | reportes (pendiente) | NOT_ANALYZED | Falta endpoint PDF/Excel en API |
| `promociones*`, `promover_opcional` | `pages/reportes/promocion.js` | PARTIAL | Promoción masiva implementada |
| `estadisticas*`, `resumen*`, `rendimientoareas` | `pages/reportes/estadisticas.js` | PARTIAL | Estadísticas de matrícula |
| `login`, `inicial`, `ingreso`, `recuperarclave`, `outservice` | `pages/login.js`, `default.js`, `resetpass.js` | MIGRATED | Auth/landing |
| `index.*` (homes por rol) | dashboards (`dashboard*.js`) | PARTIAL | Roles SAE aún no mapeados 1:1 |
| `cordinador`, `dordinador`, `co.*`, `coor.*`, `se.docente`, `secretaria` | (variantes por rol) | NOT_ANALYZED | Reutilizan módulos base |
| `instructivos*`, `granttuser`, `mapaurbano`, `mapinfo`, `seguimientocursos`, `listas*` | (pendientes) | NOT_ANALYZED | — |
| `cargasmasivas`, `matriculamasiva` | (pendiente) | NOT_ANALYZED | Importación CSV/Excel |

## Esquema/API de soporte

- Catálogos: `api/controllers/catalogos/`
- Configuración: `api/controllers/configuracion/`
- Instituciones/sedes: `api/controllers/institucion/`
- Núcleo académico: `anolperiodo`, `cursos`, `pensum`, `docentes`, `estudiantes`
- Evaluación: `indicadores`, `notas`
- Especiales: `observador`, `preescolar`, `avisos`, `novedades`, `disciplina`, `pqrs`,
  `configapp`, `templates`, `migracion`, `estadisticassae`, `integration`
