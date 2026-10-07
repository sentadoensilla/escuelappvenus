# MISIÓN: MIGRAR VISTAS Y FORMULARIOS SAE DE PHP A REACTJS

El sistema SAE original fue desarrollado en PHP bajo arquitectura MVC.

Las vistas originales se encuentran dentro de:

./look

Estas vistas contienen una combinación de:

- PHP;
- HTML;
- jQuery;
- JavaScript vanilla;
- CSS;
- formularios;
- tablas;
- validaciones;
- llamadas AJAX;
- generación de reportes.

El objetivo es migrar progresivamente estas interfaces a ReactJS.

NO realizar una conversión literal de PHP a JSX.

La migración debe producir código:

1. Legible.
2. Mantenible.
3. Modular.
4. Reutilizable.
5. Coherente con Venus.
6. Responsive.
7. Funcional en PC y móviles.

La prioridad es:

1. Legibilidad y mantenibilidad.
2. Correctitud funcional.
3. Coherencia con la arquitectura existente.
4. Usabilidad en PC.
5. Usabilidad en móviles.
6. Optimización posterior.

---

# PROYECTOS DE REFERENCIA

## Frontend React

Ruta:

/Users/sentadoensilla/side projects/Venus/venus

Usar como referencia principal:

/Users/sentadoensilla/side projects/Venus/venus/src/pages/menu

ANTES de crear código nuevo, analizar esta carpeta para comprender:

- estructura de páginas;
- estructura de componentes;
- rutas;
- manejo de estado;
- servicios HTTP;
- convenciones de nombres;
- hooks;
- tablas;
- formularios;
- modales;
- manejo de errores;
- loaders;
- permisos;
- estilo general.

El código nuevo debe seguir estas convenciones.

NO crear una arquitectura paralela innecesaria.

---

## Plantilla visual

Ruta:

/Users/sentadoensilla/side projects/Venus/atlantis

Usar Atlantis como referencia visual.

Analizar antes de implementar:

- layout;
- cards;
- formularios;
- inputs;
- selects;
- botones;
- tablas;
- badges;
- alertas;
- modales;
- tabs;
- breadcrumbs;
- paginación;
- responsive behavior;
- iconografía;
- estados vacíos;
- loaders.

NO copiar páginas completas de Atlantis indiscriminadamente.

Extraer y adaptar solamente los elementos necesarios.

No duplicar CSS existente si puede reutilizarse.

---

## Backend API

Ruta:

/Users/sentadoensilla/side projects/Venus/venus/api

Todas las operaciones de datos nuevas deben realizarse mediante la API NodeJS.

NO conectar React directamente a PostgreSQL.

La API es responsable de:

- consultas;
- inserciones;
- actualizaciones;
- eliminaciones;
- autorización;
- validación de negocio;
- generación de PDF;
- generación de Excel;
- acceso a PostgreSQL.

Antes de crear un endpoint nuevo:

1. Buscar si ya existe.
2. Revisar si existe una funcionalidad similar.
3. Reutilizar servicios.
4. Mantener las convenciones existentes.
5. Crear uno nuevo únicamente si es necesario.

---

# FUENTE FUNCIONAL ORIGINAL

Las vistas PHP originales son la referencia funcional.

Para cada vista encontrada en ./look:

1. Analizar el archivo completo.
2. Identificar su propósito.
3. Identificar variables PHP utilizadas.
4. Identificar formularios.
5. Identificar campos.
6. Identificar valores iniciales.
7. Identificar campos obligatorios.
8. Identificar validaciones.
9. Identificar JavaScript.
10. Identificar jQuery.
11. Identificar AJAX.
12. Identificar endpoints PHP.
13. Identificar consultas indirectas.
14. Identificar tablas mostradas.
15. Identificar filtros.
16. Identificar acciones.
17. Identificar modales.
18. Identificar permisos.
19. Identificar generación de reportes.
20. Identificar dependencias con otras vistas.

Crear primero una ficha funcional.

Ejemplo:

# FICHA DE MIGRACIÓN

Vista original:
./look/...

Propósito:
...

Usuarios:
...

Permisos:
...

Datos consultados:
...

Tablas bdsae2:
...

Acciones:
- listar
- crear
- editar
- eliminar
- consultar
- exportar

Campos:

| Campo | Tipo | Obligatorio | Origen | Validación |
|---|---|---|---|---|

Validaciones originales:
...

AJAX original:
...

Endpoints actuales:
...

API Venus equivalente:
...

Componentes React propuestos:
...

Riesgos:
...

NO comenzar la implementación hasta comprender la vista.

---

# ORDEN DE MIGRACIÓN

NO intentar migrar toda la carpeta ./look de una vez.

Primero generar un inventario.

Clasificar cada vista:

## PRIORIDAD 1

CRUD fundamentales:

- instituciones;
- estudiantes;
- docentes;
- acudientes;
- matrículas;
- usuarios;
- roles;
- permisos;
- cursos;
- asignaturas.

## PRIORIDAD 2

Procesos académicos:

- asistencia;
- notas;
- periodos;
- horarios;
- promoción;
- novedades.

## PRIORIDAD 3

Procesos especializados:

- preescolar;
- observador;
- disciplina;
- bitácoras.

## PRIORIDAD 4

Consultas y reportes.

La prioridad real debe validarse contra:

- uso actual;
- dependencias;
- frecuencia de uso;
- criticidad.

No asumir.

---

# ARQUITECTURA DE UNA PÁGINA REACT

Cada módulo debe mantener responsabilidades claras.

Ejemplo:

src/pages/estudiantes/
├── index.jsx
├── EstudiantesPage.jsx
├── components/
│   ├── EstudianteForm.jsx
│   ├── EstudiantesTable.jsx
│   ├── EstudianteFilters.jsx
│   └── EstudianteModal.jsx
├── hooks/
│   └── useEstudiantes.js
├── services/
│   └── estudiantesService.js
└── validation/
    └── estudianteSchema.js

Esta estructura es una referencia.

ANTES de crear carpetas nuevas verificar la arquitectura existente en:

src/pages/menu

Seguir el patrón existente si es diferente.

NO fragmentar componentes pequeños sin beneficio.

NO crear archivos de una sola función trivial si reduce la legibilidad.

---

# FORMULARIOS

Todos los formularios nuevos o migrados deben utilizar:

react-hook-form

No manejar manualmente cada input mediante:

useState()

si react-hook-form resuelve el caso.

Patrón esperado:

- useForm;
- register;
- Controller cuando sea necesario;
- formState.errors;
- handleSubmit;
- reset;
- setValue cuando corresponda;
- useFieldArray para listas dinámicas.

Mantener validaciones declarativas y cercanas al formulario.

Ejemplo conceptual:

Campo:
- requerido;
- longitud mínima/máxima;
- patrón;
- validación personalizada;
- dependencia de otros campos.

No duplicar reglas complejas dentro del JSX.

Extraerlas cuando mejoren la legibilidad.

---

# VALIDACIÓN

Toda validación del frontend es para experiencia del usuario.

La API debe volver a validar las reglas críticas.

Flujo:

React
  │
  ├── validación react-hook-form
  │
  ▼
API NodeJS
  │
  ├── autorización
  ├── validación de negocio
  ├── integridad
  │
  ▼
PostgreSQL

Nunca confiar únicamente en la validación React.

Al migrar una validación existente de jQuery:

1. Identificar exactamente qué regla aplica.
2. Determinar si es:
   - formato;
   - obligatoriedad;
   - dependencia entre campos;
   - regla de negocio;
   - permiso.
3. Migrar formato y UX al frontend.
4. Migrar o confirmar la regla de negocio en API.

---

# JQUERY Y JAVASCRIPT LEGACY

No copiar código jQuery a React.

Ejemplos:

NO:

$(input).change(...)

NO:

document.getElementById(...)

NO:

$('.modal').show()

NO:

onclick="..."

Convertir cada comportamiento a:

- estado React;
- props;
- eventos React;
- hooks;
- componentes controlados o react-hook-form.

Cada bloque jQuery debe clasificarse como:

- interacción visual;
- validación;
- carga de datos;
- manipulación DOM;
- regla de negocio;
- plugin externo.

Luego reemplazarlo con una solución React apropiada.

---

# DATOS Y API

React debe comunicarse únicamente con Venus API.

Patrón:

React Page
    ↓
Service / Hook existente
    ↓
HTTP API
    ↓
Controller
    ↓
Service
    ↓
Repository / DB
    ↓
PostgreSQL

No colocar SQL en React.

No reconstruir consultas complejas de PostgreSQL en el frontend.

No replicar lógica de negocio innecesariamente.

---

# BASE DE DATOS

Usar como referencia:

.agents/database.md

Y cualquier documentación generada para el MER.

Antes de crear consultas o endpoints:

1. Identificar la entidad canónica.
2. Confirmar el schema.
3. Revisar relaciones.
4. Revisar constraints.
5. Revisar índices relevantes.
6. Identificar fuente de verdad.

Recordar:

SAE es la fuente principal de verdad para información institucional y académica.

Escuelapp administra principalmente:

- agenda;
- comunicación;
- WhatsApp;
- notificaciones;
- interacción digital.

No crear duplicados de entidades académicas sin justificación.

---

# UX DE FORMULARIOS

Prioridad:

1. Que el formulario sea fácil de entender.
2. Que los errores sean claros.
3. Que los datos existentes puedan editarse fácilmente.
4. Que funcione correctamente en PC.
5. Que funcione correctamente en móvil.

Cada formulario debe considerar:

- labels visibles;
- mensajes de error específicos;
- campos obligatorios identificables;
- loading al enviar;
- prevención de doble envío;
- feedback de éxito;
- feedback de error;
- cancelación;
- confirmación para acciones destructivas;
- conservación razonable del estado;
- navegación mediante teclado.

No abusar de modales.

Usar una página completa cuando:

- el formulario es largo;
- existen secciones;
- hay relaciones complejas;
- hay muchos campos.

Usar modal cuando:

- la acción es corta;
- el contexto es simple;
- no afecta gravemente la navegación.

---

# RESPONSIVE

No crear dos interfaces separadas.

Usar una interfaz responsive.

En escritorio:

- tablas completas cuando sea razonable;
- filtros visibles;
- acciones accesibles.

En móvil:

- evitar tablas imposibles de leer;
- usar scroll horizontal controlado;
- transformar acciones extensas en menús;
- mantener botones táctiles utilizables;
- reorganizar grids de formularios.

No sacrificar información para móvil.

Adaptar su presentación.

---

# TABLAS Y LISTADOS

Antes de implementar una tabla:

Identificar:

- columnas necesarias;
- ordenamiento;
- filtros;
- búsqueda;
- paginación;
- acciones;
- permisos;
- datos relacionados.

No cargar relaciones innecesarias.

Usar paginación desde API cuando el volumen de datos lo requiera.

No descargar miles de registros al navegador para filtrar localmente.

---

# REPORTES PDF Y EXCEL

React NO debe generar directamente los reportes institucionales.

Los reportes se generan en:

/Users/sentadoensilla/side projects/Venus/venus/api

Antes de instalar una librería:

1. Revisar package.json de API.
2. Identificar librerías existentes para:
   - PDF;
   - Excel;
   - generación de archivos;
   - streams.
3. Reutilizar la librería existente.

Solo instalar una nueva dependencia si:

- la funcionalidad no existe;
- la librería actual no puede resolver el problema razonablemente.

Para nuevas dependencias:

1. Investigar la librería.
2. Verificar mantenimiento.
3. Verificar licencia.
4. Verificar compatibilidad con NodeJS del proyecto.
5. Verificar adopción comunitaria.
6. Buscar evidencia de calificación superior a 4/5 cuando exista una fuente confiable de calificación.
7. Si la comunidad open source no proporciona una métrica comparable de "4/5", NO inventar una calificación.
8. Documentar la evidencia utilizada para aprobar la dependencia.
9. Evitar dependencias abandonadas.

Los reportes deben seguir el flujo:

React
   │ solicita
   ▼
API
   │
   ├── consulta datos
   ├── valida permisos
   ├── genera PDF/Excel
   │
   ▼
archivo / stream
   │
   ▼
React descarga o visualiza

---

# PROCESO POR CADA VISTA

## FASE 1 — ANALIZAR

Leer:

- vista PHP;
- JavaScript;
- jQuery;
- CSS relacionado;
- controlador;
- modelo;
- endpoints;
- documentación DB.

Crear ficha funcional.

NO programar todavía.

## FASE 2 — MAPEAR

Crear:

```text
PHP LEGACY
    ↓
React Page
    ↓
Componentes
    ↓
API endpoints
    ↓
Entidades PostgreSQL