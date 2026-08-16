/* eslint-disable array-callback-return */
import { Fragment, useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import crypto from "crypto-js"
import swal from 'sweetalert2';

// eslint-disable-next-line
import ReactDOM from 'react-dom';
import $ from 'jquery';
import * as myConst from '../main/constants';
import { Foot } from './components/foot'
import HeadPublic from './parts/headPublic'
import HeadRibbon from './parts/ribbon'
import MiPlan from '../pages/planesDetail'
import tool from '../services/tools'

import messenger from '../services/messenger';
import Waiting from './parts/waiting';
import { UserContext } from '../services/context/UserContext';
import { publicRoutes } from '../services/routes';

export default function Index() {
	const { plan } = useParams();
	let miPlan = '';
	
	const [elPlan, setElPlan] = useState(plan||1);
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(true);
	const [esAceptado, setEsAceptado] = useState(false);

	const [isCreated, setIsCreated] = useState(false);
	const [correoVerificar, setCorreoVerificar] = useState(""); 
	const [isVerified, setIsVerified] = useState(false);
	const [showVerify, setShowVerify] = useState(false);

	const [listaPartidos, setListaPartidos] = useState([])
	const [listaTipocampana, setListaTipocampana] = useState([])
	const [listaPlanes, setListaPlanes] = useState([])
	const [listaDeptos, setListaDeptos] = useState([])
	const [listaMupios, setListaMupios] = useState([])

	const elFade = {form:'elFormulario',response:'laRespuesta'}

	// const errorMessage = {class:"text-success",message:""}
	const [errorMessage, setErrorMessage] = useState({class:"text-success",message:""})
	const [meter, setMeter] = useState('password');

	const { register, formState: { errors } , handleSubmit } = useForm();

    const getListaDeptos = async() => {
        await messenger.poster({
            method: 'POST',
            value: { criterio: 0 },
            url: myConst.roots.engine + myConst.roots.listaDeptos
        }).then((elMensaje) =>{
            setListaDeptos(
				elMensaje.message.map((elDepto) =>{
                    return {value: elDepto.iddepto, text: elDepto.nombre}
				})				
			)
		});
    }

    const verificarClave = (uno,dos) =>{
        if(uno.value !== "" && dos.value !== ""){
            if(uno.value === dos.value){
                setErrorMessage({class:"text-success",message:""})
                uno.classList.remove("is-invalid")
                dos.classList.remove("is-invalid")
            }else{
                setErrorMessage({class:"text-danger",message:"La clave y la repetición no coinciden!"})
                uno.classList.add("is-invalid")
                dos.classList.add("is-invalid")
            }
        }
    }

    const getListaMupios = async(event) => {
		if(event.target.value!==null && event.target.value!==undefined ){
			await messenger.poster({
				method: 'POST',
				value: { criterio: event.target.value },
				url: myConst.roots.engine + myConst.roots.listaMupios
			}).then((elMensaje) =>{
				setListaMupios(
					elMensaje.message.map((elMupio) =>{
						return {value: elMupio.idmupio, text: elMupio.nombre}
					})
				)
			});
		}
    };

	const onRegister = async(data) =>{
		if(data!=="" && isVerified  && esAceptado){
			setWaiting(waiting => true)
			setIsCreated(false)

			data.clave = tool.encriptar(data.clave)
			data.reclave = data.clave

			await messenger.poster({
				method: 'POST',
				value: data,
				url: myConst.roots.engine + myConst.roots.clientNew
			}).then((elMensaje) =>{
				// eslint-disable-next-line
				console.log('El estado: ', isCreated)
				if(parseInt(elMensaje.statusCode) !== 200){
					errorMessage.class = "text-danger"
				}

				if(elMensaje.message !== ""){
					errorMessage.message = elMensaje.message
					setIsCreated(elMensaje.message)
					$("#"+elFade.form).fadeOut('fast')
					$("#"+elFade.response).fadeIn('fast')
				}
			});

			setWaiting(waiting => false)
		}else{
			swal.fire({
				title: '!',
				text: 'Debe llenar todos los datos y aceptar el contrato. Tal vez la frase de verificacion que le enviamos al correo no es correcta',
				icon: 'warning',
				showConfirmButton: true,
				customClass: {
					confirmButton:'btn btn-primary'
				}
			})
		}
	}

    const verClave = () =>{
        (meter === 'text')? setMeter('password') : setMeter('text');
    }

	const verificarEmail = async (elmail) =>{
		// eslint-disable-next-line
		console.log('el mail validado: ', tool.validEmail(elmail))
		if(!isVerified && elmail!=="" && elmail!==null && tool.validEmail(elmail)){
			setWaiting(waiting => true)

			await messenger.poster({
				method: 'POST',
				value: {'email':elmail},
				url: myConst.roots.engine + myConst.roots.checkemail
			})
			.then((elMensaje) =>{
				// eslint-disable-next-line
				console.log('la frase enviada: ', elMensaje.message)

				if(parseInt(elMensaje.statusCode) === 200){
					setCorreoVerificar(lacosa => elMensaje.token)
					setShowVerify(show => true)
				}
			});

			setWaiting(waiting => false)
		}
	}

	const verificarFrase = (frase) => {
		const fraseConvertida = crypto.MD5(frase).toString()
		// eslint-disable-next-line
		console.log('las frases: ', fraseConvertida, correoVerificar)
		setIsVerified((fraseConvertida===correoVerificar))
	}

	const cambiodePlan = (eldato) =>{
		const miNuevoPlan = parseInt(tool.decriptar(eldato))-1
		setElPlan(elPlanese => miNuevoPlan)
	}

	useEffect(() => {
		setIsFetching(true)
		miPlan = (plan!=="")? (tool.encriptar(parseInt(plan)+1)) : '';
		
		fetch(myConst.roots.engine + myConst.roots.listaPlanes+ '?criterio=0')
		.then((response) => response.json())
		.then((elMensaje) => {
			setListaPlanes(				
				elMensaje.message.map((elplan) =>{
					return <option key={elplan.id} value={elplan.id}>{elplan.descripcion}</option>
				})				
			)
		});

		fetch(myConst.roots.engine + myConst.roots.tipoCampana+ '?criterio=0')
		.then((response) => response.json())
		.then((elMensaje) => {
			setListaTipocampana(
				elMensaje.message.map((eltipo) =>{
					return <option key={eltipo.id} value={eltipo.id}>{eltipo.descripcion}</option>
				})
			)
		});

		fetch(myConst.roots.engine + myConst.roots.listaPartidos+ '?criterio=0')
		.then((response) => response.json())
		.then((elMensaje) => {
			setListaPartidos(
				elMensaje.message.map((elpartido) =>{
					return <option key={elpartido.id} value={elpartido.id}>{elpartido.descripcion}</option>
				})				
			)
		});
		getListaDeptos()

		setIsFetching(false)
	}, []);


	if(isFetching){
		return (
			<Fragment>
				<Waiting />
			</Fragment>
		);
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
								<div className='col-md-4'>
									<MiPlan miplan={elPlan}/>
								</div>
								<div className='col-md-8'>
									<div className='card'>
										<div className='card-header'>
											<div className='card-title text-center text-secondary'>
												Crear mi cuenta
											</div>
										</div>
										<div className='card-body'>
											<div className={(!isCreated)? "text-center" : "text-center fadeOut"}>
												<form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
													<div className="form-group  text-left has-feedback">
														<label htmlFor='correo'>Correo oficial de la campaña:</label>
														<input type="text" className="form-control" placeholder='micandidato@gmail.com'
														{...register('correo', {
															required:true,
															onBlur:(e) => {verificarEmail(e.target.value)},
															pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ //eslint-disable-line
														})} />
														{ errors.correo?.type === 'required' && <small className="form-text text-danger">Debe escribir un correo de verdad</small> }
														{ errors.correo?.type === 'pattern' && <small className="form-text text-danger">El correo está mal escrito</small> }
													</div>

													{
														(showVerify)?
															<div className="form-group  text-left has-feedback">
																<label htmlFor='nombre'>Frase de verificación:</label>
																<input type="correoverificar" className="form-control" placeholder='escriba la frase aqui'
																{...register('correoverificar', {
																	required:true,
																	onBlur:(e) => {verificarFrase(e.target.value)}
																})} />
																{ errors.correoverificar?.type === 'required' && <small className="form-text text-danger">Entre al correo, le enviamos una frase de verificación, escribala en este campo</small> }
																{ (isVerified)? <small className="form-text text-success">El correo ha sido verificado, continue con el registro</small> : <small className="form-text text-danger">Entre al correo, le enviamos una frase de verificación, escribala en este campo y de clic aqui</small> }
															</div>
														:
															""														
													}

													<div className="form-group  text-left has-feedback">
														<label htmlFor='celular'>Teléfono oficial de la campaña (Con Whatsapp):</label>
														<input type="text" className="form-control" placeholder='3117696973'
														{...register('celular', {
															required:true,
															minLength: 10,
															pattern: /^\d+$/ //eslint-disable-line
														})} />
														{ errors.celular?.type === 'required' && <small className="form-text text-danger">Escriba un celular con acceso a Whatsapp por favor</small> }
														{ errors.celular?.type === 'pattern' && <small className="form-text text-danger">Sólo números, ejemplo: 3117696973</small> }
													</div>
													
													<div className="form-group form-floating-label text-left has-feedback">
														<select className="form-control input-border-bottom" {...register('selanzaal', {
															required:true
														})}>
															<option value="">&nbsp;</option>
															{ listaTipocampana }
														</select>
														<label htmlFor="selanzaal" className="placeholder">Tipo de campaña o escaño</label>
														{ errors.selanzaal?.type === 'required' && <small className="form-text text-danger">¿A qué se lanza?</small> }
													</div>

													<div className="form-group form-floating-label text-left has-feedback">
														<select defaultValue={miPlan}
															className="form-control input-border-bottom" 
															{...register('miplan', {
																required:true,
																onChange: (e) => {cambiodePlan(e.target.value)},
															})}>
																<option key="nada" value="">&nbsp;</option>
																{ listaPlanes }
														</select>
														<label htmlFor="miplan" className="placeholder">Plan a elegir</label>
														{ errors.miplan?.type === 'required' && <small className="form-text text-danger">Elija un plan para el servicio</small> }
													</div>

													<div className="form-group  text-left has-feedback">
														<label htmlFor='nombre'>Nombre de la campaña:</label>
														<input type="text" className="form-control" placeholder='Diogenes de Jesus Gobernador'
														{...register('campana', {
															required:true,
															minLength: 8
														})} />
														{ errors.campana?.type === 'required' && <small className="form-text text-danger">¿Cómo se llama la campaña?</small> }
														{ errors.campana?.type === 'minLength' && <small className="form-text text-danger">El nombre está corto</small> }													
													</div>
													
													<div className="form-group  text-left has-feedback">
														<label htmlFor='nombre'>Lema o slogan de la campaña:</label>
														<input type="text" className="form-control" placeholder='El cambio que necesita nuestra región'
														{...register('lema', {
															required:true,
															minLength: 8
														})} />
														{ errors.lema?.type === 'required' && <small className="form-text text-danger">Campaña que se respete tiene un lema, ¿Cuál es el suyo?</small> }
														{ errors.lema?.type === 'minLength' && <small className="form-text text-danger">¡El lema está corto, le hace falta calle, por favor inspírese!</small> }
													</div>

													<div className="form-group  text-left has-feedback">
														<label htmlFor='tarjeton'>Identificación de la campaña:</label>
														<input type="text" className="form-control" placeholder='111.222.333-4'
														{...register('identificacion', {
															required:true
														})} />
														{ errors.identificacion?.type === 'required' && <small className="form-text text-danger">¿Cuál es el NIT o la identificacion de la campaña?</small> }
													</div>

													<div className="form-group  text-left has-feedback">
														<label htmlFor='tarjeton'>Tarjetón:</label>
														<input type="text" className="form-control" placeholder='PU 07'
														{...register('tarjeton', {
															required:true
														})} />
														{ errors.tarjeton?.type === 'required' && <small className="form-text text-danger">¿Cuál es la opción de votación?</small> }
													</div>
													
													<div className="form-group  form-floating-label text-left  has-feedback">
														<select className="form-control input-border-bottom"  {...register('elpartido', {
															required:true
														})}>
															<option key="0" value="">&nbsp;</option>
															{ listaPartidos }
														</select>
														<label htmlFor="elpartido" className="placeholder">Partido politico...</label>
														{ errors.elpartido?.type === 'required' && <small className="form-text text-danger">¿A qué partido pertenece la campaña?</small> }
													</div>

													<div className="form-group  form-floating-label text-left  has-feedback">

														<select className="form-control input-border-bottom"  
														{...register("eldepto", {
															onChange: (e) => {getListaMupios(e)},
															required:true,
														})}>
															<option key="" value="">Seleccione un departamento</option>
															{ listaDeptos.map(opcion => (
																<option key={opcion.value} value={opcion.value} >{opcion.text}</option>
															)) }
														</select>

														<label htmlFor="eldepto" className="placeholder">Departamento sede de la campaña...</label>
														{ errors.eldepto?.type === 'required' && <small className="form-text text-danger">¿Cuál es el departamento de la campaña?</small> }
													</div>

													<div className="form-group  form-floating-label text-left  has-feedback">

														<select className="form-control input-border-bottom" 
														{...register("mupio", {
															required:true
														})}>
															<option key="" value="">Seleccione un municipio o localidad</option>
															{ listaMupios.map(opcion => (
																<option key={opcion.value} value={opcion.value} >{opcion.text}</option>
															)) }
														</select>

														<label htmlFor="mupio" className="placeholder">Municipio de la campaña?...</label>
														{ errors.mupio?.type === 'required' && <small className="form-text text-danger">¿Cuál es el municipio o localidad  de la campaña??</small> }
													</div>

                                                    <div className="form-group  text-left has-feedback">                                                        
                                                        <label htmlFor='clave'>Clave para esta cuenta:</label>
                                                        <input type={meter} className="form-control" 
                                                        id="clave" name="clave" placeholder='Miclave-23'
                                                        {...register("clave", {
                                                            required: true, // depends on editing user to not password required
                                                            minLength: 6,
                                                            maxLength: 64,
                                                            onChange: () => verificarClave(document.getElementById('clave'), document.getElementById('reclave')),
                                                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/ //eslint-disable-line
                                                        })} />
                                                        { errors.clave?.type === 'required' && <small className="form-text text-danger">La clave es obligatoria</small> }
                                                        { errors.clave?.type === 'minLength' && <small className="form-text text-danger">La clave es muy corta</small> }
                                                        { errors.clave?.type === 'maxLength' && <small className="form-text text-danger">La clave es muy larga</small> }
                                                        { errors.clave?.type === 'pattern' && <small className="form-text text-danger">Al menos 1 mayuscula, 1 minuscula, 1 digito, 1 simbolo (:.-_@!) </small> }
                                                    </div>
                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor='reclave'>Repetir clave:</label>
                                                        <input type={meter} className="form-control" 
                                                        id="reclave" name="reclave" placeholder='Miclave-23'
                                                        {...register("reclave", {
                                                            required: true, // depends on editing user to not password required
                                                            minLength: 6,
                                                            maxLength: 64,
                                                            onChange: () => verificarClave(document.getElementById('clave'), document.getElementById('reclave')),
                                                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/ //eslint-disable-line
                                                        })} />
                                                        <label htmlFor='visible'><input type="checkbox" name='visible' id="visible" onClick={verClave} /> Ver la clave</label><br/>
                                                        <small className={"form-text "+errorMessage.class}>{ errorMessage.message }</small>
                                                    </div>

													<div className="form-group text-left ">
														<label htmlFor='cupon'>Codigo de referencia:</label>
														<input type="text" className="form-control" placeholder="Si tiene un codigo de referencia, escríbalo aquí" 
														{...register('cupon')}
														/>
													</div>

													<div className="form-check text-left ">
														<label htmlFor='contrato' 
															onClick={() => {setEsAceptado(!esAceptado)}}
															className="form-check-label"
														>
															<input className="form-check-input mb-5" 
															checked={esAceptado}
															type="checkbox" 
															value="siacepto" 
																{...register('contrato', {
																	required: true
																})}
															/>
															<span className="form-check-sign">																
																<Link to={publicRoutes.AGREECAMPANA} target="_blank">
																	He leido y acepto el contrato y los terminos y condiciones del servicio
																</Link>
															</span>
														</label>
														{ errors.siacepto?.type === 'required' && <small className="form-text text-danger">Lea el contrato y aceptelo</small> }
													</div>

													<div className='card-action text-center'>
														<button
															type='submit'
															className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
															disabled={errorMessage.message||waiting}
														>
															Crear cuenta
														</button>
													</div>
												</form>
											</div>
											<div id={elFade.response} className={(!isCreated)? "text-center" : "text-center fadeIn"}>																									
												{ 
													(isCreated!==false) ?
														<div style={{fontSize:'18pt'}} className={'form-group text-center '+errorMessage.class}>
															<img src='https://drive.google.com/thumbnail?id=1XY-anAR-FuWSQnyLomm1L_lDn_1uiHsH' />
															<h3>polimetrika.com</h3>
															{ isCreated }
														</div>
													:
														''
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
