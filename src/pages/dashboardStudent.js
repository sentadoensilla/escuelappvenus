import { Fragment, useState, useEffect, useContext} from 'react'
// import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from '../services/context/UserContext';
import { Forbidden } from "./forbidden";
// eslint-disable-next-line
import { publicRoutes, privateRoutes } from '../services/routes'
// eslint-disable-next-line
import DatePicker, { registerLocale, setDefaultLocale } from  "react-datepicker";
// eslint-disable-next-line
import swal from 'sweetalert2'
import * as myConst from '../main/constants'
import messenger from '../services/messenger'
import tool from '../services/tools'

import WidgetCirciular from './components/circularStats'
import { ChartLine } from './components/lineStats'
import WidgetWP from './components/wpStats'


import Listado from './components/tables'
import UserHead from './components/head'
import { Foot } from './components/foot'

import "react-datepicker/dist/react-datepicker.css";

import es from 'date-fns/locale/es';
registerLocale('es', es)

function Dashboard() {
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	tool.setUser(elUsuario)
	const ahora = tool.dateNow()
	const mes = ahora.month // '11' //
	// eslint-disable-netx-line
	// const [isAgree, setIsAgree] = useState(false);
	// eslint-disable-next-line
	// const [proper, setProper] = useState({});
	// const deviceInfo = tool.deviceInfo()
	const [statsStudentAttend, setStatsStudentAttend] = useState({});
	const [statsStudentAttendDay, setStatsStudentAttendDay] = useState({});
	const [statsStudentExam, setStatsStudentExam] = useState({});
	const [statsStudentHomework, setStatsStudentHomework] = useState({});
	const [statsTeacherAsk, setStatsTeacherAsk] = useState({});
	const [statsTeacherAskDetails, setStatsTeacherAskDetails] = useState({});
	const [statsAlertSent, setStatsAlertSent] = useState({});
	const [statsResumeStudents, setStatsResumeStudents] = useState({});
	const [statsBitacora, setStatsBitacora] = useState({});
	const [statsWP, setStatsWP] = useState({});

	const [fechaini, setFechaIni] = useState(new Date(tool.addDays(new Date(), -30).toISOString().split('T')[0])); //useState('2023-10-01') //
	const [fechafin, setFechaFin] = useState(new Date()); // useState('2023-10-31') // 

	// eslint-disable-next-line
	const elMenu = tool.getNav()

    const [isShowing, setIsShowing] = useState(false);
	const miUsuario =  tool.getUser()

	/**
	 * respuestaConDatos: los endpoints de dashboard responden
	 * {status:'error', statusCode:400, message:'0 Resultados encontrados', rows:{}}.
	 * Comparar rows contra el string "{}" siempre era true y guardaba estados
	 * con title/data undefined que rompían los widgets. Validar de verdad.
	 */
	const respuestaConDatos = (elMensaje) => {
		return !!elMensaje &&
			Number(elMensaje.statusCode) === 200 &&
			!!elMensaje.rows &&
			typeof elMensaje.rows === 'object' &&
			Object.keys(elMensaje.rows).length > 0;
	}

	const getStatsStudentsAttendance = async() =>{
		setWaiting(waiting => true)
		
		await messenger.poster({
			method: 'POST',
			value: {
				'fechaini': fechaini,
				'fechafin': fechafin,
				'mes': mes
			},
			url: myConst.roots.engine + myConst.roots.dashInitialAttendanceStudent
		})
		.then((elMensaje) =>{
			setWaiting(waiting => false)
			if(respuestaConDatos(elMensaje)){
				setStatsStudentAttend(elAyer => elMensaje.rows)
			}
		})
		.catch(error =>{
			setWaiting(waiting => false)
			// eslint-disable-next-line
			console.log('catch: ', error.toString())
		});
	}

	const getStatsStudentsAttendanceDay = async() =>{
		setWaiting(waiting => true)
		
		await messenger.poster({
			method: 'POST',
			value: {
				'fechaini': fechaini,
				'fechafin': fechafin,
				'mes': mes
			},
			url: myConst.roots.engine + myConst.roots.dashInitialAttendanceStudentDay
		})
		.then((elMensaje) =>{
			setWaiting(waiting => false)
			if(respuestaConDatos(elMensaje)){
				setStatsStudentAttendDay(elAyer => elMensaje.rows)
			}
		})
		.catch(error =>{
			setWaiting(waiting => false)
			// eslint-disable-next-line
			console.log('catch: ', error.toString())
		});
	}

	const getStatsBitacora = async() =>{
		setWaiting(waiting => true)
		await messenger.poster({
			method: 'POST',
			value: {
				'id_institucion': miUsuario.academicoId,
				'anolectivo': miUsuario.usuarioAnoId,
				'id_usuario': miUsuario.usuarioId,
				'fechaini': fechaini,
				'fechafin': fechafin,
			},
			url: myConst.roots.engine + myConst.roots.dashInitialBitacora
		})
		.then((elMensaje) =>{
			setWaiting(waiting => false)
			if(respuestaConDatos(elMensaje)){
				setStatsBitacora(antes => elMensaje.rows)
			}
		})
		.catch(error =>{
			setWaiting(waiting => false)
			// eslint-disable-next-line
			console.log('catch: ', error.toString())
		});
	}

	const getStatsStudentsExams = async() =>{
		setWaiting(waiting => true)
		
		await messenger.poster({
			method: 'POST',
			value: {
				'fechaini': fechaini,
				'fechafin': fechafin,
				'mes': mes
			},
			url: myConst.roots.engine + myConst.roots.dashInitialExamStudent
		})
		.then((elMensaje) =>{
			setWaiting(waiting => false)
			if(respuestaConDatos(elMensaje)){
				setStatsStudentExam(enAntes => elMensaje.rows)
			}
		})
		.catch(error =>{
			setWaiting(waiting => false)
			// eslint-disable-next-line
			console.log('catch: ', error.toString())
		});
	}

	const getStatsStudentsHomework = async() =>{
		setWaiting(waiting => true)
		
		await messenger.poster({
			method: 'POST',
			value: {
				'fechaini': fechaini,
				'fechafin': fechafin,
				'mes': mes
			},
			url: myConst.roots.engine + myConst.roots.dashInitialHomeworkStudent
		})
		.then((elMensaje) =>{
			setWaiting(waiting => false)
			if(respuestaConDatos(elMensaje)){
				setStatsStudentHomework(antiYer => elMensaje.rows)
			}
		})
		.catch(error =>{
			setWaiting(waiting => false)
			// eslint-disable-next-line
			console.log('catch: ', error.toString())
		});
	}

	const getStatsTeacherAsk = async() =>{
		setWaiting(waiting => true)
		
		await messenger.poster({
			method: 'POST',
			value: {
				'fechaini': fechaini,
				'fechafin': fechafin,
				'mes': mes
			},
			url: myConst.roots.engine + myConst.roots.dashInitialAskTeacher
		})
		.then((elMensaje) =>{
			setWaiting(waiting => false)
			if(respuestaConDatos(elMensaje)){
				setStatsTeacherAsk(antes => elMensaje.rows)
			}
		})
		.catch(error =>{
			setWaiting(waiting => false)
			// eslint-disable-next-line
			console.log('catch: ', error.toString())
		});
	}

	const columnas = [
		{name:'DOCENTE',selector: row => row.docente,sortable:true},
		{name:'CONSULTAS',selector: row => row.consultas,sortable:true},
		{name:'RESPUESTAS',selector: row => row.respondidas,sortable:true}
	]
	const getStatsTeacherAskDetail = async() =>{
		setWaiting(waiting => true)
		
		await messenger.poster({
			method: 'POST',
			value: {
				'fechaini': fechaini,
				'fechafin': fechafin,
				'mes': mes
			},
			url: myConst.roots.engine + myConst.roots.dashInitialAskTeacherDetail
		})
		.then((elMensaje) =>{
			setWaiting(waiting => false)
			if(respuestaConDatos(elMensaje)){
				let preDetails = {
					title: elMensaje.rows.title,
					columns:columnas,
					data: elMensaje.rows.data
				}
				setStatsTeacherAskDetails(antes => preDetails)
			}
		})
		.catch(error =>{
			setWaiting(waiting => false)
			// eslint-disable-next-line
			console.log('catch: ', error.toString())
		});
	}

	const getStatsAlertSent = async() =>{
		setWaiting(waiting => true)
		
		await messenger.poster({
			method: 'POST',
			value: {
				'fechaini': fechaini,
				'fechafin': fechafin,
				'mes': mes
			},
			url: myConst.roots.engine + myConst.roots.dashInitialAlerts
		})
		.then((elMensaje) =>{
			setWaiting(waiting => false)
			if(respuestaConDatos(elMensaje)){
				setStatsAlertSent(antes => elMensaje.rows)
			}
		})
		.catch(error =>{
			setWaiting(waiting => false)
			// eslint-disable-next-line
			console.log('catch: ', error.toString())
		});
	}

	const columnasStudents = [
		{name:'GRUPO',selector: row => row.grupo,sortable:true},
		{name:'ACTIVOS',selector: row => row.activos,sortable:true},
		{name:'INACTIVOS',selector: row => row.inactivos,sortable:true},
		{name:'FALTARON HOY',selector: row => row.novinohoy,sortable:true},
		{name:'FALTARON MES',selector: row => row.novinomes,sortable:true}
	]
	const getStatsListStudent = async() =>{
		setWaiting(waiting => true)
		
		await messenger.poster({
			method: 'POST',
			value: {
				'fechaini': fechaini,
				'fechafin': fechafin,
				'mes': mes
			},
			url: myConst.roots.engine + myConst.roots.dashInitialResumeStudents
		})
		.then((elMensaje) =>{
			setWaiting(waiting => false)
			if(respuestaConDatos(elMensaje)){
				let preDetails = {
					title: elMensaje.rows.title,
					columns:columnasStudents,
					data: elMensaje.rows.data
				}
				setStatsResumeStudents(antes => preDetails)
			}
		})
		.catch(error =>{
			setWaiting(waiting => false)
			// eslint-disable-next-line
			console.log('catch: ', error.toString())
		});
	}

	const getStatsWP = async() =>{
		setWaiting(waiting => true)
		
		await messenger.poster({
			method: 'POST',
			value: {
				'fechaini': fechaini,
				'mes': mes
			},
			url: myConst.roots.engine + myConst.roots.dashInitialWP
		})
		.then((elMensaje) =>{
			setWaiting(waiting => false)
			if(respuestaConDatos(elMensaje)){
				setStatsWP(antes => elMensaje.rows)
			}
		})
		.catch(error =>{
			setWaiting(waiting => false)
			// eslint-disable-next-line
			console.log('catch: ', error.toString())
		});
	}

	const refresData = () =>{

		// NOTA: este es el tablero del ESTUDIANTE. No invocar endpoints
		// exclusivos de docente/director (guardas isDirector_and_tecaher):
		// attendancesteacher, attendancesteacherbyday,
		// listUnnattendance, listUnnattendanceGroup.
		getStatsWP()
		getStatsStudentsAttendanceDay()
		getStatsStudentsAttendance()
		getStatsBitacora()
		getStatsListStudent()
		getStatsStudentsExams()
		getStatsStudentsHomework()
		getStatsTeacherAsk()
		getStatsTeacherAskDetail()
		getStatsAlertSent()
	}

    // eslint-disable-next-line
	const openShowing = () =>{
		if(!isShowing){
			setIsShowing(isShowing => true)
		}	
	}

	const closeShowng = () =>{
		if(isShowing){
			setIsShowing(isShowing => false)
		}	
	}

	// Hooks SIEMPRE antes de cualquier return condicional (regla de hooks).
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		if(miUsuario.isLogged){
			refresData()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fechaini, fechafin]);

	if(!miUsuario.isLogged){
		return (
			<Fragment>
				<Forbidden />
			</Fragment>
		);
	}

	return (
		<Fragment>
			<div id='elgrapper' className="wrapper">
				<UserHead waiting={waiting} setWaiting={setWaiting} />

				<div className="main-panel">
					<div className="content">
						<div className="page-inner">
							<div className="page-inner">
								<div className="page-inner mt--5">
									<h1 className="text-center">
										<img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
										{ miUsuario.usuarioInstitucionNombre } 
									</h1>
								</div>
							</div>

							<div className="row">
								<div className="col-md-12">
									<div className="card full-height">
										<div className="card-body">
											<div className="col-md-6">
												<div className="text-center">
													
												</div>
											</div>
											<div className="col-md-6">
												<div className="row">
													<div className="col-md-3">
														<label>Desde: <DatePicker locale="es"
																dateFormat={"yyyy-MM-dd"}
																className="form-control" placeholderText='AAAA-MM-DD'
																onChange={(date) => {setFechaIni(date)}}
																selected={fechaini}
																/> 
														</label>
													</div>
													<div className="col-md-3">
														<label>Hasta: <DatePicker locale="es"
															dateFormat={"yyyy-MM-dd"}
															className="form-control" placeholderText='AAAA-MM-DD'
															onChange={(date) => {setFechaFin(date)}}
															selected={fechafin}
															/>
														</label>												
													</div>
												</div>
											</div>

										</div>
									</div>
								</div>							
							</div>

							<div className="page-inner mt--2">
								<div className="row mt--2">
									<div className="col-md-7">
										{ 
											(statsAlertSent.hasOwnProperty('title'))?
												<WidgetCirciular props={statsAlertSent} />
												:
												""
										}
										<div className="row">
											<div className="col-md-6">
												{ 
													(statsTeacherAsk.hasOwnProperty('title'))?
														<WidgetCirciular props={statsTeacherAsk} />
														:
														""										
												}
											</div>
											<div className="col-md-6">
												{
													(statsTeacherAskDetails.hasOwnProperty('title'))?  
														<div className="card">
															<div className="card-body">
																<div className="flex-wrap justify-content-around">
																	<Listado props={statsTeacherAskDetails} /> 
																</div>
															</div>
														</div>
														: 
														<div><h2 className='text-center text-danger'>Buscando datos realacionados con docentes</h2></div>
												}
											</div>
										</div>
									</div>
									<div className="col-md-5">
										{ 
											(statsWP.hasOwnProperty('title'))?
												<WidgetWP props={statsWP} />
												:
												""
										}
									</div>
								</div>
								<div className="row mt--2">
									<div className="col-md-7">
										{ 
											(statsResumeStudents.hasOwnProperty('title'))?
												<div className="card">
													<div className="card-body">
														<div className="flex-wrap justify-content-around">
															<Listado props={statsResumeStudents} /> 
														</div>
													</div>
												</div>
												: 
												<div><h2 className='text-center text-danger'>Buscando datos realacionados con estudiantes</h2></div>
										}
									</div>
									<div className="col-md-5">
										{ 
											(statsStudentAttend.hasOwnProperty('title'))?
												<WidgetCirciular props={statsStudentAttend} />
												:
												""
										}
										{ 
											(statsBitacora.hasOwnProperty('title'))?
												<WidgetCirciular props={statsBitacora} />
												:
												""
										}
									</div>
								</div>
								<div className="row mt--2">
									<div className="col-md-12">
										{ 
											(statsStudentAttendDay.hasOwnProperty('title'))?
												<ChartLine props={statsStudentAttendDay} />
												:
												""
										}										
									</div>
								</div>
								<div className="row mt--2">
									<div className="col-md-6">
										{ 
											(statsStudentExam.hasOwnProperty('title'))?
												<WidgetCirciular props={statsStudentExam} />
												:
												""										
										}										
									</div>
									<div className="col-md-6">
										{ 
											(statsStudentHomework.hasOwnProperty('title'))?
												<WidgetCirciular props={statsStudentHomework} />
												:
												""										
										}
									</div>
								</div>															
							</div>
						</div>
					</div>
					<Foot />
				</div>
				<div className={(isShowing)? "custom-template open" : "custom-template" }>
					<div className="title">						
						<span className="text-danger my5" onClick={()=>{closeShowng()}}>
							<i className="fas fa-window-close"></i>
						</span>
						<h4 className="ph5">
							 Detalles del gráfico
						</h4>

					</div>
					<div className="custom-content">
						
					</div>
				</div>
			</div>
			
		</Fragment>
	);
}

export default Dashboard;
