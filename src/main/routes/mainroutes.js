import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Navigate} from "react-router-dom";
import { publicRoutes,privateRoutes } from "../../services/routes";
import { NotFound } from "../../pages/404";
import { Forbidden } from "../../pages/forbidden";
import Waiting from "../../pages/parts/waiting";
// import { UserContext } from '../../services/context/UserContext'
// import { versions } from '../../main/constants';
import tool from '../../services/tools';

// ARCHIVOS PARA RUTAS DE ADMIN O DASHBOARDS
const Login = lazy(() => import(/* webpackChunkName: "login" */ "../../pages/login"));
const Index = lazy(() => import(/* webpackChunkName: "/" */ "../../pages/default"));
const VistaEnlace = lazy(() => import(/* webpackChunkName: "vista" */ "../../pages/vista/vistaEnlace"));
const Dashboard = lazy(() => import(/* webpackChunkName: "/dash" */ "../../pages/dashboard"));const DashboardTeacher = lazy(() => import(/* webpackChunkName: "/dash" */ "../../pages/dashboardTeacher"));
const DashboardStudent = lazy(() => import(/* webpackChunkName: "/dash" */ "../../pages/dashboardStudent"));
const DashboardAdmon = lazy(() => import(/* webpackChunkName: "/dash" */ "../../pages/dashboardAdmon"));
const MenuList = lazy(() => import(/* webpackChunkName: "/menu" */ "../../pages/menu/menuList"));
const MenuAdd = lazy(() => import(/* webpackChunkName: "/menu" */ "../../pages/menu/menuAdd"));
const TipoDesempeno = lazy(() => import(/* webpackChunkName: "/tipodesempeno" */ "../../pages/tipodesempeno/tipodesempenoAdd"));

// ARCHIVOS PARA RUTAS DE LA GESTIÓN SAE (CRUD genérico)
const GestionList = lazy(() => import(/* webpackChunkName: "gestion" */ "../../pages/gestion/gestionList"));
const GestionAdd = lazy(() => import(/* webpackChunkName: "gestion" */ "../../pages/gestion/gestionAdd"));

// ARCHIVOS PARA RUTAS DE LA GESTIÓN DE INSTITUCIONES
const InstitucionesList = lazy(() => import(/* webpackChunkName: "instituciones" */ "../../pages/instituciones/institucionesList"));
const InstitucionesAdd = lazy(() => import(/* webpackChunkName: "instituciones" */ "../../pages/instituciones/institucionesAdd"));

// ARCHIVOS PARA RUTAS DE LA GESTIÓN DE DOCENTES
const DocentesList = lazy(() => import(/* webpackChunkName: "docentes" */ "../../pages/docentes/docentesList"));
const DocentesAdd = lazy(() => import(/* webpackChunkName: "docentes" */ "../../pages/docentes/docentesAdd"));

// ARCHIVOS PARA RUTAS DE AVISOS INSTITUCIONALES
const AvisosList = lazy(() => import(/* webpackChunkName: "avisos" */ "../../pages/avisos/avisosList"));
const AvisosAdd = lazy(() => import(/* webpackChunkName: "avisos" */ "../../pages/avisos/avisosAdd"));

// ARCHIVOS PARA RUTAS DE LA GESTIÓN DE ESTUDIANTES Y MATRÍCULAS
const EstudiantesList = lazy(() => import(/* webpackChunkName: "estudiantes" */ "../../pages/estudiantes/estudiantesList"));
const EstudiantesAdd = lazy(() => import(/* webpackChunkName: "estudiantes" */ "../../pages/estudiantes/estudiantesAdd"));
const MatriculasList = lazy(() => import(/* webpackChunkName: "matriculas" */ "../../pages/matriculas/matriculasList"));
const MatriculasAdd = lazy(() => import(/* webpackChunkName: "matriculas" */ "../../pages/matriculas/matriculasAdd"));

// ARCHIVOS PARA RUTAS DE LA GESTIÓN DE CURSOS
const CursosList = lazy(() => import(/* webpackChunkName: "cursos" */ "../../pages/cursos/cursosList"));
const CursosAdd = lazy(() => import(/* webpackChunkName: "cursos" */ "../../pages/cursos/cursosAdd"));

// ARCHIVOS PARA RUTAS DEL PENSUM (áreas y asignaturas)
const AreasList = lazy(() => import(/* webpackChunkName: "areas" */ "../../pages/areas/areasList"));
const AreasAdd = lazy(() => import(/* webpackChunkName: "areas" */ "../../pages/areas/areasAdd"));
const AsignaturasList = lazy(() => import(/* webpackChunkName: "asignaturas" */ "../../pages/asignaturas/asignaturasList"));
const AsignaturasAdd = lazy(() => import(/* webpackChunkName: "asignaturas" */ "../../pages/asignaturas/asignaturasAdd"));

// ARCHIVOS PARA RUTAS DE INDICADORES DE DESEMPEÑO
const CompetenciasList = lazy(() => import(/* webpackChunkName: "competencias" */ "../../pages/competencias/competenciasList"));
const CompetenciasAdd = lazy(() => import(/* webpackChunkName: "competencias" */ "../../pages/competencias/competenciasAdd"));

// ARCHIVOS PARA RUTAS DE CALIFICACIONES
const NotasList = lazy(() => import(/* webpackChunkName: "notas" */ "../../pages/notas/notasList"));
const NotasAdd = lazy(() => import(/* webpackChunkName: "notas" */ "../../pages/notas/notasAdd"));

// ARCHIVOS PARA RUTAS DE REPORTES SAE
const EstadisticasSae = lazy(() => import(/* webpackChunkName: "reportes" */ "../../pages/reportes/estadisticas"));
const Promocion = lazy(() => import(/* webpackChunkName: "reportes" */ "../../pages/reportes/promocion"));


// ARCHIVOS PARA RUTAS DE DOCENTES
    const AsignacionesView = lazy(() => import(/* webpackChunkName: "asignaciones" */ "../../pages/login"));
    const AsignacionesCreate = lazy(() => import(/* webpackChunkName: "asignaciones" */ "../../pages/login"));
    const HorariodeClases = lazy(() => import(/* webpackChunkName: "asignaciones" */ "../../pages/login"));
    const HorariodeClasesOpen = lazy(() => import(/* webpackChunkName: "asignaciones" */ "../../pages/login"));

    const AsistenciaTeacher = lazy(() => import(/* webpackChunkName: "asistencia" */ "../../pages/asistencias/AsistenciasMarcar"));
    const AsistenciaTeacherListar = lazy(() => import(/* webpackChunkName: "asistencia" */ "../../pages/asistencias/AsistenciasListar"));
    const AsistenciaListar = lazy(() => import(/* webpackChunkName: "asistencia" */ "../../pages/asistencias/AsistenciasListarSchool"));
    const AsistenciaSeguimiento = lazy(() => import(/* webpackChunkName: "asistencia" */ "../../pages/asistencias/AsistenciasSeguimiento"));


    
    const AusentismoGeneral = lazy(() => import(/* webpackChunkName: "ausentismo" */ "../../pages/login"));
    
    const CitacionCreate = lazy(() => import(/* webpackChunkName: "citaciones" */ "../../pages/citaciones/citacionesAdd"));
    const CitacionList = lazy(() => import(/* webpackChunkName: "citaciones" */ "../../pages/citaciones/citacionesList"));
    const CitacionView = lazy(() => import(/* webpackChunkName: "citaciones" */ "../../pages/citaciones/citacionesView"));
    const CitacionViewOpen = lazy(() => import(/* webpackChunkName: "citaciones" */ "../../pages/citaciones/citacionesOpen"));
    
    const CalendarCreate = lazy(() => import(/* webpackChunkName: "calendar" */ "../../pages/login"));
    const CalendarView = lazy(() => import(/* webpackChunkName: "calendar" */ "../../pages/login"));
    const CalendarViewOpen = lazy(() => import(/* webpackChunkName: "calendar" */ "../../pages/login"));

    
    const StudentsView = lazy(() => import(/* webpackChunkName: "students" */ "../../pages/login"));
    const StudentsCreate = lazy(() => import(/* webpackChunkName: "students" */ "../../pages/login"));
    const StudentsList = lazy(() => import(/* webpackChunkName: "students" */ "../../pages/login"));

    const ExcusasView = lazy(() => import(/* webpackChunkName: "excusas" */ "../../pages/excusas/excusasView"));
    const ExcusasViewOpen = lazy(() => import(/* webpackChunkName: "excusas" */ "../../pages/excusas/excusasViewOpen"));
    const ExcusasCreate = lazy(() => import(/* webpackChunkName: "excusas" */ "../../pages/login"));
    const ExcusasList = lazy(() => import(/* webpackChunkName: "excusas" */ "../../pages/excusas/excusasList"));

    const ObservadorView = lazy(() => import(/* webpackChunkName: "observador" */ "../../pages/observaciones/observacionesView"));
    const ObservadorViewOpen = lazy(() => import(/* webpackChunkName: "observador" */ "../../pages/observaciones/observacionesOpen"));
    const ObservadorCreate = lazy(() => import(/* webpackChunkName: "observador" */ "../../pages/observaciones/observacionesAdd"));
    const ObservadorList = lazy(() => import(/* webpackChunkName: "observador" */ "../../pages/observaciones/observacionesList"));

    const ComunicacionView = lazy(() => import(/* webpackChunkName: "alerts" */ "../../pages/comunicados/comunicadosView"));
    const ComunicacionViewOpen = lazy(() => import(/* webpackChunkName: "alerts" */ "../../pages/comunicados/comunicadosViewOpen"));
    const ComunicacionCreate = lazy(() => import(/* webpackChunkName: "alerts" */ "../../pages/comunicados/comunicadosAdd"));
    const ComunicacionList = lazy(() => import(/* webpackChunkName: "alerts" */ "../../pages/comunicados/comunicadosList"));


    const ExamenViewResolver = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const ExamenViewCalificar = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const ExamenView = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const ExamenViewSede = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const ExamenCreate = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const ExamenList = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    //hacen falta las rutas para las preguntas y para las opciones de pregunta

    const TareaViewResolver = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const TareaViewCalificar = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const TareaView = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const TareaViewSede = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const TareaCreate = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const TareaList = lazy(() => import(/* webpackChunkName: "examen" */ "../../pages/login"));
    const ConsultarDocenteLista = lazy(() => import(/* webpackChunkName: "consultas" */ "../../pages/login"));
    const ConsultarDocenteView = lazy(() => import(/* webpackChunkName: "consultas" */ "../../pages/login"));
    const ConsultarDocenteSede = lazy(() => import(/* webpackChunkName: "consultas" */ "../../pages/login"));




// ARCHIVOS PARA RUTAS DE ACUDIENTES
const ConsultarDocente = lazy(() => import(/* webpackChunkName: "consultas" */ "../../pages/login"));



// ARCHIVOS PARA RUTAS DE INSTITUCIONES
const TeachersView = lazy(() => import(/* webpackChunkName: "teacehrs" */ "../../pages/login"));
const TeachersCreate = lazy(() => import(/* webpackChunkName: "teacehrs" */ "../../pages/login"));
const TeachersList = lazy(() => import(/* webpackChunkName: "teacehrs" */ "../../pages/login"));


// RUTAS PARA LOS ADMIN
const AusentismoGlobal = lazy(() => import(/* webpackChunkName: "ausentismo" */ "../../pages/login"));

const RegistrarWhatsapp = lazy(() => import(/* webpackChunkName: "config" */ "../../pages/campana/misWhatsapp"));
const ConfiguracionesGenerales = lazy(() => import(/* webpackChunkName: "config" */ "../../pages/login"));

const Help = lazy(() => import(/* webpackChunkName: "help" */ "../../pages/login"));




export const MisRutas = () => {
    const userNow = tool.getUser()

    const callUsers = (component) =>{       
        if(!userNow.isLogged){
            return <Forbidden />
        }
        return component
    };
    return (
        <Suspense fallback={<Waiting />}>            
            <BrowserRouter>
                <NotFound>
                    <Route exact path={publicRoutes.INDEX} element={<Index />} />
                    <Route path={publicRoutes.LOGIN} element={<Login />} />

                    {/* Enlace seguro público (SAE → Escuelapp → Padre) */}
                    <Route path={publicRoutes.VISTA_ENLACE} element={<VistaEnlace />} />

                    <Route path={privateRoutes.DASHBOARD_ADMON} element={(callUsers)? <Dashboard isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.DASHBOARD} element={(callUsers)? <DashboardAdmon isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.DASHBOARD_ESTUDIANTE} element={(callUsers)? <DashboardStudent isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.DASHBOARD_DOCENTE} element={(callUsers)? <DashboardTeacher  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.MENU_LIST} element={(callUsers)? <MenuList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.MENU_ADD} element={(callUsers)? <MenuAdd  isLogged={callUsers} /> : <Forbidden /> } />

                    <Route path={privateRoutes.TIPODESEMPENO_NEW} element={(callUsers)? <TipoDesempeno  isLogged={callUsers} /> : <Forbidden /> } />


                    <Route path={privateRoutes.ASIGNACIONES_LIST} element={(callUsers)? <AsignacionesView  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.ASIGNACIONES_NEW} element={(callUsers)? <AsignacionesCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.HORARIO_VIEW} element={(callUsers)? <HorariodeClases  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={publicRoutes.HORARIO_VIEWOPEN} element={(callUsers)? <HorariodeClasesOpen  isLogged={callUsers} /> : <Forbidden /> } />
                    
                    <Route path={privateRoutes.ASISTENCIA_TEACHER} element={(callUsers)? <AsistenciaTeacher  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.ASISTENCIA_TEACHERREPORTE} element={(callUsers)? <AsistenciaTeacherListar  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.ASISTENCIA_REPORTER} element={(callUsers)? <AsistenciaListar  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.ASISTENCIA_SEGUIMIENTO} element={(callUsers)? <AsistenciaSeguimiento  isLogged={callUsers} /> : <Forbidden /> } />
                    
                    <Route path={privateRoutes.AUSENTISMO_INSTITUCION} element={(callUsers)? <AusentismoGeneral  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.AUSENTISMO_GLOBAL} element={(callUsers)? <AusentismoGlobal  isLogged={callUsers} /> : <Forbidden /> } />
                    
                    <Route path={privateRoutes.CITACION_NEW} element={(callUsers)? <CitacionCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.CITACION_LIST} element={(callUsers)? <CitacionList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.CITACION_VIEW} element={ <CitacionView /> } >
                        <Route path=":reference" element={<CitacionView /> } />
                    </Route>
                    <Route path={publicRoutes.CITACION_OPEN} element={ <CitacionViewOpen /> } >
                        <Route path=":reference" element={<CitacionViewOpen /> } />
                    </Route>

                    <Route path={privateRoutes.OBSERVADOR_ADD} element={(callUsers)? <ObservadorCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.OBSERVADOR_TEACHER} element={(callUsers)? <ObservadorList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.OBSERVADOR_LIST} element={(callUsers)? <ObservadorList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.OBSERVADOR_VIEW} element={ <ObservadorView /> } >
                        <Route path=":reference" element={<ObservadorView /> } />
                    </Route>
                    <Route path={publicRoutes.OBSERVADOR_OPEN} element={ <ObservadorViewOpen /> } >
                        <Route path=":reference" element={<ObservadorViewOpen /> } />
                    </Route>


                    <Route path={privateRoutes.CALENDAR_ADD} element={(callUsers)? <CalendarCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.CALENDAR_VIEW} element={(callUsers)? <CalendarView  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.CALENDAR_OPEN} element={(callUsers)? <CalendarViewOpen  isLogged={callUsers} /> : <Forbidden /> } />

                    <Route path={privateRoutes.STUDENTS_ADD} element={(callUsers)? <StudentsCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.STUDENTS_LIST} element={(callUsers)? <StudentsList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.STUDENTS_VIEW} element={(callUsers)? <StudentsView  isLogged={callUsers} /> : <Forbidden /> } />

                    <Route path={privateRoutes.TEACHER_ADD} element={(callUsers)? <TeachersCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.TEACHER_LIST} element={(callUsers)? <TeachersList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.TEACHER_VIEW} element={(callUsers)? <TeachersView  isLogged={callUsers} /> : <Forbidden /> } />


                    <Route path={privateRoutes.EXCUSAS_TEACHER} element={(callUsers)? <ExcusasList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.EXCUSAS_ADD} element={(callUsers)? <ExcusasCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.EXCUSAS_LIST} element={(callUsers)? <ExcusasList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.EXCUSAS_VIEW} element={ <ExcusasView /> } >
                        <Route path=":reference" element={<ExcusasView /> } />
                    </Route>
                    <Route path={privateRoutes.EXCUSAS_VIEWOPEN} element={ <ExcusasViewOpen /> } >
                        <Route path=":reference" element={<ExcusasViewOpen /> } />
                    </Route>

                    <Route path={privateRoutes.OBSERVADOR_TEACHER} element={(callUsers)? <ObservadorCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.OBSERVADOR_ADD} element={(callUsers)? <ObservadorCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.OBSERVADOR_LIST} element={(callUsers)? <ObservadorList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.OBSERVADOR_VIEW} element={<ObservadorView />} />

                    <Route path={publicRoutes.COMUNICACION_VIEW} element={ <ComunicacionViewOpen /> } >
                        <Route path=":reference" element={<ComunicacionViewOpen /> } />
                    </Route>
                    <Route path={privateRoutes.COMUNICACION_ADD} element={(callUsers)? <ComunicacionCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.COMUNICACION_LIST} element={(callUsers)? <ComunicacionList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.COMUNICACION_VIEW} element={(callUsers)? <ComunicacionView  isLogged={callUsers} /> : <Forbidden /> } />

                    <Route path={privateRoutes.EXAMEN_ADD} element={(callUsers)? <ExamenCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.EXAMEN_LIST} element={(callUsers)? <ExamenList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.EXAMEN_VIEW} element={(callUsers)? <ExamenView  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.EXAMEN_VIEWRESOLVER} element={(callUsers)? <ExamenViewResolver  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.EXAMEN_VIEWSEDE} element={(callUsers)? <ExamenViewSede  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.EXAMEN_RATE} element={(callUsers)? <ExamenViewCalificar  isLogged={callUsers} /> : <Forbidden /> } />

                    <Route path={privateRoutes.TAREA_ADD} element={(callUsers)? <TareaCreate  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.TAREA_LIST} element={(callUsers)? <TareaList  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.TAREA_VIEW} element={(callUsers)? <TareaView  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.TAREA_VIEWRESOLVER} element={(callUsers)? <TareaViewResolver  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.TAREA_VIEWSEDE} element={(callUsers)? <TareaViewSede  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.TAREA_RATE} element={(callUsers)? <TareaViewCalificar  isLogged={callUsers} /> : <Forbidden /> } />

                    <Route path={privateRoutes.CONSULTA_DOCENTELIST} element={(callUsers)? <ConsultarDocenteLista  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.CONSULTA_DOCENTEADD} element={(callUsers)? <ConsultarDocente  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.CONSULTA_DOCENTEVIEW} element={(callUsers)? <ConsultarDocenteView  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.CONSULTA_DOCENTESEDE} element={(callUsers)? <ConsultarDocenteSede  isLogged={callUsers} /> : <Forbidden /> } />

                    <Route path={privateRoutes.CONFIG_WP} element={(callUsers)? <RegistrarWhatsapp  isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.CONFIG_GENERAL} element={(callUsers)? <ConfiguracionesGenerales  isLogged={callUsers} /> : <Forbidden /> } />

                    <Route path={privateRoutes.HELP_GENERAL} element={(callUsers)? <Help  isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Gestión SAE (CRUD genérico por entidad) ===== */}
                    <Route path={privateRoutes.GESTION_LIST} element={(callUsers)? <GestionList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.GESTION_ADD} element={(callUsers)? <GestionAdd isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Gestión de instituciones ===== */}
                    <Route path={privateRoutes.INSTITUCIONES_LIST} element={(callUsers)? <InstitucionesList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.INSTITUCIONES_ADD} element={(callUsers)? <InstitucionesAdd isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Gestión de docentes ===== */}
                    <Route path={privateRoutes.DOCENTES_LIST} element={(callUsers)? <DocentesList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.DOCENTES_ADD} element={(callUsers)? <DocentesAdd isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Avisos institucionales ===== */}
                    <Route path={privateRoutes.AVISOS_LIST} element={(callUsers)? <AvisosList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.AVISOS_ADD} element={(callUsers)? <AvisosAdd isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== comunicados institucionales ===== */}
                    <Route path={privateRoutes.COMUNICADOS_LIST} element={(callUsers)? <ComunicacionList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.COMUNICADOS_ADD} element={(callUsers)? <ComunicacionCreate isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Gestión de estudiantes y matrículas ===== */}
                    <Route path={privateRoutes.ESTUDIANTES_SAE_LIST} element={(callUsers)? <EstudiantesList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.ESTUDIANTES_SAE_ADD} element={(callUsers)? <EstudiantesAdd isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.MATRICULAS_LIST} element={(callUsers)? <MatriculasList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.MATRICULAS_ADD} element={(callUsers)? <MatriculasAdd isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Gestión de cursos ===== */}
                    <Route path={privateRoutes.CURSOS_LIST} element={(callUsers)? <CursosList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.CURSOS_ADD} element={(callUsers)? <CursosAdd isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Pensum: áreas y asignaturas ===== */}
                    <Route path={privateRoutes.AREAS_LIST} element={(callUsers)? <AreasList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.AREAS_ADD} element={(callUsers)? <AreasAdd isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.ASIGNATURAS_LIST} element={(callUsers)? <AsignaturasList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.ASIGNATURAS_ADD} element={(callUsers)? <AsignaturasAdd isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Indicadores de desempeño ===== */}
                    <Route path={privateRoutes.COMPETENCIAS_LIST} element={(callUsers)? <CompetenciasList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.COMPETENCIAS_ADD} element={(callUsers)? <CompetenciasAdd isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Calificaciones ===== */}
                    <Route path={privateRoutes.NOTAS_LIST} element={(callUsers)? <NotasList isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.NOTAS_ADD} element={(callUsers)? <NotasAdd isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Reportes / acciones SAE ===== */}
                    <Route path={privateRoutes.ESTADISTICAS_SAE} element={(callUsers)? <EstadisticasSae isLogged={callUsers} /> : <Forbidden /> } />
                    <Route path={privateRoutes.PROMOCION} element={(callUsers)? <Promocion isLogged={callUsers} /> : <Forbidden /> } />

                    {/* ===== Alias de rutas SAE (copcimenuenla de logic.tabopcimenu) ===== */}
                    <Route path="/anolec" element={<Navigate to="/gestion/anos" replace />} />

                </NotFound>                
            </BrowserRouter>
        </Suspense>
    )
}
