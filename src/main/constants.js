export const roots = {
	engine: process.env.REACT_APP_BACKEND_URL,
	app: process.env.PUBLIC_URL,
	login: '/users/login/',
	listaAno: '/anolectivo/listado',
	checkemail:'/request/checkemail',

	wpqr:'/bochinche/iniciarsesion',
	wpsave: '/bochinche/iniciarsesion',
	wpdelete: '/bochinche/deletewhatsappos',
	wplist:'/bochinche/getwhatsappos',
	wplistStatus:'/bochinche/getwhatsapposstatus',

	rememberpass: '/gates/passforgotten/',
	rememberpasscheck: '/gates/passforgottencheck/',
	rememberresetpass: '/gates/passforgottenreset/',
	resetpass: '/gates/passreset/',
	
	menuNew: '/menu/menuadd',
	menuList: '/menu/menulist',
	menuDelete: '/menu/menudelete',
	menuUpdate: '/menu/menuupdate',

	alertNew:'/alerts/createAlert',
	alertUpdate:'/alerts/editAlert',
	alertList:'/alerts/listAlert',
	alertListOne:'/alerts/viewOneAlerts',
	alertView:'/alerts/viewAlerts',
	alertDelete:'/alerts/deleteAlert',
	alertAnswer:'/alerts/answerAlert',
	alertCommentsList:'/alerts/listcommentsAlert',

	citacionesNew:'/citaciones/citacionesNew',
	citacionesUpdate:'/citaciones/citacionesUpdate',
	citacionesList:'/citaciones/citacionesList',
	citacionesListOne:'/citaciones/citacionesList',
	citacionesView:'/citaciones/citacionesView',
	citacionesViewOpen:'/citaciones/citacionesViewOpen',
	citacionesDelete:'/citaciones/citacionesDelete',

	observacionesNew:'/observer/sendObservaciones',
	observacionesUpdate:'/observer/observacionesUpdate',
	observacionesList:'/observer/listObservaciones',
	observacionesListOne:'/observer/listObservaciones',
	observacionesView:'/observer/observacionesView',
	observacionesViewOpen:'/observer/observacionesViewOpen',
	observacionesDelete:'/observer/observacionesDelete',
	observacionesComms:'/observer/observacionesComms',
	observacionesCommsList:'/observer/observacionesCommsList',

	tipoDesempenoNew:'/tipodesempeno/insercion',
	tipoDesempenoList:'/tipodesempeno/listado',
	tipoDesempenoUpdate:'/tipodesempeno/actualizacion',

	excusaNew:'/academic/sendExcusa',
	excusaUpdate:'/academic/editAlert',
	excusaList:'/academic/listExcusa',
	excusaListOpen:'/academic/listExcusaOpen',

	excusaListGroup:'/academic/listExcusaGroup',
	excusaTipo:'/academic/consultTipoExcusa',
	excusaView:'/academic/listExcusa',
	excusaDelete:'/academic/deleteExcusa',
	excusaAnswer:'/academic/answerExcusa',

	asistenciaNew:'/attendance/attendancesave',
	asistenciaDelete:'/attendance/deleteAttendance',
	asistenciaListGroup:'/attendance/attendacelistgroup',
	asistenciaListView:'/attendance/listAttendancegroup',
	asistenciaListViewAdmin:'/attendance/listAttendanceAdmin',
	asistenciaListExport:'/attendance/listAttendanceAdminExport',
	asistenciaTipoNovedad:'/attendance/litstiponovedad',	
	asistenciaSeguimiento:'/asignments/horarioseguimiento',	
	listaExcusas: '/attendance/getExcusesDate',

	listaEstados: '/request/getestados',
	listaGrupos: '/request/listGroups',
	listaMotivos: '/request/listMotivos',
	listaEstudiantes: '/academic/listStudent',
	listaAsignaturas: '/attendance/getAsigments',
	listaAsignaturasXGrupo: '/attendance/getAsigmentsStudent',

	
	tipoCampana: '/request/gettipocampana',
	listaPartidos: '/request/getpartidos',
	listaPlanes: '/request/getplanes',

	getInfoCampana: '/request/infocampana',
	listaDeptos: '/data/deptos',
	listaMupios: '/data/mupios',
	listaCentros: '/data/centrospoblados',
	listaPuntos: '/data/puntosvotacion',
	listaGenero: '/data/generos',	
	usernew: '/users/useradd/',
	userlist: '/users/userlist/',
	userdelete: '/users/userdelete/',
	userupdate: '/users/userupdate/',
	liderUpdate:'/users/userliderupdate/',
	userInfoUpdate:'/users/userinfoupdate/',
	getMyInfo:'/users/usermyinfo/',
	liderList: '/users/userliderlist',
	liderDelete: '/users/userliderdelete',
	publicidadNew:'/bochinche/bochincheadd/',
	publicidadUpdate:'/bochinche/bochincheedit/',
	publicidadList: '/bochinche/bochinchelist',
	publicidadDelete: '/bochinche/bochinchedelete',
	publicidadView: '/bochinche/bochincheview',
	publicidadViewAll: '/bochinche/bochinchetotal',
	publicidadViewLog: '/bochinche/bochinchelog',
	publicidadMulti: '/bochinche/bochinchesendmulti',
	volantesList:'/bochinche/volanteslist',
	volantesNew:'/bochinche/volantesagregar',
	volantesDelete:'/bochinche/volantesdelete',
	volantesSendOne:'/bochinche/volantessendone',
	clientNew: '/clients/clientadd',
	clientList: '/clients/clientlist',
	clientDelete: '/clients/clientdelete',
	clientUpdate: '/clients/clientupdate',
	clientPlanes: '/clients/clientplans',
	votanteNew: '/voters/voteradd',
	votanteList: '/voters/voterlist',
	votanteListLider: '/voters/voterlistlider',
	votanteListCampana: '/voters/voterlistcampana',
	votanteDelete: '/voters/voterdelete',
	votanteUpdate: '/voters/voterupdate',
	votanteAgree: '/voters/voteragree',
	statsMetaCampana: '/estadisticas/campanastats',
	statsMetaLideres: '/estadisticas/lideresstats',
	statsCampanaGenero: '/estadisticas/campanagenerostats',
	statsCampanaGeneroMupio: '/estadisticas/campanageneromupiostats',
	statsCampanaGeneroPunto: '/estadisticas/campanageneropuntostats',
	statsCampanaMupio: '/estadisticas/campanamupiostats',
	statsCampanaMupioList: '/estadisticas/campanamupioliststats',
	statsCampanaMupioListExport: '/estadisticas/campanamupioliststatsreportpartial',
	statsCampanaMupioListExportTotal: '/estadisticas/campanamupioliststatsreporttotal',

	dashInitialAttendanceTeacher: '/totals/statsinitial/attendancesteacher',
	dashInitialAttendanceTeacherDay: '/totals/statsinitial/attendancesteacherbyday',
	dashInitialAttendanceStudent: '/totals/statsinitial/attendancesstudent',
	dashInitialAttendanceStudentDay: '/totals/statsinitial/attendancesstudentday',
	dashInitialExamStudent: '/totals/statsinitial/examsstudent',
	dashInitialHomeworkStudent: '/totals/statsinitial/homeworksstudent',
	dashInitialAskTeacher: '/totals/statsinitial/askteacher',
	dashInitialAskTeacherDetail: '/totals/statsinitial/askteacherDetail',
	dashInitialAlerts: '/totals/statsinitial/alertsent',
	dashInitialResumeStudents: '/totals/statsinitial/studentsResume',
	dashInitialBitacora: '/totals/statsinitial/totalbitacora',
	dashInitialWP: '/totals/statsinitial/statusWP',
	dashInitialUnnatendanceGlobal:'/totals/statsinitial/listUnnattendanceGroup',
	dashInitialUnnatendance:'/totals/statsinitial/listUnnattendance',
	
	dashInitialTeacherAskTeacher: '/totals/statsinitial/teacheraskteacher',
	dashInitialTeacherAskTeacherDetail: '/totals/statsinitial/teacheraskteacherDetail',
	dashInitialTeacherAlerts: '/totals/statsinitial/alertsentteacher',
	dashInitialTeacherExcuses: '/totals/statsinitial/excusesteacher',

	dashInitialTeacherAttendanceTeacher: '/totals/statsinitial/attendancesteacher',
	dashInitialTeacherAttendanceTeacherDay: '/totals/statsinitial/attendancesteacherbyday',
	dashInitialTeacherAttendanceStudent: '/totals/statsinitial/attendancesstudentteacher',
	dashInitialTeacherAttendanceStudentDay: '/totals/statsinitial/attendancesstudentdayteacher',
	dashInitialTeacherExamStudent: '/totals/statsinitial/examsstudentteacher',
	dashInitialTeacherHomeworkStudent: '/totals/statsinitial/homeworksstudentteacher',
	dashInitialTeacherResumeStudents: '/totals/statsinitial/studentsResumeteacher',
	dashInitialTeacherBitacora: '/totals/statsinitial/totalbitacorateacher',
	dashInitialTeacherUnnatendanceGlobal:'/totals/statsinitial/listUnnattendanceGroupteacher',
	dashInitialTeacherUnnatendance:'/totals/statsinitial/listUnnattendanceteacher',

	// ===== Gestión de instituciones (SAE) =====
	institucionList:'/institucion/instituciones/listar',
	institucionNew:'/institucion/instituciones/registrar',
	institucionUpdate:'/institucion/instituciones/actualizar',
	institucionDelete:'/institucion/instituciones/borrar',
	listaZonas:'/catalogos/zonasresidencia/listar',
	listaCaracter:'/catalogos/caracter/listar',
	listaEspecialidades:'/catalogos/especialidades/listar',
	listaMetodos:'/catalogos/metodosinstitucionales/listar',
	listaDepartamentos:'/catalogos/departamentos/listar',
	listaCiudades:'/catalogos/ciudades/listar',

	// ===== Gestión de docentes (SAE) =====
	docenteList:'/sae/docentes/listar',
	docenteNew:'/sae/docentes/registrar',
	docenteUpdate:'/sae/docentes/actualizar',
	docenteDelete:'/sae/docentes/borrar',
	listaTiposDocumento:'/catalogos/tiposdocumento/listar',
	listaSexos:'/catalogos/sexos/listar',
	listaTiposSangre:'/catalogos/tipossangre/listar',

	// ===== Gestión de estudiantes y matrículas (SAE) =====
	estudianteList:'/sae/estudiantes/listar',
	estudianteNew:'/sae/estudiantes/registrar',
	estudianteUpdate:'/sae/estudiantes/actualizar',
	estudianteDelete:'/sae/estudiantes/borrar',
	matriculaList:'/sae/matriculas/listar',
	matriculaNew:'/sae/matriculas/registrar',
	matriculaUpdate:'/sae/matriculas/actualizar',
	matriculaDelete:'/sae/matriculas/borrar',

	// ===== Gestión de cursos (SAE) =====
	cursoList:'/sae/cursos/listar',
	cursoNew:'/sae/cursos/registrar',
	cursoUpdate:'/sae/cursos/actualizar',
	cursoDelete:'/sae/cursos/borrar',
	listaGrados:'/catalogos/grados/listar',
	listaJornadas:'/catalogos/jornadas/listar',
	listaAnos:'/sae/anos/listar',
	listaSedes:'/institucion/sedes/listar',

	// ===== Pensum: áreas y asignaturas (SAE) =====
	areaList:'/sae/areas/listar',
	areaNew:'/sae/areas/registrar',
	areaUpdate:'/sae/areas/actualizar',
	areaDelete:'/sae/areas/borrar',
	asignaturaList:'/sae/asignaturas/listar',
	asignaturaNew:'/sae/asignaturas/registrar',
	asignaturaUpdate:'/sae/asignaturas/actualizar',
	asignaturaDelete:'/sae/asignaturas/borrar',

	// ===== Indicadores de desempeño (SAE) =====
	competenciaList:'/sae/competencias/listar',
	competenciaNew:'/sae/competencias/registrar',
	competenciaUpdate:'/sae/competencias/actualizar',
	competenciaDelete:'/sae/competencias/borrar',

	// ===== Calificaciones / notas (SAE) =====
	notaList:'/sae/notas/listar',
	notaNew:'/sae/notas/registrar',
	notaUpdate:'/sae/notas/actualizar',
	notaDelete:'/sae/notas/borrar',
	listaAsignaciones:'/sae/asignaciones/listar',
	listaAnolperi:'/sae/anolperi/listar',



};

export const versions = {
	appPublic:'',
	publicPublic:'/app/*',
	manager:"Mg=="
};

export const essentials = {
	logo: process.env.PUBLIC_URL+'/assets/images/logo.png',
	logohorivertical: process.env.PUBLIC_URL+'/assets/images/escuelapp_logo_v.png',
	logohorizontal: process.env.PUBLIC_URL+'/assets/images/escuelapp_logo_v.png',
	logogrande: process.env.PUBLIC_URL+'/assets/images/iconBig.png',
	qrprime: process.env.PUBLIC_URL+'/assets/images/whatsappqr.png',
	name: process.env.REACT_APP_NAME,
	slogan: process.env.REACT_APP_LEMA,
}

export const coloresArray = [
	'#007bff','#6610f2','#e83e8c','#ffc107','#28a745',
	'#dc3545','#fd7e14','#28a745','#20c997','#17a2b8',
	'#6c757d','#007bff','#6c757d','#28a745','#343a40',
	'#f8f9fa','#dc3545','#ffc107','#6f42c1','#FA57ff'
];

export const messages = {
	invalidUser: ['Usuario no valido', 'Invalid user'],
	invalidPassword: ['Clave no valida', 'Password so weak'],
	invalidAction: ['Accion prohibida', 'Really? Forbidden!!!'],
};

export const labels = {
	loginTitle: ['Ingreso', 'Login'],
	loginUser: ['Usuario o Email', 'User or email'],
	loginPassword: ['Clave', 'Password'],
	loginButtonGo: ['Ingresar', 'Login'],
	loginButtonReset: ['Cancelar', 'Cancel'],
	loginForgive: ['Olvidé mi clave', 'Forgot Password'],
	loginNewUser: ['Crear una cuenta', 'Sign In'],
	excusasAdd: [['Enviar Excusa', 'New Excuse'], ['Editar Excusa', 'Edit Excuse']],
	excusasList: ['Mis Excusas', 'All Excuses'],
	menuAdd: [['Crear menú', 'New Menu'], ['Editar menú', 'Edit Menu']],
	menuList: [['Listado de menues', 'Menu List'], ['Editar menú', 'Edit Menu']],
	votanteAdd: [['Registrar votante', 'New Voter'], ['Editar votante', 'Edit voter']],
	votanteList: ['Mis votantes', 'My voter'],
	liderAdd: [['Registrar lider', 'New member'], ['Editar lider', 'Edit member']],
	liderList: ['Mis colaboradores', 'My members'],
	
	
	alertAdd: [['Enviar Comunicado', 'Send Message'], ['Editar Comunicado', 'Edit Message']],
	alertList: ['Mis Comunicados', 'My Messages'],
	citacionesAdd: [['Enviar Citación', 'Send Summons'], ['Editar Citación', 'Edit Summons']],
	citacionesList: ['Mis Citaciones', 'My Summons'],
	asistenciaAdd: [['Marcar asistencias', 'Attendance record']],
	asistenciaList: [['Historial de asistencias', 'My Attendance']],
	asistenciaView: [['Seguimiento a las asistencias', 'View Attendance']],
	asistenciaDelete: [['Eliminar asistencias', 'Delete Attendance']],
	observacionesAdd: [['Registrar Observación', 'New Issue'], ['Editar Observación', 'Edit Issue']],
	observacionesList: ['Las Observaciones', 'All issues'],
	
	tipoDesempenoAdd: 
	[
		['Registrar Tipo de desempeño', 
			'New Type performance'], 
		['Editar Tipo de desempeño', 
			'Edit Performance']
	],
	tipoDesempenoList: ['Los Tipos de desempeño', 'All Performance'],

	institucionesAdd: [['Registrar Institución', 'New Institution'], ['Editar Institución', 'Edit Institution']],
	institucionesList: ['Instituciones', 'Institutions'],

	docentesAdd: [['Registrar Docente', 'New Teacher'], ['Editar Docente', 'Edit Teacher']],
	docentesList: ['Docentes', 'Teachers'],

	estudiantesAdd: [['Registrar Estudiante', 'New Student'], ['Editar Estudiante', 'Edit Student']],
	estudiantesList: ['Estudiantes', 'Students'],

	matriculasAdd: [['Registrar Matrícula', 'New Enrollment'], ['Editar Matrícula', 'Edit Enrollment']],
	matriculasList: ['Matrículas', 'Enrollments'],

	cursosAdd: [['Registrar Curso', 'New Course'], ['Editar Curso', 'Edit Course']],
	cursosList: ['Cursos', 'Courses'],

	areasAdd: [['Registrar Área', 'New Area'], ['Editar Área', 'Edit Area']],
	areasList: ['Áreas del saber', 'Knowledge Areas'],

	asignaturasAdd: [['Registrar Asignatura', 'New Subject'], ['Editar Asignatura', 'Edit Subject']],
	asignaturasList: ['Asignaturas', 'Subjects'],

	competenciasAdd: [['Registrar Competencia', 'New Competence'], ['Editar Competencia', 'Edit Competence']],
	competenciasList: ['Indicadores de desempeño', 'Performance Indicators'],

	notasAdd: [['Registrar Nota', 'New Grade'], ['Editar Nota', 'Edit Grade']],
	notasList: ['Calificaciones', 'Grades'],


	headProfileView: ['Ver perfil', 'View Profile'],
	headProfileEdit: ['Editar perfil', 'Edit Profile'],
	logOut: [' Salir ', ' Logout '],
};

export const protocolMessages = {
	status:{
		200:'OK',
		201:'Creado',
		202:'Aceptado',
		400:'Error',
		401:'No sutorizado',
		403:'Prohibido',
		404:'No encontrado',
		500:'Error inesperado',
		503:'No disponible'
	}
}
