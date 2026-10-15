# ARQUITECTURA.md — `escuelappvenus` (Frontend React)

Guía de arquitectura del **frontend** de Escuelapp (`escuelappvenus`, paquete npm `venus`). Permite a
cualquier agente de programación comprender el código y continuar la codificación sin contexto previo.

**Última actualización:** _(fecha — actualizar tras cada cambio)_

---

## 0. Documentos relacionados

| Documento | Contenido |
|---|---|
| [`../escuelappapi/AGENTS.md`](../escuelappapi/AGENTS.md) | Guía maestra del proyecto (objetivos, roles, mapa, convenciones). |
| [`../escuelappapi/BASE_DATOS.md`](../escuelappapi/BASE_DATOS.md) | Modelo de `bdsae2`; los esquemas `logic`/`engine` alimentan el menú. |
| [`../escuelappapi/ARQUITECTURA.md`](../escuelappapi/ARQUITECTURA.md) | Backend que consume este frontend. |
| [`CATALOGO_CONTROLES.md`](CATALOGO_CONTROLES.md) | **Documento único de interfaz**: controles React+HTML (todos los tipos) + widgets Atlantis + mapeo de iconos (FontAwesome → Bootstrap Icons) + anexo `react-hook-form` (mobile-first). |

---

## 1. Descripción y stack

SPA en **Create React App** que consume la API de `escuelappapi`. En desarrollo se sirve en
`http://localhost:3000`. Carga la plantilla visual **Atlantis** sobre **Bootstrap 5.3** e iconos
**Bootstrap Icons** (ver §3 y [`CATALOGO_CONTROLES.md`](CATALOGO_CONTROLES.md)).

| Aspecto | Detalle |
|---|---|
| Framework | React 18.2 (CRA / `react-scripts`) |
| Ruteo | `react-router-dom` 6.4 (`BrowserRouter`, `Routes`, `Route`, `NavLink`) |
| Formularios | `react-hook-form` 7.40 (+ `react-select`, `react-datepicker`, `suneditor-react`, `react-dropzone`) |
| HTTP | `fetch` nativo en `src/services/messenger.js` (**no** usa axios) |
| Gráficas | `echarts-for-react` (+ `echarts/core`) |
| Tablas | `react-data-table-component` |
| Estilos / UI | **Bootstrap 5.3.3** + **Bootstrap Icons 1.11.3** + plantilla **Atlantis** (assets locales en `public/assets`) |
| Extras | `sweetalert2`, `socket.io-client`, `jwt-decode`, `crypto-js`, `jquery` |

---

## 2. Estructura de carpetas (`src/`)

```
src/
├── index.js                 # ReactDOM.createRoot + StrictMode
├── App.js                   # <UserProvider><MisRutas/></UserProvider> + Bootstrap global
├── main/
│   ├── constants.js         # roots (endpoints), essentials, labels, messages, colores
│   ├── crudConfig.js        # ⭐ configuración declarativa del CRUD genérico (84 entidades)
│   └── routes/mainroutes.js # ⭐ todas las rutas <Route> (≈105) con lazy()
├── services/
│   ├── tools.js             # helpers: sesión, encriptar/decriptar, fechas, estados
│   ├── messenger.js         # capa HTTP (poster, posterFile, getFile)
│   ├── routes.js            # constantes de rutas (publicRoutes/privateRoutes)
│   ├── navigator.js         # (muerto) generador de menú alterno
│   └── context/UserContext.js
└── pages/
    ├── gestion/             # ⭐ CRUD genérico (/gestion/:entidad)
    ├── componentes y módulos por entidad (docentes, estudiantes, cursos, …)
    ├── dashboard*.js        # dashboards por rol
    ├── componentes/         # head, foot, tablas, charts, initWP…
    ├── parts/               # chrome público/auth
    └── login/default/…      # páginas públicas
```

---

## 3. Bootstrap 5.3, iconos y Atlantis

- **`src/index.js`**: importa `index.css` y `App`; monta con `createRoot` dentro de `StrictMode`.
- **`src/App.js`**: envuelve todo en `<UserProvider>` → `<MisRutas/>`. **No** importa CSS/JS de Bootstrap
  (todo se carga desde `public/index.html` con **assets locales**).
- **`public/index.html`** carga en orden: `bootstrap.min.css` (BS **5.3.3**) → `bootstrap-icons.css`
  (Bootstrap Icons) → `atlantis.min.css` → `bs5-compat.css` → `demo.css`; y los JS `jquery` →
  `bootstrap.min.js` (bundle BS5 con Popper) → plugins de Atlantis → `atlantis.min.js`.
- **Compatibilidad BS4→BS5**: `public/assets/css/bs5-compat.css` reintroduce clases eliminadas
  (`form-group`, `input-group-prepend/append`, `text-left/right`, `float-left/right`, `ml-*/mr-*`, `sr-only`).
  El código de `src` ya fue migrado a las clases BS5.
- **Iconos**: el código usa **Bootstrap Icons** (`bi bi-*`). Los iconos dinámicos de la BD (menú/opciones,
  guardados históricamente como `fa fa-*`) se traducen al vuelo con `tool.icono(clase)`
  (`src/services/tools.js`). Mapa completo de equivalencias en [`CATALOGO_CONTROLES.md`](CATALOGO_CONTROLES.md) §2.2.
- **Assets** (en `public/assets/`): `css/bootstrap.min.css`, `css/bootstrap-icons.css`, `css/bs5-compat.css`,
  `js/core/bootstrap.min.js` (bundle BS5), `fonts/bootstrap-icons/`. Los antiguos BS4 quedaron respaldados
  fuera del repo (se eliminaron del árbol activo).

> Al agregar componentes nuevos, usar clases/atributos **Bootstrap 5.3** (`data-bs-*`, `ms-*`, `me-*`,
> `text-start`, `float-start`, `form-select`, `form-check`, `btn-check`) y **Bootstrap Icons**. Ver el
> catálogo de controles en [`CATALOGO_CONTROLES.md`](CATALOGO_CONTROLES.md).

---

## 4. `src/main/`

### `constants.js`
- **`roots`**: mapa de endpoints relativos; `roots.engine = process.env.REACT_APP_BACKEND_URL` es la base
  de toda llamada. Incluye bloques para login, WhatsApp, recuperación de clave, menús, alertas, citaciones,
  observaciones, excusas, asistencias, dashboards (`/totals/statsinitial/*`) y el bloque **SAE**
  (`/institucion/*`, `/catalogos/*`, `/sae/*`, `/preescolar/*`, `/avisos/*`).
- **`essentials`**: logos/rutas de assets + `name`/`slogan` (desde env).
- **`labels`**: textos bilingües `['es','en']`; **`messages`**, **`coloresArray`**,
  **`protocolMessages.status`** (HTTP → texto).

### `crudConfig.js` — CRUD genérico declarativo ⭐
Define ~84 entidades con tres factories:
- `cat(titulo, tabla, columns, fields)` → `/catalogos/<tabla>/{listar,registrar,actualizar,borrar}`.
- `sae(titulo, recurso, columns, fields)` → `/sae/<recurso>/...`.
- `pre(titulo, recurso, columns, fields)` → `/preescolar/<recurso>/...`.

Cada entidad tiene:
- **`columns[]`**: `{ header, key, width?, format?(valorCrudo, fila) }` (p. ej. `FECHA = tool.soloFecha`,
  `ESTADO = tool.estadoGeneral`).
- **`fields[]`**: `{ name, label, type, required?, source?, get?, boolean?, col? }`.
  - `type`: `text | number | date | textarea | select | boolean`.
  - `source` (select): `{ tipo:'catalogo'|'sae'|'pre'|'institucion'|'sedes', tabla?/recurso?, label }`
    (helpers `SRC_CAT/SRC_SAE/SRC_PRE/SRC_INST/SRC_SEDE`).
  - PK/FK: la PK llega como **`idregistro` ya encriptada**; las FK llegan **crudas** y se enmascaran con
    `tool.encriptar()` antes de enviar.

### `routes/mainroutes.js` — ruteo ⭐
- `MisRutas` monta `<BrowserRouter>` → `NotFound` (catch-all 404) → tabla de `≈105` `<Route>`.
- Páginas cargadas con `React.lazy()` bajo `<Suspense fallback={<Waiting/>}>`.
- El bloque genérico usa `GESTION_LIST` (`/gestion/:entidad`) y `GESTION_ADD` (`/gestion/:entidad/agregar`).
- Alias de ruta: `/anolec` → `Navigate` a `/gestion/anos` (comentado como copia de `logic.tabopcimenu`).
- Muchas rutas "placeholder" importan `../../pages/login` para módulos aún no construidos.

---

## 5. `src/services/`

### `tools.js` (helper central, `export default tool`)
- **Sesión**: `setUser/getUser/outUser`, `parseJwt`, `decodeJWT`, `verifyUser`. `isLogged` se deriva de
  la presencia de `usuarionick` en `localStorage`. También `setSocket/getSocket`.
- **Encriptación**: `encriptar(text)` (base64url) y `decriptar(text)` (tolera base64 legacy + texto plano).
- **Fechas**: `dateNow`, **`soloFecha(value)`** (normaliza a `aaaa-mm-dd` para `<input type="date">`),
  `fechaAhora`, `addDays`.
- **Estados**: `estadosGenerales` (`public.tabestagene`) y **`estadoGeneral(value)`** (8=Activo, 9=Inactivo).
- **Varios**: `validEmail`, `statsColor`, `removeTags`, `getBrowserName`, `deviceInfo`, `getNav`
  (decodifica el `nav` y devuelve los grupos de menú), `setRecord/getRecord` (paso de fila lista→formulario).

### `messenger.js` — capa HTTP
- `poster({url, method, datos})`: `fetch` con `Content-Type: application/json` y
  `Authorization: Bearer <token>`; devuelve `respuesta.json()`.
- `posterFile`: multipart/`FormData` (subidas).
- `getFile`: descarga de archivos (blob → anchor).

### `routes.js` — constantes de rutas
- `publicRoutes`: `INDEX '/', LOGIN '/ingreso', NOTFOUND '/404', CONTACT, ABOUT, AGREE, REGISTER '/newacount',
  RESET_PASSWORD '/resetpass', VISTA_ENLACE '/vista/:token'`, etc.
- `privateRoutes`: dashboards, menús, y el bloque SAE (`/instituciones`, `/docentes`, `/avisos`,
  `/estudiantes`, `/matriculas`, `/cursos`, `/areas`, `/asignaturas`, `/competencias`, `/notas`,
  **`GESTION_LIST '/gestion/:entidad'`**, **`GESTION_ADD '/gestion/:entidad/agregar'`**, …).

### `context/UserContext.js`
Contexto mínimo `{ waiting, elUsuario }`. La mayoría de páginas leen la sesión de `tool.getUser()`; el
contexto se usa sobre todo para el spinner global.

### `navigator.js`
Generador de menú alterno **muerto** (no se importa). El menú activo vive en `components/head.js`.

---

## 6. `src/pages/` — vistas

### CRUD genérico (`pages/gestion/`)
- **`gestionList.js`**: resuelve `entidad` por `useParams()`, toma `config = CRUD[entidad]`, arma las
  columnas con su `format`, agrega columna de acciones (editar/borrar), consulta
  `roots.engine + config.endpoints.listar`, borra por `{ idregistro }` y navega a la edición con `tool.setRecord(row)`.
- **`gestionAdd.js`**: formulario genérico. Carga combos según `field.source`, enmascara FK con
  `tool.encriptar` y normaliza fechas con `tool.soloFecha`. **Usa `useState`, no `react-hook-form`.**

### Módulos por entidad (patrón viejo, con `react-hook-form`)
`instituciones/`, `docentes/`, `avisos/`, `estudiantes/`, `matriculas/`, `cursos/`, `areas/`,
`asignaturas/` (incluye `asignaturasPrint.js`), `competencias/`, `notas/`. Cada uno con `*List.js` + `*Add.js`.

### Módulos legacy/otros
`observaciones/` (Add/List/View/Open — referencia de estilo), `citaciones/`, `comunicados/`, `excusas/`,
`tipodesempeno/`, `campana/`, `usuarios/`, `asistencias/` (5 archivos), `reportes/`
(`estadisticas.js`, `promocion.js`).

### Dashboards
`dashboard.js` (admin/director), `dashboardAdmon.js`, `dashboardTeacher.js`, `dashboardStudent.js`
(ver deuda: hay un intercambio de nombres de ruta en `mainroutes.js`).

### Públicas y de sistema
`default.js` (landing), `description.js`, `login.js`, `resetpass.js`, `newaccount.js`, `planes*.js`,
`about.js`/`contact.js` (stubs), `404.js` + `notFound.js`, `forbidden.js`, `agree*.js`.

### `components/` (21) y `parts/` (6)
- Layout: **`head.js`** (navbar autenticado + menú dinámico), `headOff.js`, `foot.js`, `userCard.js`,
  `initWP.js`/`initStatusWP.js` (QR WhatsApp + socket), **`tables.js`** (`Listado` sobre
  `react-data-table-component`).
- Charts ECharts: `chartBar`, `chartColumn`, `chartPie`, `charDrillDown`, `columnStats`, `lineStats`, etc.
- `parts/`: `ribbon`, `ribbonLight`, `headPublic`, `waiting` (spinner), `draganddrop`, `headAccess`.

---

## 7. Ruteo y menú dinámico (flujo completo)

1. `index.js` → `<App/>` → `<UserProvider>` → `<MisRutas/>`.
2. `MisRutas` monta `BrowserRouter` + `NotFound` (catch-all) + tabla de rutas.
3. Tras login, `login.js` llama `tool.setUser(data.rows[0].datos_usuario)`, que guarda el `nav` (payload de
   privilegios, un JWT).
4. `tool.getNav()` decodifica el `nav` y devuelve los grupos de menú.
5. **`components/head.js`** renderiza cada grupo (`aemenu_*`) y cada opción como
   `<NavLink to={opcion.enlace}>`. Por eso el `enlace` guardado en la BD **debe coincidir exactamente**
   con la ruta de `privateRoutes` (p. ej. `/gestion/anos`, `/areas`).

> No hay carpeta `logic/` en el repo: el "esquema logic" es la BD del backend; aquí solo llega el menú ya
> resuelto a través del `nav` del login.

---

## 8. Conexión a la API y variables de entorno

- Toda llamada: `myConst.roots.engine + <ruta>` con `Authorization: Bearer <token>`.
- `.env.example` (nombres): `NODE_ENV, REACT_APP_PORT, PUBLIC_URL, REACT_APP_BACKEND_URL, REACT_APP_BASE_URL,
  REACT_APP_PUBLIC_FOLDER, REACT_APP_NAME, REACT_APP_TITLE, REACT_APP_LEMA, REACT_APP_JWT_PRIVATE_KEY,
  REACT_APP_TINYMCE`.
- `socket.io-client` conecta a `process.env.REACT_APP_BACKEND_URL`.

---

## 9. `config/` y build

- **`webpack.config.js`** existe pero **no se usa**: los scripts corren `react-scripts`. Igual sucede con
  `config/index.html` (duplicado no consumido).
- **`eslintrc.js`** sin punto inicial → ESLint no lo autocarga; el lint efectivo viene del `eslintConfig`
  de `package.json` (`react-app`).
- `public/`: `index.html` (con Atlantis/Bootstrap + estilos de impresión), `manifest.json`, `assets/`.

---

## 10. Convenciones de formularios

> **Obligatorio:** antes de construir o modificar cualquier vista/formulario/control, lee el
> [`CATALOGO_CONTROLES.md`](CATALOGO_CONTROLES.md) (documento único de interfaz: controles React+HTML,
> widgets de Atlantis, mapeo de iconos FontAwesome → Bootstrap Icons y anexo `react-hook-form`).

Resumen:
- `useForm` de `react-hook-form` v7; `register` para inputs nativos y `Controller` para selects/rich-text/fechas.
- Selects: `<select>` nativo dentro de `Controller` (nuevo) o `react-select` (legacy); el value de las
  opciones es `dato.idregistro` (encriptado).
- Fechas: `react-datepicker` (`dateFormat="yyyy-MM-dd"`, locale `es`) o `<input type="date">` con `tool.soloFecha`.
- Rich text: `suneditor-react` dentro de `Controller`.
- Archivos: `messenger.posterFile` con `FormData` (límite típico 3 MB).
- Feedback: `sweetalert2` + `navigate(listRoute,{replace:true})`.

---

## 11. Deuda técnica e inconsistencias

- **Boilerplate CRA** presente (`App.test.js` fallará, `logo.svg`, `App.css`, `index.css`, `README.md`).
- **Páginas huérfanas** (existen sin `<Route>`): `newaccount`, `resetpass`, `agree*`, `about`, `contact`,
  `planes*`, `campana/*`, `usuarios/*`. Enlaces a ellas caen al 404.
- **Constantes de ruta indefinidas** usadas en código: `privateRoutes.CAMPANA_ADD/LISTADO`, `USUARIO_ADD/LISTADO/PASSCHANGE/PROFILE`.
- **Placeholders**: gran bloque de `mainroutes.js` importa `../../pages/login` para módulos no construidos.
- **Intercambio de nombres** de ruta: `DASHBOARD_ADMON` (`/academic`) renderiza `Dashboard` y `DASHBOARD`
  (`/dashboardadmon`) renderiza `DashboardAdmon`.
- **Rutas duplicadas** para observador (se usa la primera coincidencia).
- **`navigator.js`** es código muerto; **`callUsers`** en `mainroutes.js` es siempre verdadero (cada página
  se autoprotege con `miUsuario.isLogged`).
- Dos estilos de CRUD coexistentes (`gestion/*` con `useState` vs módulos con `react-hook-form`) que pueden
  divergir. Dependencias sin usar: `react-bootstrap`, `react-helmet(-async)`, `draft-js`, `styled-components`.
- `src/campana/excampanaList.save` es un archivo suelto.

---

## 12. Cómo agregar una página/módulo

**Opción A — entidad CRUD genérica (rápida):**
1. Añadir la entidad en `src/main/crudConfig.js` con `cat(...)`/`sae(...)`/`pre(...)` (`columns` + `fields`).
2. Asegurar que el backend exponga `/catalogos/<tabla>` o `/sae/<recurso>/{listar,registrar,actualizar,borrar}`.
3. Registrar en BD una opción de menú cuyo `enlace` sea `gestion/<entidad>` (sin `/` inicial).
4. (Opcional) alias `Navigate` en `mainroutes.js` si se requiere URL corta.

**Opción B — módulo con páginas propias:**
1. Definir constantes en `services/routes.js` (`privateRoutes.X_LIST`, `X_ADD`).
2. Añadir endpoints en `main/constants.js` `roots` (si no reutiliza `config.endpoints`).
3. Crear `pages/<modulo>/<modulo>List.js` y `<modulo>Add.js` siguiendo `observaciones/` como referencia
   (`react-hook-form`, `Controller`, `sweetalert2`, `Listado`, guarda con `Forbidden`).
4. Registrar imports lazy + `<Route>` en `main/routes/mainroutes.js`.
5. Añadir labels bilingües en `constants.js` (opcional pero convencional).
6. Registrar la opción en la BD para que aparezca en el sidebar.

**Siempre:** proteger con `if(!miUsuario.isLogged) return <Forbidden/>`; usar `messenger.poster/posterFile`;
en edición enviar `idregistro` tal cual y enmascarar FK con `tool.encriptar()`; normalizar fechas con `tool.soloFecha()`.

---

## 13. Verificación rápida

```bash
# Parsear un archivo JSX
node -e "require('@babel/parser').parse(require('fs').readFileSync('src/pages/<modulo>/<Archivo>.js','utf8'),{sourceType:'module',plugins:['jsx']})"

npm start   # o npm run build para detectar errores de compilación
```

---

## ⚠️ NOTA NO NEGOCIABLE PARA EL AGENTE CODER

> **Es OBLIGATORIO actualizar este archivo `ARQUITECTURA.md` después de CADA cambio o modificación** en
> este repositorio (nuevas páginas/módulos, rutas, `crudConfig`, endpoints, dependencias, convenciones,
> variables de entorno, etc.).
> Un cambio **no se considera terminado** hasta que este documento refleje el estado real del código.
> Si tocas la interfaz/formularios/controles, actualiza también
> [`CATALOGO_CONTROLES.md`](CATALOGO_CONTROLES.md); si el cambio es global,
> [`../escuelappapi/AGENTS.md`](../escuelappapi/AGENTS.md). Antes de
> cerrar cualquier tarea: corrige lo desactualizado y actualiza la fecha en el encabezado.
