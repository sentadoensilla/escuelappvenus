# AGENTS.md — Escuelapp (Frontend React / Venus)

Guía maestra para agentes IA y desarrolladores **de este repositorio** (frontend React de Escuelapp).
El backend (Node/Express) y el modelo de datos viven en el repositorio **`escuelappapi`**
(carpeta `.agents/`: `api.md`, `database.md`, `sae-php.md`, `sae-refactor-mapa.md`).

## Contexto del proyecto

Integrar en una sola aplicación **NodeJS + ReactJS** (backend/frontend, web responsive, con notificaciones por WhatsApp):

| Sistema | Propósito | Base |
|---|---|---|
| **SAE** — Sistema de Administración Educativa (PHP) | Gestión escolar para docentes y secretarias (matrícula, notas, observador, promoción, nómina) | `public`, `logic`, `observador`, `preescolar`, `estadistica`, `integration`, `temporal`, `varios` |
| **Escuelapp** — Agenda Escolar Digital (Node/React) | Comunicación con padres/estudiantes vía WhatsApp (avisos, asistencias, tareas, evaluaciones, excusas, PQRS) | `data`, `engine`, `contact` |

La aplicación resultante se llama **Escuelapp**.

## Estructura del repositorio (frontend)

```
venus/                         # repo frontend (React)
├── AGENTS.md                  # este archivo
├── controls.md                # ⭐ catálogo de controles react-hook-form (mobile-first)
├── .agents/
│   ├── frontend.md            # guía del frontend (React)
│   ├── react-migration/       # seguimiento migración vistas SAE (PHP) → React
│   ├── refactor_vistas.md     # misión de migración
│   ├── refactor_vistas_objetivo_arquitectura.md
│   ├── description.md         # bitácora de instrucciones
│   └── propms.md              # bitácora de órdenes/contexto
├── public/                    # assets (Atlantis, imágenes)
└── src/
    ├── main/                  # constants, crudConfig, routes
    ├── services/              # tools, messenger, routes, context
    └── pages/                 # páginas (formularios, listados, dashboards)
```

> El backend y la BD **no** están en este repo: ver `escuelappapi` (`.agents/api.md`,
> `.agents/database.md`, `.agents/sae-php.md`, `.agents/sae-refactor-mapa.md`).

## Documentación de referencia (leer en este orden)

1. **`.agents/frontend.md`** — framework CRUD genérico, ruteo, menú dinámico y convenciones de páginas.
2. **`controls.md`** — catálogo por situación de controles `react-hook-form` (text, textarea, file, select, fecha, etc.) con notas de compatibilidad con **smartphone**. Usarlo al revisar o cambiar controles de formularios.
3. **`.agents/react-migration/`** — inventario, estado y pendientes de la migración de vistas SAE (PHP) → React.
4. **`.agents/refactor_vistas.md`** y **`.agents/refactor_vistas_objetivo_arquitectura.md`** — misión y arquitectura objetivo de la migración.
5. **`escuelappapi/.agents/`** (otro repo) — `api.md`, `database.md`, `sae-php.md`, `sae-refactor-mapa.md`.

## Convenciones clave (resumen)

- **Backend** (repo `escuelappapi`) — cada módulo es una carpeta `controllers/<modulo>/` con `<modulo>.routes.js` + `<modulo>Controller.js` + `<modulo>.sql.js`; se monta en `routes/index.js`. Respuesta `{status, statusCode, message, rows}`.
- **Borrado lógico** — `UPDATE ... SET <estado> = 9/0` (no `DELETE`).
- **Claves primarias** — patrón `COALESCE(MAX(id)+1, 1)` (conserva históricos; nunca reutilizar IDs).
- **Encriptación PK/FK** — la PK (`idregistro`) se devuelve ENCRIPTADA (doble base64) y se reenvía tal cual; las FKs se devuelven CRUDAS y el frontend las enmascara con `tool.encriptar()`. Backend usa `token.encriptar`/`decriptar`.
- **Frontend** — CRUD genérico por configuración en `src/main/crudConfig.js` + `src/pages/gestion/*`; rutas `/gestion/:entidad` y `/gestion/:entidad/agregar`.
- **Formularios** — siempre `react-hook-form` (`register` / `Controller`). Catálogo y reglas móviles en **`controls.md`**.
- **Menú dinámico** — se registra en BD **esquema `logic`** (`logic.tabmenu` + `logic.tabopcimenu` + `logic.tabrollopci` + `logic.tabusuaopci`); el enlace de cada opción (`copcimenuenla`) es la ruta React SIN `/` inicial (ej. `areas`, `anolec`, `gestion/cursos`). El login (`privilegees`) lo expone como `'/' || copcimenuenla`.
- **Conexión a BD** — en `escuelappapi/database/conex.js`: bloque comentado de producción (SSL) y bloque activo de desarrollo local (`ssl: false`).

## Credenciales (ver `escuelappapi/.agents/database.md` §1)

```
PG_HOST=localhost  PG_PORT=5432  PG_DB_NAME=bdsae2
PG_USER=adminit4_saeroot  PG_PASSWORD=*HelpDesk/F1*
```

## Cómo agregar un módulo CRUD nuevo

1. **Backend** (repo `escuelappapi`): crear `controllers/<modulo>/` (routes + Controller + sql) y registrarlo en `routes/index.js`.
2. **Frontend** (este repo): añadir la entrada en `src/main/crudConfig.js` (columns + fields + endpoints) o crear las páginas dedicadas (`src/pages/<modulo>/`) siguiendo el patrón de `src/pages/menu`.
3. Registrar la ruta del navegador en `logic.tabmenu`/`logic.tabopcimenu` + `logic.tabrollopci` con el enlace SIN `/` inicial (ej. `areas`, `anolec`, `gestion/<clave>`). **Obligatorio**: sin `tabopcimenu` + `tabrollopci` la opción no aparece en el menú del usuario. `copcimenuicon` = clase Font Awesome/Bootstrap. Ver `escuelappapi/scripts/sync_logic_menu.js`.
4. Verificar: `@babel/parser` en el frontend y `node --check` en el backend.

## Menú dinámico (roles de `logic.tabroll` — SAE)

`0` Administrador · `1` Estudiante · `2` Docente · `3` Institución · `4` Acudiente · `6` Coordinador · `7` Secretaria (el `5` es Demo). Son los roles de `logic.tabroll.crollid`. Elegir en `logic.tabrollopci` los roles que la guarda de la API permita (ver `escuelappapi/.agents/api.md` §6.2). El login SAE usa estos roles; los roles de Escuelapp (`engine.aeroll` 201–208) quedan como equivalencia (201≈3/institución, 202≈2/docente, 203≈1/estudiante, 204≈0/admin, 206≈4/acudiente, 207≈6/coordinador, 208≈7/secretaria).

## Verificación rápida

```bash
# Frontend (este repo)
node -e "require('@babel/parser').parse(require('fs').readFileSync('src/...','utf8'),{sourceType:'module',plugins:['jsx']})"

# Backend (repo escuelappapi)
cd api && node --check controllers/<modulo>/*.js
```
