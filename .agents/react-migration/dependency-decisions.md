# Decisiones de Dependencias

Registro de decisiones sobre dependencias (frontend/API) durante la migración.

| Fecha | Módulo | Dependencia | Decisión |
|---|---|---|---|
| — | global | `react-hook-form` (7.40) | Ya existente. Formularios obligatorios con `useForm`/`Controller`/`register`. |
| — | global | `react-data-table-component` (7.5) | Ya existente. Tablas/listados (`components/tables.js`). |
| — | global | `bootstrap` 4.6 + `react-bootstrap` 2.7 | Ya existente. Clases Atlantis reutilizadas (`.card`, `.form-group`, `.btn-round`). |
| — | global | `sweetalert2` | Ya existente. Confirmaciones y feedback. |
| — | global | `echarts-for-react` | Ya existente. Gráficos de reportes. |
| — | global | `react-router-dom` 6.4 | Ya existente. Ruteo (`services/routes.js`). |

## Regla
No instalar dependencias nuevas salvo necesidad real; primero revisar `package.json` de
frontend y API. Si se requiere una nueva, debe estar mantenida, usada ampliamente y, cuando
exista métrica comunitaria comparable, con calificación > 4/5 (documentar la evidencia).
