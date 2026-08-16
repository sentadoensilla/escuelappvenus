import { Fragment, useContext } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from '../services/context/UserContext';
import { publicRoutes } from '../services/routes'
import swal from 'sweetalert2'
import * as myConst from '../main/constants'
import messenger from '../services/messenger'
import tool from '../services/tools'
// eslint-disable-netx-line
// import UserHead from './components/head'
import HeadPublic from './parts/headPublic'
import HeadRibbon from './parts/ribbonLight'
import { Foot } from './components/foot'

function Agree() {
 	const argumentos = useParams()
	const navegar = useNavigate()
	// eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext)
	// eslint-disable-netx-line
	// const [isAgree, setIsAgree] = useState(false);
	// eslint-disable-next-line
	// const [proper, setProper] = useState({});
	const deviceInfo = tool.deviceInfo()
	const reference = argumentos.reference

	// eslint-disable-netx-line
	// console.log('El personal es: ', deviceInfo, tool.decriptar(argumentos.reference))

	// proper.navigator = tool.getBrowserName(navigator.userAgent)

	const meCaso = async (e) =>{
		e.preventDefault();
		setWaiting(waiting => true)

		await messenger.poster({
			method: 'POST',
			value: { 
				reference, 
				deviceInfo
			},
			url: myConst.roots.engine + myConst.roots.votanteAgree
		})
		.then((elMensaje) =>{
			// console.log('la respuesta: ', elMensaje)
			setWaiting(waiting => false)
			swal.fire({
				icon: elMensaje.status,
				showConfirmButton: true,
				showCancelButton: true,
				confirmButtonText:'Listo',
				cancelButtonText:'Intentar de nuevo',
				customClass: {
					confirmButton:'btn btn-success',
					cancelButton:'btn btn-danger'
				}
			}).then(answer =>{
				if(answer.isConfirmed){
					navegar(publicRoutes.INDEX)
				}else{
					window.location.reload(false)
				}
			})
		})
		.catch(elError => {

			// console.log('Error: ', elError)
			setWaiting(waiting => false)
		})	
		setWaiting(waiting => false)
	}

	return (
		<Fragment>
			<div id='elgrapper' className='wrapper overlay-sidebar'>
				<HeadPublic />

				<div className='main-panel'>
					<div className='content'>
						<HeadRibbon />
						<div className='page-inner mt--5'>
							<div className='row'>
								<div className='col-md-12'>
								<div className="card">
								<div className="card-header">
									<h3 className="card-title text-center">POLÍTICA PARA EL TRATAMIENTO DE DATOS PERSONALES </h3>
								</div>
								<div className="card-body">

									<div className="tab-content mt-2 mb-3 text-justify" style={{"height":"280px","overflowY":"scroll"}}>
										<p>
											OBJETIVOS: Establecer la política y lineamientos para la seguridad de la información, el tratamiento y confidencialidad de datos personales, cumpliendo con lo establecido en la ley 1582 de 2012 y su decreto reglamentario 1377 de 2013 y demás normas que la acompañen, definiendo los aspectos relacionados con la autorización para el tratamiento de datos personales, las políticas de tratamiento de los responsables y encargados, el ejercicio de los derechos de los titulares de la información, las transferencias de datos personales y la responsabilidad demostrada frente al tratamiento de datos personales, así como a conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellos en las bases de datos o en archivos de entidades públicas y privadas tratados por Array a través del software POLIMETRIKA, la cual se ofrece como una herramienta para la administración de los datos de los posibles votantes en una campaña política. ALCANCE: La presente política aplica para toda la información personal registrada en la base de datos de ARRAY S.A.S obtenidos a través del software POLIMETRIKA, quien usara la información registrada únicamente para fines de almacenamiento, estadística y publicidad para las campañas políticas. Los responsables de la recolección de los datos serán los diferentes usuarios que adquieran el servicio. DEFINICIONES: Con base en lo contenido en la Ley 1581 de 2012 y en el Capítulo 25 del Decreto 1074 de 2015, para la política de tratamiento de datos personales se aplican las siguientes definiciones:Autorización: Es el permiso o consentimiento que da el titular de los datos para el tratamiento específico de estos, acorde con las funciones de la entidad.Aviso de Privacidad: Comunicación verbal o escrita generada por el responsable, dirigida al Titular de los Datos, para el Tratamiento de sus datos personales, mediante la cual se le informa acerca de la existencia de las Políticas de Tratamiento de información que le serán aplicables, la forma de acceder a las mismas y las finalidades del tratamiento que se pretende dar a los datos personales.Base de Datos: Conjunto organizado de datos personales que sea objeto de tratamiento. Base de datos personales: Conjunto organizado de datos de carácter personal, creados, almacenados, organizados, tratados y con acceso manual o a través de programas de ordenador o software. Dato personal: Es la información que identifica a una persona o que pueda asociarse y la haga identificable; estos datos pueden ser numéricos, alfabéticos, gráficos, visuales, biométricos, o de cualquier otro tipo. Datos sensibles: Se entiende por datos sensibles aquellos que afectan la intimidad del Titular o cuyo uso indebido puede generar su discriminación, tales como aquellos que revelen el origen racial o étnico, la orientación política, las convicciones religiosas o filosóficas, la pertenencia a sindicatos, organizaciones sociales, de derechos humanos o que promueva intereses de cualquier partido político o que garanticen los derechos y garantías de partidos políticos de oposición, así como los datos relativos a la salud, a vida sexual, y datos biométricos. Dato personal semiprivado: Son datos que no tienen naturaleza íntima ni pública, cuyo conocimiento o divulgación puede interesar no solo a su titular, sino a un grupo de personas o a la sociedad en general. Para su tratamiento se requiere la autorización expresa del titular de la información. (Ej. Dato financiero y crediticio). Dato personal público: Es la información personal que la Constitución y las normas han determinado como públicos y que para su recolección y tratamiento no requiere de autorización del titular de la información y los cuales pueden ser ofrecidos u obtenidos sin reserva alguna. Encargado del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el Tratamiento de datos personales por cuenta del responsable del Tratamiento. Responsable del tratamiento: Los responsables del tratamiento, obtención, recolección de los datos personales que se llegaran a manejar en el software POLIMETRIKA, serán los usuarios que adquieran el servicio.  La empresa ARRAY, sociedad legalmente constituida, identificada con el Nit 901.145.368-6 página web polimetrika.com y correo electrónico para inquietudes y soporte soporte@polimetrika.com se encargará del uso de la información registrada en el software POLIMETRIKA para los fines contratados. Oficial de protección de datos: Es la persona que tiene como función la vigilancia y control de la aplicación de la Política de Protección de Datos Personales. Titular: Persona natural cuyos datos personales sean objeto de Tratamiento, sea cliente, proveedor, empleado, o cualquier tercero que, en razón de una relación comercial o jurídica, suministre datos personales a La Compañía. Tratamiento: Cualquier operación o conjunto de operaciones sobre datos personales, tales como la recolección, almacenamiento, uso, circulación o supresión. Array: Se refiere a la sociedad identificada con NIT 901.145.368-6, proveedor del Software. (polimetrika.com o polimetrika API): Es la Interfaz de Programación de Aplicaciones que Array dispone para uso de los Suscriptores o Aliados Estratégicos para integrar otras soluciones tecnológicas con Polimetrika. OBLIGACIONES: Esta política es de obligatorio y estricto cumplimiento tanto para los suscriptores como para ARRAY S.A.S. TRATAMIENTO Y FINALIDAD: El tratamiento que realizará por parte de ARRAY S.A.S de los datos ingresados en el software POLIMETRIKA, será almacenamiento, uso estadístico y publicidad de la información personal y además en los siguientes casos:

											Efectuar el procesamiento y administración de los datos del Suscriptor como cliente o de sus Usuarios y votantes potenciales.

											Ofrecer a través de medios propios o conjuntamente con terceros información de nuevos lanzamientos de productos, servicios, planes, promociones, eventos y/o beneficios.

											Solicitar información adicional que beneficie la operación, soporte, mantenimiento, actualizaciones, garantía de nuestros productos o servicios en caso de incidentes, inconvenientes, requerimientos o fallas.

											Cumplir con la notificación de información de su interés cuando lo haya solicitado, incluyendo la respuesta a sus PQR y en general peticiones, dudas o cuestionamientos.

											Estudiar y almacenar información asociada a solicitudes de algunos de nuestros productos que como cliente o futuro cliente debemos conocer para la relación comercial.

											Enviar comunicaciones relacionadas con las actividades comerciales, noticias e información útil para Array, sus productos, ofertas, novedades, invitaciones a eventos, ofertas de empleo, propaganda, publicidad y/o encuestas sobre los productos o servicios y/o los productos y servicios de nuestros socios comerciales o Aliados Estratégicos.

											Realizar el tratamiento de los datos de uso de los productos y/o servicios de Array con fines estadísticos, comunicación, mercadeo o análisis relacional de información

											Realizar el tratamiento de los datos para fines de investigación, innovación y desarrollo de nuevos productos y/o servicios.

											Otras actividades relacionadas con el objeto social que necesariamente deben utilizar la información o datos personales del Suscriptor y demás personas relacionadas con alguno(s) de nuestros productos y/o servicios, y/o con nuestra organización.

											Tratar la información  a través de medios físicos, electrónicos, celular o dispositivo móvil, vía mensajes de texto (SMS), o a través de cualquier medio análogo y/o digital de comunicación, conocido o por conocer.

											TRATAMIENTO DE DATOS SENSIBLES: La Compañía almacenara información sensible como orientación política, sin embargo, los datos almacenados se destinarán únicamente para lo siguiente:

											para campañas políticas a que hagan parte los suscriptores de los datos.

											Fines estadísticos, caracterización de grupos de interés y análisis, publicidad política durante la vigencia de las campañas políticas en curso.

											Efectuar las gestiones pertinentes para el desarrollo de las finalidades del objeto del contrato celebrado con los responsables de la información.

											Manifestamos que no recolectamos o almacenamos ninguna otra información sensible que pueda afectar la integridad física o emocional de los otorgantes de los datos. DERECHOS DE LOS TITULARES: Como titular de sus datos personales usted tiene derecho a: (i) Acceder a los datos proporcionados que hayan sido objeto de tratamiento. (ii) Conocer, actualizar y rectificar su información frente a datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo tratamiento esté prohibido o no haya sido autorizado. (iii) Solicitar prueba de la autorización otorgada. (iv) Presentar ante la Superintendencia de Industria y Comercio (SIC) quejas por infracciones a lo dispuesto en la normatividad vigente. (v) Revocar la autorización y/o solicitar la supresión del dato, siempre que no exista un deber legal o contractual que impida eliminarlos. (vi) Abstenerse de responder las preguntas sobre datos sensibles. Tendrá carácter facultativo las respuestas que versen sobre datos sensibles o sobre datos de las niñas y niños y adolescentes.  Para estos casos se deberá acercar con el suscriptor de la información quien es el responsable de los datos. Reiteramos que la empresa ARRAY S.A.S solo actuará como encargado del tratamiento de los datos.  DERECHOS DE LOS NIÑOS, NIÑAS Y ADOLESCENTES. El responsable de la información deberá garantizar que los datos recolectados no estén relacionados con niños , niñas y adolescentes que aún no se encuentren en edad de votar en Colombia, de esta manera se asegurará el respeto a los derechos prevalentes de los niños, niñas y adolescentes, bajo los lineamientos de ley. CONSULTAS Y RECLAMOS El área de soporte es la dependencia que tiene a cargo dar trámite a las solicitudes de los titulares para hacer efectivos sus derechos. En caso de alguna petición, queja, reclamo, sugerencia o felicitación podrán contactarse al siguiente correo electrónico soporte@polimetrika.com o podrán escalarla a través de la página Web polimetrika.com.  PROCEDIMIENTO PARA EL EJERCICIO DEL DERECHO DE HABEAS DATA: En cumplimiento de las normas sobre protección de datos personales, ARRAY S.A.S presenta el procedimiento y requisitos mínimos para el ejercicio de sus derechos: Para la radicación y atención de su solicitud le solicitamos suministrar la siguiente información: Nombre completo y apellidos Datos de contacto (Dirección física y/o electrónica y teléfonos de contacto), Medios para recibir respuesta a su solicitud, Motivo(s)/hecho(s) que dan lugar al reclamo con una breve descripción del derecho que desea ejercer El término máximo previsto por la ley para resolver su reclamación es de quince (15) días hábiles, contado a partir del día siguiente a la fecha de su recibo. Una vez cumplidos los términos señalados por la Ley 1581 de 2012 y las demás normas que la reglamenten o complementen, el Titular al que se deniegue, total o parcialmente, el ejercicio de los derechos de acceso, actualización, rectificación, supresión y revocación, podrá poner su caso en conocimiento de la Superintendencia de Industria y Comercio –Delegatura para la Protección de Datos Personales-. VIGENCIA: La presente Política para el Tratamiento de Datos Personales rige a partir del 2 de mayo de 2023. Las bases de datos en las que se registrarán los datos personales tendrán una vigencia igual al tiempo en que se mantenga y utilice la información para las finalidades descritas en esta política. Una vez se cumpla(n) esa(s) finalidad(es) y siempre que no exista un deber legal o contractual de conservar su información, sus datos serán eliminados de nuestras bases de datos. Otros ejemplos de período de permanencia de los datos en la base, son los siguientes: Los datos personales proporcionados se conservarán mientras se mantenga la relación contractual con el responsable de la información. Los datos personales proporcionados se conservarán mientras no se solicite su supresión por el interesado y siempre que no exista un deber legal de conservarlos.

											AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES

											Manifiesto que me informaron que en caso de almacenamiento de la información sensible que proporciono, tengo derecho a contestar o no las preguntas que me formulen y a entregar o no los datos solicitados. Entiendo que son datos sensibles aquellos que afectan la intimidad del Titular o cuyo uso indebido puede generar discriminación como orientación política, convicciones religiosas o filosóficas etc. Manifiesto que me informaron que los datos sensibles que se almacenarán serán utilizados para las siguientes finalidades: para campañas políticas a que hagan parte los suscriptores de los datos.

											Fines estadísticos, caracterización de grupos de interés, análisis y publicidad política durante la vigencia de las campañas políticas en curso.

											Efectuar las gestiones pertinentes para el desarrollo de las finalidades del objeto del contrato celebrado con los responsables de la información.

											para campañas políticas a que hagan parte los suscriptores de los datos.

											Como responsable de los datos personales y sensibles suministrados tengo la facultad para:

											Acceder en forma gratuita a los datos proporcionados que hayan sido objeto de tratamiento. b) Solicitar la actualización y rectificación de la información frente a datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o a aquellos cuyo tratamiento esté prohibido o no haya sido autorizado. c) Aportar prueba de la autorización otorgada. d) Presentar ante la Superintendencia de Industria y Comercio (SIC) quejas por infracciones a lo dispuesto en la normatividad vigente. e) Revocar la autorización y/o solicitar la supresión del dato, a menos que exista un deber legal o contractual que haga imperativo conservar la información. f) Abstenerse de responder las preguntas sobre datos sensibles o sobre datos de las niñas y niños y adolescentes. Estos derechos los podré ejercer a través de los canales o medios dispuestos por ARRAY S.A.S  quien actuará como encargado del tratamiento de los datos, para la atención al público, atención de requerimientos relacionados con el tratamiendo de los datos personales proporcionados y el ejercicio mencionado en esta autorización, está disponible el correo electrónico soporte@polimetrika.com 

											Por todo lo anterior, he otorgado mi consentimiento a ARRAY S.A.S para que actúe como encargado de los datos por mi proporcionados dispuesta en medio electrónico y que me dió a conocer antes de almacenar mis datos personales. Manifiesto que la presente autorización me fue solicitada y puesta de presente antes de entregar los datos y que la suscribo de forma libre y voluntaria una vez leída en su totalidad. Adicionalmente manifiesto que tengo claro que la empresa ARRAY S.A.S solo opera como encargado del tratamiento de los datos y que yo como suscriptora del software POLIMETRIKA, soy el(la) responsable del tratamiento de los datos personales suministrados.
										</p>
									</div>
								</div>
							</div>
									<div className="timeline-panel">
										<div className="timeline-body">
											<hr/>
											<div className='card-action text-center'>
												{
													(typeof reference !=="undefined" && reference!==null && reference!==""  )?

														<form onSubmit={meCaso} method='POST'>
															<button
																type='submit'
																className={waiting? 'btn is-loading btn-success ml-1' : 'btn btn-success ml-1'}
																disabled={waiting}
															>
																Acepto
															</button>
															<button type='reset' className='btn btn-border btn-light ml-1'>
																Cancelar
															</button>
														</form>
													:
														""
												}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<Foot />
				</div>
			</div>
		</Fragment>
	);
}

export default Agree;
