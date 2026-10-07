SAE ORIGINAL
────────────────────────────────────

PHP MVC
   │
   ├── ./look
   │     ├── PHP
   │     ├── HTML
   │     ├── jQuery
   │     ├── JavaScript
   │     └── CSS
   │
   ▼
Controladores PHP
   │
   ▼
PostgreSQL


MIGRACIÓN
════════════════════════════════════


VENUS FRONTEND
/Users/sentadoensilla/side projects/Venus/venus
   │
   ├── ReactJS
   ├── src/pages/menu ← REFERENCIA PRINCIPAL
   ├── react-hook-form
   └── Atlantis UI
          │
          ▼
VENUS API
/Users/sentadoensilla/side projects/Venus/venus/api
   │
   ├── NodeJS
   ├── lógica de negocio
   ├── validación backend
   ├── PostgreSQL
   ├── PDF
   └── Excel

Principio principal

No migrar PHP línea por línea.

Cada vista debe analizarse y convertirse en una funcionalidad React con:

Vista PHP antigua
      ↓
Análisis funcional
      ↓
Identificar:
- datos
- reglas
- validaciones
- permisos
- acciones
- dependencias
      ↓
Diseño React
      ↓
API NodeJS
      ↓
Componentes reutilizables
      ↓
Formulario react-hook-form


DOCUMENTACIÓN DE MIGRACIÓN

Mantener:

.agents/react-migration/

con:

.agents/react-migration/
├── README.md
├── inventory.md
├── migration-status.md
├── pending.md
├── api-changes.md
├── dependency-decisions.md
└── modules/
    ├── estudiantes.md
    ├── docentes.md
    └── ...


Para cada módulo registrar:

archivo PHP original;
archivos relacionados;
página React;
componentes;
endpoint API;
tablas;
estado;
diferencias funcionales;
pendientes;
riesgos.

Estados permitidos:

NOT_ANALYZED
ANALYZED
API_PENDING
IN_PROGRESS
TESTING
MIGRATED
BLOCKED

PUNTO DE DETENCIÓN

Migrar solamente un módulo o conjunto pequeño y coherente por iteración.

Después de cada módulo entregar:

Vista original analizada.
Funciones identificadas.
Componentes creados.
Endpoints utilizados.
Endpoints creados.
Validaciones migradas.
Funciones pendientes.
Diferencias con PHP.
Archivos modificados.
Pruebas realizadas.
Riesgos.

No continuar automáticamente con el siguiente módulo sin aprobación cuando se esté realizando una migración inicial o se detecten diferencias funcionales críticas.


---

# Plan por fases que recomiendo seguir

## Fase 0 — Inventario

La IA primero debería recorrer `./look` y construir algo así:

```text
look/
├── estudiantes/
│   ├── listar.php
│   ├── formulario.php
│   └── ...
├── docentes/
├── matriculas/
├── notas/
└── ...

Resultado:

Módulo	Vista	Tipo	Prioridad	Complejidad	Dependencias
Estudiantes	Gestión	CRUD	Alta	Media	Matrícula
Docentes	Gestión	CRUD	Alta	Media	Usuarios
Notas	Académico	Proceso	Alta	Alta	...

No programaría nada antes de tener este inventario.

Fase 1 — Crear el patrón de migración

Elegiría un CRUD de complejidad media como módulo piloto.

No empezaría con:

notas;
matrícula compleja;
observador;
preescolar.

El primer módulo debe servir para establecer el patrón de:

Listado
    +
Filtros
    +
Formulario
    +
react-hook-form
    +
API
    +
Validaciones
    +
Permisos

Después de ese piloto se ajusta la arquitectura.

Fase 2 — CRUD maestros

Migrar entidades fundamentales reutilizando el patrón:

Instituciones
Docentes
Estudiantes
Acudientes
Cursos
Asignaturas

Aquí probablemente aparecerán componentes reutilizables.

Por ejemplo:

PageHeader
DataTable
FormActions
ConfirmDialog
SelectInstitucion
SelectAnoLectivo
ApiError
LoadingState
EmptyState

Pero no hay que crearlos antes de necesitarlos.

Fase 3 — Procesos académicos
Matrículas
Asistencia
Notas
Horarios
Promoción

Aquí la IA debe prestar más atención a que las reglas que estaban escondidas entre PHP y jQuery pasen correctamente a la API.

Fase 4 — Módulos especializados
Observador
Disciplina
Bitácoras
Preescolar

Estos probablemente requieren análisis individual porque, como mencionaste, preescolar tiene una dinámica diferente.

Fase 5 — Reportes

Cada reporte debe analizarse separando:

FILTROS REACT
      ↓
API
      ↓
CONSULTA
      ↓
GENERADOR PDF/EXCEL
      ↓
ARCHIVO

Esto evita tener lógica de generación duplicada en el frontend.

Un ajuste importante sobre la condición de “calificación superior a 4”

Le pediría al agente que no tome literalmente cualquier número que encuentre en internet. Muchas librerías open source no tienen una calificación de 1 a 5.

Por eso pondría esta regla:

Instalar primero una dependencia existente en el proyecto. Si se requiere una nueva, debe estar activamente mantenida, ser ampliamente utilizada y, cuando exista una plataforma con una calificación comunitaria comparable, tener más de 4/5. Si no existe esa métrica, documentar otras evidencias verificables de calidad en lugar de inventar una calificación.

Esto evita que la IA descarte librerías excelentes simplemente porque npm, por ejemplo, no funciona con un sistema universal de estrellas.

Mi recomendación final para Escuelapp/SAE

La arquitectura de migración debería quedar así:

                    SAE LEGACY
                 PHP MVC + ./look
                       │
                       │ referencia funcional
                       ▼
               ┌───────────────┐
               │   MIGRACIÓN   │
               │   POR MÓDULO  │
               └───────┬───────┘
                       │
          ┌────────────┴─────────────┐
          ▼                          ▼
   ReactJS Venus                 NodeJS API
          │                          │
 react-hook-form                reglas negocio
 Atlantis UI                    autorización
 responsive                    PostgreSQL
          │                          │
          └────────────┬─────────────┘
                       ▼
                    bdsae2
                       │
          SAE = datos académicos maestros
                       │
                       ▼
                Escuelapp/Venus
          comunicación y experiencia digital

La clave del plan es que la IA no “traduce vistas”; reconstruye cada módulo respetando su comportamiento. Primero entiende ./look, después busca cómo encaja en el patrón ya existente en src/pages/menu, reutiliza Atlantis visualmente, implementa formularios con react-hook-form y conecta exclusivamente con la API Node.js. Esto debería permitir migrar SAE de forma progresiva sin perder las reglas que hoy están dispersas entre PHP, jQuery y JavaScript.
