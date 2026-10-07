# Migración de Vistas SAE (PHP) → ReactJS — Escuelapp/Venus

Documentación de seguimiento de la migración progresiva de las vistas y formularios del
SAE (PHP MVC, carpeta `view/` del sistema fuente) hacia el frontend React de Venus.

Reglas maestras en `.agents/refactor_vistas.md` y
`.agents/refactor_vistas_objetivo_arquitectura.md`.

## Pila objetivo

```
SAE LEGACY (PHP MVC)
        │  referencia funcional
        ▼
MIGRACIÓN POR MÓDULO
        │
   ┌────┴────┐
   ▼         ▼
ReactJS   NodeJS API
(venus)   (venus/api)
```

- **Frontend**: `src/pages/<modulo>/<modulo>List.js` + `<modulo>Add.js`
- **Patrón de referencia (código)**: `src/pages/comunicados/` (formulario, listado, detalle,
  vista pública) y `src/pages/menu/` (CRUD simple).
- **Formularios**: `react-hook-form` (`import { Controller, useForm } from 'react-hook-form'`)
- **Editor enriquecido**: `SunEditor` (suneditor-react) para textareas con HTML; en listados
  mostrar texto plano con `tool.removeTags()`.
- **Autor transparente**: el emisor/autor se toma de `miUsuario` (`tool.getUser().usuarioId`)
  y se inyecta en `onRegister`; NO se pide en el formulario.
- **Carga de archivos**: input `type="file"` desde el dispositivo + `FormData` +
  `messenger.posterFile`; la API guarda en `api/public/archivos/<carpeta>/<idInstitucion>/`
  (carpeta por institución) y sirve la ruta `/p/...` (ver `comunicadosAdd.js` y
  `middlware/uploadImages.js`).
- **Visual**: Atlantis (reutilizar clases, no duplicar CSS)
- **Datos**: solo vía API Node (`messenger.poster` / `posterFile`), nunca SQL en React
- **Reportes PDF/Excel**: generados en la API, React solo solicita/descarga

## Contenido

| Archivo | Propósito |
|---|---|
| `inventory.md` | Inventario de las vistas PHP y su estado de migración |
| `migration-status.md` | Estado global por módulo |
| `pending.md` | Pendientes, deudas técnicas y riesgos |
| `api-changes.md` | Cambios/adiciones necesarias en la API |
| `dependency-decisions.md` | Decisiones de dependencias (librerías nuevas) |
| `modules/` | Ficha por módulo (análisis, componentes, endpoints, riesgos) |

## Guía de controles de formulario

Ver **`.agents/frontend.md` §8.2 — Catálogo de controles de formulario (react-hook-form)**:
guía obligatoria para elegir el control correcto (text, number, hidden, password, checkbox,
radio, file, select, Select multi, DatePicker, textarea, SunEditor) en todo el front.

## Control de calidad

El seguimiento de pruebas manuales de todas las pantallas está en:

```
venus/control_calidad_formularios.csv
```

(archivo separado por tabulados; cada fila = una pantalla; columnas: id, módulo, pantalla,
archivo, ruta, navegador, rol, controles, pruebas, fecha, probador, estado, observaciones).
Estados permitidos: `PENDIENTE`, `EN_PRUEBAS`, `APROBADO`, `CON_OBSERVACIONES`, `BLOQUEADO`.

## Estados de un módulo

`NOT_ANALYZED` → `ANALYZED` → `API_PENDING` → `IN_PROGRESS` → `TESTING` → `MIGRATED`
(si hay bloqueos: `BLOCKED`).

## Proceso por módulo

1. **Analizar** la vista PHP (`view/x.php` + `factory/control.x.php`) y crear ficha.
2. **Mapear** a React Page + componentes + endpoints API + tablas.
3. **Implementar** siguiendo el patrón de `src/pages/menu`.
4. **Registrar** rutas (`services/routes.js`, `main/routes/mainroutes.js`) y el **menú dinámico
   en BD** (`logic.tabmenu`/`logic.tabopcimenu` + `logic.tabrollopci` para cada rol que deba ver
   la opción, según la guarda de la API). **Obligatorio**: sin `tabopcimenu` + `tabrollopci` la
   opción no aparece en el menú del usuario al iniciar sesión. Usar `api/scripts/sync_logic_menu.js`.
5. **Verificar** (`@babel/parser`, navegador).
6. Registrar en `modules/<modulo>.md` y actualizar `inventory.md`/`migration-status.md`.

## Punto de detención

Se migra **un módulo (o conjunto pequeño coherente) por iteración**. Tras cada módulo se
entrega el resumen y se espera aprobación antes de continuar.

---

## Última sesión (2026-08-20) — punto de continuidad

### Hecho
1. **Fase 0** completada: scaffolding `.agents/react-migration/` (README, inventory,
   migration-status, pending, api-changes, dependency-decisions, modules/).
2. **Módulo piloto: Avisos institucionales SAE** — `MIGRATED`.
   - `src/pages/avisos/avisosList.js` + `avisosAdd.js` (patrón `pages/menu`, react-hook-form).
   - Rutas: `services/routes.js` (`/avisos`, `/avisosadd`), `main/routes/mainroutes.js`,
     `main/constants.js` (`roots.aviso*`, `labels.avisos*`).
   - **Menú dinámico en BD**: `logic.tabopcimenu` id **37** ("Avisos", enlace `avisos`,
     icono `fa fa-bullhorn`) registrado en `logic.tabmenu` + privilegios en `logic.tabrollopci`
     para los roles que permite la guarda de la API. Verificado en la consulta de login.
   - Script reutilizable **`api/scripts/sync_logic_menu.js`** (idempotente).
3. **Convención reforzada** en `AGENTS.md`, `.agents/frontend.md` §5.1 y README de migración:
   toda ruta nueva debe registrarse en `logic.tabmenu` + `logic.tabopcimenu` + `logic.tabrollopci`.

### Verificación
- 119 archivos de `src/` parsean con `@babel/parser` (0 fallos), imports resueltos.
- Menú `/avisos` confirmado en la consulta `privilegees` (esquema `logic`).

### Siguiente paso sugerido
Migrar **Novedades/Asistencias SAE** (`/sae/novedades/*`, API lista) siguiendo el mismo
patrón + registro de menú en BD. Ver `pending.md` → "Siguiente módulo recomendado".
