# FICHA DE MIGRACIÓN — Avisos institucionales SAE (MÓDULO PILOTO)

## Vista original

`/Users/sentadoensilla/side projects/sae/view/avisos.php`
`/Users/sentadoensilla/side projects/sae/factory/control.avisos.php`

## Propósito

Gestionar los avisos institucionales del SAE: publicación de comunicados dirigidos a
**roles** (`public.tabavisroll`), a **usuarios específicos** (`public.tabavisusua`) y los
**destinos por rol** (`public.avisrolldest`).

## Usuarios / Permisos

- Director institucional, docente, secretaría, admin académico.
- Guarda API: `isDirector_and_tecaher_and_admin`.

## Datos consultados

| Tabla bdsae2 | Uso |
|---|---|
| `public.tabavisroll` | Avisos por rol (autor, título, contenido, imagen, fecharegistro, estado) |
| `public.tabavisusua` | Avisos por usuario (autor, destino, fechas inicio/fin) |
| `public.avisrolldest` | Destinos de un aviso (rol + usuario destino + fechas) |
| `logic.tabusua` | Autores/destinos (nombre) |
| `logic.tabroll` | Roles destino |

## Acciones

- listar / crear / editar / eliminar (lógico)

## Campos — `tabavisroll` (principal)

| Campo | Tipo | Obligatorio | Origen |
|---|---|---|---|
| idregistro | hidden (encriptado) | sí (edición) | `cavisrollid` |
| idautor | select | no | `cavisorollusua` → `logic.tabusua` |
| titulo | text | sí | `cavisrolltitu` |
| contenido | textarea | sí | `cavisrollcont` |
| imagen | text | no | `cavisrollimag` |
| idestado | select | no | `cavisrollesta` (8/9) |

## API Venus equivalente

`/avisos/avisosrol/{listar|registrar|actualizar|borrar}` (y variantes `avisosusua`,
`avisodest`). Módulo `api/controllers/avisos/`.

## Componentes React

- `pages/avisos/avisosList.js` — listado de avisos por rol (patrón `menuList`/`comunicadosList`).
  Envía `idautor = miUsuario.usuarioId` para filtrar; muestra `contenido` con `tool.removeTags`.
- `pages/avisos/avisosAdd.js` — formulario alta/edición (patrón `comunicadosAdd`):
  - `react-hook-form` (`Controller`, `useForm`).
  - `contenido` con **SunEditor** (wysiwyg).
  - **Autor transparente**: `data.idautor = miUsuario.usuarioId` (no se pide al usuario).
  - **Carga de imagen/archivo desde el dispositivo** con `posterFile`/`FormData` y preview;
    se envía `id_institucion = miUsuario.usuarioEmpresaId`.

## API — soporte de upload (imagen/archivo)

- Rutas `avisosrol/registrar|actualizar` usan `uploadAlert.any()` (`middlware/uploadImages.js`),
  que guarda en `api/public/archivos/avisos/<idInstitucion>/` (carpeta por institución,
  `token.decriptar(req.user.usuarioEmpresaId)`).
- El controlador (`avisosController.js`) construye `imagen = 'p/c/<idInstitucion>/<archivo>'`
  a partir de `req.files[0].filename` + `id_institucion` del body (encriptado).
- `app.js` sirve `/p/c/` → `public/archivos/avisos/` (express.static).

## Registro de rutas

- `services/routes.js`: `AVISOS_LIST: '/avisos'`, `AVISOS_ADD: '/avisosadd'`.
- `main/routes/mainroutes.js`: lazy imports + `<Route>` para ambas rutas.
- `main/constants.js`: `roots.aviso{List,New,Update,Delete}` y `labels.avisos{List,Add}`.

## Menú dinámico en BD (logic.*)

Registrado con `api/scripts/sync_logic_menu.js`:

- `logic.tabopcimenu` id **37** — "Avisos", `copcimenuenla='avisos'`, `copcimenuicon='fa fa-bullhorn'`,
  asociado a su menú en `logic.tabmenu`, estado activo.
- `logic.tabrollopci` — privilegio por rol (`logic.tabroll`) según lo que permita la guarda
  `isDirector_and_tecaher_and_admin`; también puede usarse `logic.tabusuaopci` por usuario.

La consulta de login (`sql/authsql.js` `privilegees`) ya lo expone como `/avisos` en el menú
de esos roles.

## Riesgos

- Encriptación PK/FK: `idregistro` viene encriptado y se reenvía tal cual; FKs crudas se
  enmascaran con `tool.encriptar()`.
- Borrado lógico (`cavisrollesta = 9`).
- Los destinos por rol (`avisrolldest`) se gestionan en pantalla aparte (puede extenderse).

## Estado

`MIGRATED` — módulo piloto que fijó el patrón de migración (listado + formulario
react-hook-form + API + encriptación + rutas).
