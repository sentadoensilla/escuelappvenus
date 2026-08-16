// PATH ROUTES SPLIT FOR AUTH AND VISITORS
export const publicRoutes = {
    INDEX:'/',
    LOGIN:'/ingreso',
    NOTFOUND:'/404',
    CONTACT:'/contact',
    ABOUT:'/about',
    AGREE:'/acuerdoypolitica',
    AGREECAMPANA:'/contratoypolitica',
    REGISTER:'/newacount',
    RESET_PASSWORD:'/resetpass',
    RESET_PASSWORDLINK:'/changepass',// CAMBIAR LA CLAVE DE UN USUARIO DESDE UN LINK ENVIADO AL CORREO DEL DESPISTADO ESE
    COMUNICACION_OPEN:'/alertsview',
    COMUNICACION_VIEW:'/alertsview',
    OBSERVADOR_OPEN:'/observadorshowopen',
    CITACION_OPEN:'/citacionesdetailopen',
    HORARIO_VIEWOPEN:'/horario_salon',
    VISTA_ENLACE:'/vista/:token', // página pública para abrir un enlace seguro (SAE → Escuelapp → Padre)
}

// ROUTES FOR AUTH USERS 
export const privateRoutes = {
    CONF: '/confcampana', // ESTABLECER LA CONFIGURACION DE MI CAMPANA: CUANDO GENERAR LOS REPORTES Y ENVIARLOS AL CORREO
    NOTFOUND:'/404',
    DASHBOARD:'/dashboardadmon',
    DASHBOARD_DOCENTE:'/dashteacher',
    DASHBOARD_ADMON:'/academic',
    DASHBOARD_ESTUDIANTE:'/dashstudent',
    EMISORES:'/emisores', // LISTADO DE NUMEROS DE WHATSAPP
    
    MENU_LIST:'/menu',
    MENU_ADD:'/menuadd',

    CONFIG_WP:'/configwp',
    CONFIG_GENERAL:'/general.conf',
    HELP_GENERAL:'/heLp',

    TIPODESEMPENO_NEW:'/tipodesempenoadd',
    TIPODESEMPENO_LIST:'/desempenos',
    TIPODESEMPENO_VIEW:'/tipodesempenodetail',    


    ASIGNACIONES_LIST:'/asignments',
    ASIGNACIONES_NEW:'/asignmentsadd',
    HORARIO_VIEW:'/horario_acudiente',

    ASISTENCIA_TEACHER:'/asistencias',
    ASISTENCIA_TEACHERREPORTE:'/asistenciasreportedocente',
    ASISTENCIA_REPORTER:'/asistenciasreporte',
    ASISTENCIA_SEGUIMIENTO:'/asistenciasbitacora',

    AUSENTISMO_INSTITUCION:'/ausentismo',
    AUSENTISMO_GLOBAL:'/ausentismoglobal',

    
    CITACION_NEW:'/citacionesadd',
    CITACION_LIST:'/citaciones',
    CITACION_VIEW:'/citacionesdetail',
    
    
    CALENDAR_ADD:'/calendar',
    CALENDAR_VIEW:'/calendarshow',
    CALENDAR_OPEN:'/mycalendar',
    
    STUDENTS_VIEW:'/studentsdetail',
    STUDENTS_ADD:'/studentsadd',
    STUDENTS_LIST:'/students',

    TEACHER_VIEW:'/teachersdetail',
    TEACHER_ADD:'/teachersadd',
    TEACHER_LIST:'/teachers',    

    EXCUSAS_TEACHER:'/excusasdocente',
    EXCUSAS_VIEW:'/excusasshow',
    EXCUSAS_VIEWOPEN:'/excusasopen',
    EXCUSAS_ADD:'/excusassend',
    EXCUSAS_LIST:'/excusas',
    EXCUSAS_LISTSEDE:'/excusassede',
    
    OBSERVADOR_TEACHER:'/observadormaestrolist',
    OBSERVADOR_VIEW:'/observadorshow',
    OBSERVADOR_ADD:'/observadormaestro',
    OBSERVADOR_LIST:'/observador',
    
    COMUNICACION_VIEW:'/alertshow',
    COMUNICACION_ADD:'/alerts',
    COMUNICACION_LIST:'/alertslist',
    
    EXAMEN_VIEWSEDE:'/evaluacionschool',
    EXAMEN_VIEW:'/evaluaciondetail',
    EXAMEN_VIEWRESOLVER:'/evaluacionperform',
    EXAMEN_RATE:'/evaluacionrate',
    EXAMEN_ADD:'/evaluacion',
    EXAMEN_LIST:'/evaluacionlist',
    
    TAREA_VIEWSEDE:'/tareassede',
    TAREA_VIEW:'/homework', // /:token'
    TAREA_VIEWRESOLVER:'/perform_homework', // /:id_cuestionario/:id_programacion/:idestudiante
    TAREA_RATE:'/rate_homework', // /:id_cuestionario/:id_programacion/:grupo
    TAREA_ADD:'/tarea',
    TAREA_LIST:'/tareaslist',
    
    CONSULTA_DOCENTEADD:'/consultar_docente',
    CONSULTA_DOCENTESEDE:'/consultar_docentelistsede',
    CONSULTA_DOCENTELIST:'/consultar_docentelist',
    CONSULTA_DOCENTEVIEW:'/consultar_docenteshow',

    // ===== Gestión de instituciones (SAE) =====
    INSTITUCIONES_LIST: '/instituciones',        // listado de instituciones
    INSTITUCIONES_ADD: '/institucionesadd',      // alta/edición de institución

    // ===== Gestión de docentes (SAE) =====
    DOCENTES_LIST: '/docentes',                  // listado de docentes
    DOCENTES_ADD: '/docentesadd',                // alta/edición de docente

    // ===== Gestión de estudiantes (SAE) =====
    ESTUDIANTES_SAE_LIST: '/estudiantes',        // listado de estudiantes
    ESTUDIANTES_SAE_ADD: '/estudiantesadd',      // alta/edición de estudiante

    // ===== Gestión de matrículas (SAE) =====
    MATRICULAS_LIST: '/matriculas',              // listado de matrículas
    MATRICULAS_ADD: '/matriculasadd',            // alta/edición de matrícula

    // ===== Gestión de cursos (SAE) =====
    CURSOS_LIST: '/cursos',                      // listado de cursos
    CURSOS_ADD: '/cursosadd',                    // alta/edición de curso

    // ===== Pensum: áreas y asignaturas (SAE) =====
    AREAS_LIST: '/areas',                        // listado de áreas del saber
    AREAS_ADD: '/areasadd',                      // alta/edición de área
    ASIGNATURAS_LIST: '/asignaturas',            // listado de asignaturas
    ASIGNATURAS_ADD: '/asignaturasadd',          // alta/edición de asignatura

    // ===== Indicadores de desempeño (SAE) =====
    COMPETENCIAS_LIST: '/competencias',          // listado de competencias
    COMPETENCIAS_ADD: '/competenciasadd',        // alta/edición de competencia

    // ===== Calificaciones (SAE) =====
    NOTAS_LIST: '/notas',                        // listado de notas
    NOTAS_ADD: '/notasadd',                      // alta/edición de nota

    // ===== Módulos SAE (gestión genérica de CRUD) =====
    GESTION_LIST: '/gestion/:entidad',           // listado genérico de una entidad SAE/catálogo
    GESTION_ADD: '/gestion/:entidad/agregar',    // formulario genérico alta/edición

    // ===== Reportes / acciones SAE =====
    ESTADISTICAS_SAE: '/estadisticassae',        // estadísticas de matrícula
    PROMOCION: '/promocion',                     // promoción masiva de estudiantes



}