# escuelappvenus

Frontend de **Escuelapp** (paquete npm `venus`): SPA en **React 18** (Create React App) con
`react-router-dom` 6, `react-hook-form` 7 y la plantilla visual **Atlantis** sobre **Bootstrap 5.3**
(iconos **Bootstrap Icons**). Consume la API de `escuelappapi`.

**Documentación completa: [`ARQUITECTURA.md`](ARQUITECTURA.md)** · documento único de interfaz
(controles React+HTML, widgets Atlantis, iconos y anexo `react-hook-form`):
[`CATALOGO_CONTROLES.md`](CATALOGO_CONTROLES.md).

## Instalación y ejecución

```bash
npm install
cp .env.example .env      # REACT_APP_BACKEND_URL apuntando al backend
npm start                 # http://localhost:3000
npm run build             # build de producción
```

## Estructura (resumen)

- `src/main/` — `constants.js` (endpoints), `crudConfig.js` (CRUD genérico), `routes/mainroutes.js` (rutas).
- `src/services/` — `tools.js`, `messenger.js`, `routes.js`, `context/UserContext.js`.
- `src/pages/` — `gestion/` (CRUD genérico `/gestion/:entidad`) + módulos por entidad + dashboards.

El menú de navegación es **dinámico**: se resuelve en la BD del backend (esquemas `logic`/`engine`) y llega
en el `nav` del login; cada `enlace` debe coincidir con una ruta React.

## Verificación

```bash
node -e "require('@babel/parser').parse(require('fs').readFileSync('src/App.js','utf8'),{sourceType:'module',plugins:['jsx']})"
npm start   # o npm run build
```

---

## ⚠️ NOTA NO NEGOCIABLE PARA EL AGENTE CODER

> **Es OBLIGATORIO actualizar [`ARQUITECTURA.md`](ARQUITECTURA.md) (y
> [`CATALOGO_CONTROLES.md`](CATALOGO_CONTROLES.md) si tocas la interfaz/formularios) después de CADA
> cambio o modificación** en este repositorio (páginas, rutas,
> `crudConfig`, endpoints, dependencias, convenciones, etc.).
> Un cambio **no se considera terminado** hasta que la documentación refleje el estado real del código.
> Antes de cerrar cualquier tarea: corrige lo desactualizado y actualiza la fecha en el encabezado.
