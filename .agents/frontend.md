# Estructura y Guía del Frontend — Escuelapp (Venus)

> Documento de referencia para agentes IA y desarrolladores. Describe cómo está construido el frontend React de **Escuelapp**, sus convenciones, lo implementado y cómo seguir codificando (alineado con `api.md`).

---

## 1. Contexto

- **Ruta:** `/home/sentadoensilla/Projects/Venus/venus/venus/`
- **Nombre npm:** `venus` (v0.1.0)
- **Objetivo:** interfaz web **responsive** de Escuelapp (agenda + SAE) para docentes, secretarias, estudiantes y padres de familia, consumiendo la API de `/api`.

## 2. Stack y dependencias

| Categoría | Librerías |
|---|---|
| Framework | `react` 18.2, `react-scripts` 5 (CRA), `react-router-dom` 6.4 |
| UI | `bootstrap` 4.6.2, `react-bootstrap` 2.7, `styled-components`, `@sweetalert2/theme-bootstrap-4` |
| Tablas | `react-data-table-component` 7.5 |
| Formularios | `react-hook-form` 7.40, `react-select`, `react-datepicker`, `react-dropzone` |
| Gráficos | `echarts-for-react` |
| Editor rico | `suneditor` / `suneditor-react`, `draft-js` |
| QR | `react-qr-code` |
| Auth | `jwt-decode`, `crypto-js`, `buffer` |
| Tiempo real | `socket.io-client` |
| Notificaciones UI | `sweetalert2` |
| Utilidades | `jquery`, `react-helmet`, `react-helmet-async` |

**Scripts:** `start` (`react-scripts start`), `build`, `test`, `eject`.

## 3. Estructura de directorios

```
venus/
├── config/.env*, .env, webpack.config.js
└── src/
    ├── App.js / index.js / index.css / App.css
    ├── main/
    │   ├── constants.js          # URLs de API (roots.*) + labels + colores
    │   ├── crudConfig.js         # ⭐ CONFIG central de los módulos CRUD SAE/catálogos
    │   └── routes/mainroutes.js  # Definición de <Route> (lazy)
    ├── services/
    │   ├── tools.js              # localStorage de usuario + encriptar/decriptar + helpers
    │   ├── messenger.js          # wrapper fetch (poster/posterFile/getFile)
    │   ├── routes.js             # publicRoutes + privateRoutes (paths)
    │   ├── navigator.js          # menú lateral (legado; no usar de referencia)
    │   ├── context/UserContext.js
    │   └── exports/
    └── pages/
        ├── login, default, 404, forbidden, notFound, about, contact, agree
        ├── dashboard, dashboardAdmon, dashboardTeacher, dashboardStudent
        ├── asistencias/, citaciones/, comunicados/, excusas/, observaciones/
        ├── menu/, tipodesempeno/, campana/, usuarios/
        ├── gestion/              # ⭐ CRUD genérico (gestionList.js + gestionAdd.js)
        ├── components/           # charts, head, foot, tables, userCard, wpStats, ...
        └── parts/                # waiting, ribbon, draganddrop, ...
```

## 4. Variables de entorno (`.env` raíz)

- `REACT_APP_BACKEND_URL=http://localhost:4004` → base de la API (`roots.engine`).
- `PUBLIC_URL` / `REACT_APP_BASE_URL` → http://localhost:3000.
- `REACT_APP_JWT_PRIVATE_KEY` → clave JWT (debe coincidir con el backend).
- `REACT_APP_NAME`, `REACT_APP_TITLE`, `REACT_APP_LEMA`.

## 5. Flujo de autenticación

1. `pages/login.js` → `messenger.poster` a `roots.engine + roots.login` (`/users/login/`).
2. Respuesta: `rows[0].datos_usuario` (IDs encriptados) y `rows[0].privilegees` (JWT del menú).
3. `tool.setUser()` guarda en `localStorage` (`token`, `nav`, `usuarioid`, `academicoid`, `empresaid`, `usuarioanoid`, `usuariorollid`, ...).
4. El menú lateral se arma en `components/head.js` con `tool.getNav()` (decodifica el JWT `nav`).
5. `messenger.poster` añade `Authorization: Bearer <token>`.

### 5.1 Menú y navegación (motor → tablas de BD)

El menú NO está hardcodeado: el login lo arma desde **esquema `logic`**: `logic.tabmenu` (menús) y `logic.tabopcimenu` (opciones), con privilegios por rol (`logic.tabrollopci`) y por usuario (`logic.tabusuaopci`).
- La columna `logic.tabopcimenu.copcimenuenla` guarda el enlace **sin** `/` inicial (ej. `gestion/cursos`, `areas`, `anolec`).
- El SQL de login (`privilegees`) lo expone como `'/' || copcimenuenla` → `/gestion/cursos`, `/areas`.
- `copcimenuicon` es una clase Font Awesome/Bootstrap (ej. `fa fa-bullhorn`).
- `head.js` renderiza `<NavLink to={opcion.enlace}>` → navega a la ruta del frontend. El icono del menú (no existe columna en `logic.tabmenu`) se deriva del icono de la primera opción activa (fallback `fa fa-folder-open`).

**Para registrar un módulo nuevo en el navegador web** hay que insertar (esquema `logic`):
1. `logic.tabmenu` → un menú (o reutilizar uno).
2. `logic.tabopcimenu` → la opción con `copcimenuenla = <ruta sin "/">` (ej. `gestion/cursos`, `anolec`) y `copcimenuicon = <clase FA>`.
3. `logic.tabrollopci` → el privilegio (rol→opción) **para cada rol** que deba verla
   (`logic.tabroll`: 0 Administrador, 1 Estudiante, 2 Docente, 3 Institución, 4 Acudiente,
   6 Coordinador, 7 Secretaria). Elegir los roles que la guarda de la API permita
   (ej. `isDirector_and_tecaher_and_admin` permite 0/1/2/3/4/6/7 + 201/202/204).

**IMPORTANTE (aplicar en CADA refactorización):** toda nueva ruta del navegador debe
registrarse en `logic.tabmenu` + `logic.tabopcimenu` + `logic.tabrollopci`, o no aparecerá en
el menú de los usuarios al iniciar sesión.

Script reutilizable de sincronización (ajusta rutas/iconos y claves de prueba):
`api/scripts/sync_logic_menu.js`

```bash
cd api
node scripts/sync_logic_menu.js
```

> Nota: `api/scripts/register_menu.js` sigue disponible para el esquema `engine` (legacy Escuelapp).


## 6. El framework CRUD genérico (⭐ nuevo)

Para los módulos SAE y catálogos se implementó un **CRUD genérico por configuración**:

- **`src/main/crudConfig.js`** — exporta `CRUD`, un mapa clave→config:
  - `cat(titulo, tabla, columns, fields)` → entidad de catálogo (endpoints `/catalogos/:tabla/...`).
  - `sae(titulo, recurso, columns, fields)` → entidad SAE (endpoints `/sae/:recurso/...`).
  - `columns`: `[{ header, key, width? }]`.
  - `fields`: `[{ name, label, type, required?, source?, get?, boolean? }]`.
    - `type`: `text | number | date | textarea | select | boolean`.
    - `source` (solo select): `{ tipo:'catalogo'|'sae'|'institucion'|'sedes', tabla?, recurso?, label }`. `label` puede ser `string` (clave) o `function(row)`.
    - `get`: clave cruda del registro para pre-rellenar al editar (default = `name`). Útil cuando el listado devuelve la FK con otro nombre (ej. cursos: `idgrado` → `get:'cgradid'`).
- **`src/pages/gestion/gestionList.js`** — listado genérico. Lee `useParams().entidad`, renderiza la tabla con `components/tables.js` (react-data-table-component) + botones Editar/Eliminar.
- **`src/pages/gestion/gestionAdd.js`** — formulario genérico de alta/edición. Renderiza cada campo según su `type` y carga las opciones de los selects desde sus `source`.

### 6.1 Rutas del framework

- Listado: `/gestion/:entidad`
- Formulario: `/gestion/:entidad/agregar`

Definidas en `services/routes.js` (`GESTION_LIST`, `GESTION_ADD`) y montadas en `main/routes/mainroutes.js`.

### 6.2 Entidades implementadas (config `CRUD`)

- **Catálogos (33):** grados, jornadas, sexos, parentescos, tiposdocumento, tiposnovedad, tiposnota, tiposdesempeno, tiposvinculacion, tipossangre, tipossubsidio, cargos, estadoscurso, estadosgrado, estadosgenerales, estratos, sisben, zonasresidencia, etnias, resguardos, discapacidades, capacidades, conflictos, fuentesrecursos, caracter, especialidades, metodosinstitucionales, escalanacional, escalacualitativa, empresas, icbf, departamentos, ciudades.
- **SAE:** institucion, sedes, anos, periodos, anolperi, escalas, sie, certificados, constancias, pazsalvo, firmas, cursos, areas, asignaturas, instarea, contenidos, asigcurscontprog, areaconf, docentes, contrataciones, asignaciones, estudiantes, matriculas, acudientes, otrosdatos, socioeconomicos, pagos, competencias, asigcurscomp, notas, definitivas, promediosdef, promediosasig, promedios, obsplan, obsresponsabilidades, obssubresponsabilidades, obsobservaciones, obsevaluaciones, usuarios, roles, menus, opciones, privilegiosrol, privilegiosusuario, uniones.
- **Preescolar:** ambitos, dimensiones, preasignaciones, prenotas, prenovedades (endpoints `/preescolar/*`).
- **Reportes/acciones (páginas dedicadas):** `pages/reportes/estadisticas.js` (estadísticas de matrícula) y `pages/reportes/promocion.js` (promoción masiva). Rutas `/estadisticassae` y `/promocion`.

## 7. Convenciones de encriptación de PK/FK (⭐ importante)

> Regla unificada entre API y frontend:

1. **PK (`idregistro`)**: la API lo devuelve ENCRIPTADO (doble base64). El frontend lo guarda en `tool.setRecord()` y lo reenvía tal cual en `actualizar`/`borrar`. La API lo `decriptar()`.
2. **FKs** (`idgrado`, `idcurso`, `cdepageogid`, ...): la API las devuelve **CRUDAS** en los listados. El frontend las **enmascara con `tool.encriptar(String(valor))`**:
   - En los `select`, el `value` de cada opción es el `idregistro` (ya encriptado) de la fuente.
   - Al editar, el valor crudo del registro se enmascara (`get` indica de qué clave leerlo).
   - La API las `decriptar()` en `registrar`/`actualizar` (los controladores SAE usan `parseInt(token.decriptar(...))`; el catálogo genérico decripta las columnas listadas en `config.fk`).

## 8. Convenciones de páginas

- Componente función con `export default`.
- Comprueba `tool.getUser().isLogged`; si no, `<Forbidden />`.
- `Waiting`/`setWaiting` desde `UserContext`.
- Tablas con `components/tables.js` (`<Listado props={{title, columns, data}} />`).
- Confirmaciones con `sweetalert2`.
- Layout: `components/head.js` + `components/foot.js` + plantilla `wrapper / main-panel / content / page-inner`.
- Textos bilingües en `main/constants.js` (`labels.*`).

### 8.1 Patrón de página (referencia: `pages/comunicados/`)

Los mejores ejemplos de referencia real de código están en `pages/comunicados/`:
- **Formulario de registro** → `comunicadosAdd.js`
- **Listado de datos** → `comunicadosList.js`
- **Detalle de un registro** → `comunicadosView.js`
- **Visualización pública sin login** → `comunicadosViewOpen.js`

Convenciones concretas a aplicar en TODA página nueva:

1. **Formularios** — usar `import { Controller, useForm } from 'react-hook-form'` (no manejar
   cada input con `useState` salvo excepciones). `Controller` para selects, DatePicker,
   Select multi y editores; `register` para inputs/textarea simples.
2. **Autor transparente** — el autor/emisor de un registro NO se pide en el formulario; se
   toma del objeto `miUsuario` (`tool.getUser()`), casi siempre `miUsuario.usuarioId`, y se
   inyecta en el `data` dentro de `onRegister` (ver `comunicadosAdd.js` líneas 202-208).
   Otros datos de contexto: `usuarioEmpresaId`, `usuarioAnoId`, `academicoId`, `usuarioRollId`.
3. **Textarea con HTML** — cuando un campo admite contenido enriquecido, usar **SunEditor**
   (wysiwyg) dentro de un `Controller`, con `setOptions` (buttonList, formats, font, plugins).
   En listados, mostrar el texto plano con `tool.removeTags(valor)`.
4. **Envío a la API** — `const onRegister = async (data) => { ... await messenger.poster({...}) }`,
   con `swal.fire` de confirmación y navegación `navegar(privateRoutes.X_LIST, { replace: true })`.
   Archivos/binarios → `messenger.posterFile` con `FormData`.
5. **Carga de imágenes/archivos desde el dispositivo** — input `type="file"` (con `accept`
   restringido), `handleUpload(e)` valida tamaño (p.ej. 3Mb) y genera `preview`
   (`URL.createObjectURL`), con tarjetas de preview para imágenes y PDF (ver
   `comunicadosAdd.js`). Envío con `FormData` + `messenger.posterFile`.
   **API**: la ruta usa un middleware multer que guarda en
   `api/public/archivos/<carpeta>/<idInstitucion>/` (la carpeta se nombra con el id de la
   institución, `token.decriptar(req.user.usuarioEmpresaId)`); el controlador devuelve la ruta
   `p/c/<idInstitucion>/<archivo>` (o la correspondiente) y `app.js` la sirve vía
   `express.static('/p/...')`. El frontend envía `id_institucion = miUsuario.usuarioEmpresaId`
   en el FormData.
6. **Listados** — `useReducer` con casos `list`/`delete`; `editElement` guarda con
   `tool.setRecord()` y navega a la ruta `_ADD` pasando `state:{ reference: idregistro }`;
   el listado envía el contexto del usuario (`id_usuario`, `ano_lectivo`, `id_institucion`, `rol`).
7. **Detalle** — `useParams().reference` + `tool.getRecord()`; render con
   `dangerouslySetInnerHTML` (sanitizando `iframe`→`embed` si aplica).
8. **Pública (ViewOpen)** — sin `isLogged`; usa `publicRoutes`.

> Al crear páginas nuevas para SAE, priorizar el patrón de `comunicados`/`menu` sobre el
> CRUD genérico (`gestion/`) cuando la vista requiera formularios ricos, editor, archivos,
> detalle o flujo público.

### 8.2 Catálogo de controles de formulario (react-hook-form)

Guía obligatoria para TODOS los formularios del front. Siempre usar `react-hook-form`
(`import { Controller, useForm } from 'react-hook-form'`). Extraer `const { control, register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues })`.

| Control | Cuándo usarlo | Ejemplo real |
|---|---|---|
| `input type="text"` | Texto normal | `comunicadosAdd.js`, `matriculasAdd.js`, `miPerfil.js` |
| `input type="number"` | Texto numérico (valores) | `matriculasAdd.js` (valorinscripcion, valorpension, descuento) |
| `input type="hidden"` | Dato que el usuario no debe ver (PK/FK en edición) | `comunicadosAdd.js:448`, `matriculasAdd.js:143`, `observacionesAdd.js:450` |
| `input type="password"` | Claves | `usuariosAdd.js` (clave/reclave), `passwordChange.js` |
| `input type="checkbox"` | Opción múltiple con respuesta múltiple | `usuariosAdd.js:345` (ver clave) |
| `input type="radio"` | Opción múltiple con respuesta única | `matriculasAdd.js:190-210` (nuevo/repitente), `observacionesAdd.js:527-531` |
| `input type="file"` | Subir imagen/archivo desde el dispositivo | `comunicadosAdd.js`, `observacionesAdd.js:544`, `miPerfil.js:727` |
| `input type="date"` / `DatePicker` | Fechas | `comunicadosAdd.js` (date_init/date_finish), `observacionesAdd.js:591` |
| `select` (con `Controller`) | Lista de opciones (catálogos/FK) | `matriculasAdd.js` (estudiante/curso/institución), `usuariosAdd.js` (departamento/municipio), `comunicadosAdd.js` (alcance) |
| `Select` multi (react-select) | Opciones múltiples con búsqueda | `comunicadosAdd.js` (group/student), `observacionesAdd.js:620` |
| `textarea` simple | Texto largo sin formato | (uso `SunEditor` para HTML; textarea simple si no hay formato) |
| `SunEditor` | Texto largo con formato HTML (wysiwyg) | `comunicadosAdd.js` (comunicate), `observacionesAdd.js:454`, `avisosAdd.js` (contenido) |
| `button type="submit"` | Enviar formulario | todos |

**Reglas de elección del control:**

1. **Texto normal** → `input type="text"`.
2. **Texto numérico** → `input type="number"`.
3. **Lista de opciones** → `select` (con `Controller` si tiene `defaultValue`/eventos).
4. **Opción múltiple con respuesta múltiple** → `input type="checkbox"`.
5. **Opción múltiple con respuesta única** → `input type="radio"`.
6. **Dato oculto (PK/FK, contexto)** → `input type="hidden"`.
7. **Subir imagen/archivo** → `input type="file"` (con `accept`, validación de tamaño y preview).
8. **Texto enriquecido** → `SunEditor` dentro de un `Controller`.
9. **Claves** → `input type="password"` (con opción "ver clave" vía checkbox).
10. **Fechas** → `DatePicker` (react-datepicker) dentro de `Controller`.

**Contexto del usuario en `onRegister`:** cuando se necesiten datos que identifican al
usuario en sesión, usar el objeto `miUsuario` (`tool.getUser()`) dentro de `onRegister`
(no en `defaultValues`): p.ej. `data.idautor = miUsuario.usuarioId`,
`data.id_institucion = miUsuario.usuarioEmpresaId`, `data.ano_lectivo = miUsuario.usuarioAnoId`.

**Envío:** `const onRegister = async (data) => {...}` con `messenger.poster` (JSON) o
`messenger.posterFile` (FormData para archivos). Confirmación con `swal.fire` y navegación
`navegar(privateRoutes.X_LIST, { replace: true })`.

## 9. Inventario de pantallas

### Implementadas
- Auth: `login`, `default`, `404`, `forbidden`, `notFound`, `resetpass`, `newaccount`.
- Dashboards: `dashboard`, `dashboardAdmon`, `dashboardTeacher`, `dashboardStudent`.
- Agenda (legado): `menu/*`, `tipodesempeno/*`, `asistencias/*`, `citaciones/*`, `comunicados/*`, `excusas/*`, `observaciones/*`, `campana/*`, `usuarios/*`.
- **SAE (nuevo, genérico):** `pages/gestion/*` para TODAS las entidades de `crudConfig.js` (incluye preescolar).
- **Reportes SAE:** `pages/reportes/estadisticas.js` (matrícula/sexo/etnia/grado) y `pages/reportes/promocion.js` (promoción masiva).

### Pendientes / placeholders
- Exámenes y tareas (agenda) y sus preguntas/opciones (apuntan a `pages/login`).
- Consulta al docente, configuraciones generales, Help.
- Boletines y certificados (PDF/export) — falta definir formato y endpoint de export en la API.
- Ayuda (videos tutoriales).

## 10. Checklist para agregar una entidad nueva

1. Crear el backend (`controllers/<modulo>/<modulo>.routes.js` + Controller + .sql.js) y registrarlo en `routes/index.js` (ver `api.md`).
2. Añadir la entrada en `src/main/crudConfig.js` con `columns` y `fields`.
3. Registrar menú/opción en `logic.tabmenu`/`logic.tabopcimenu` (+ `logic.tabrollopci`), con `copcimenuenla = gestion/<clave>` y `copcimenuicon = <clase Font Awesome>`. Usar `api/scripts/sync_logic_menu.js` (o editar `logic.tabopcimenu` directamente).
4. Listo: las páginas genéricas ya la renderizan (ruta `/gestion/<clave>`).

## 11. Notas / deuda técnica

- `services/navigator.js` está hardcodeado ("Hizrian"); **no usar de referencia** (el menú real es `head.js` + `tool.getNav`).
- `constants.js` conserva rutas del proyecto electoral anterior (`bochinche`, `votantes`, ...). No usar.
- Los placeholders `lazy(() => import("../../pages/login"))` siguen pendientes de sustituir por páginas reales (exámenes, tareas, etc.).
- El token JWT del backend expira en 2 minutos; conviene revisarlo al integrar el login definitivo.
- El login actual autentica contra **SAE** (`logic.tabusua` + `logic.tabroll` + `public.tabunio`); `usuarioEmpresaId` = `public.tabinst.cinstid` encriptado y `usuarioAnoId` = `public.tabanol.canolid` encriptado. El menú sale de `logic.tabmenu`/`tabopcimenu` + `logic.tabrollopci`/`tabusuaopci` (ver `api.md` §6.1). Los dashboards heredados (agenda `data.*`) pueden no tener datos para usuarios SAE.
- Claves de prueba (institución Patricio Symes / colpasy): institución `Institucion.2000`, secretarias/coordinadores/docentes `Docente.2000`, estudiantes/acudientes `Estudiante.2000` (almacenadas como base64 simple en `logic.tabusua.cusuallave`).
- **Pantalla en blanco del estudiante (corregido, rama `dashstudent`)**: los endpoints
  `/totals/statsinitial/*` responden `{status:'error', statusCode:400, message:'0 Resultados encontrados', rows:{}}`
  cuando no hay datos. `dashboardStudent.js` comparaba `elMensaje.rows !== "{}"` (objeto vs string,
  siempre `true`), guardaba estados con `title`/`data` `undefined` y `Listado`
  (`pages/components/tables.js`) hacía `props.data.length` → `TypeError` sin error boundary → árbol
  React desmontado → blanco. Regla: validar `statusCode === 200 && rows` con contenido real; `Listado`
  ahora normaliza `data`/`columns` con `Array.isArray`. El tablero del estudiante no debe invocar
  endpoints con guarda `isDirector_and_tecaher` (`attendancesteacher`, `attendancesteacherbyday`,
  `listUnnattendance`, `listUnnattendanceGroup`).
