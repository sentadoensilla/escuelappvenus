import { Fragment, useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import swal from 'sweetalert2';

import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';

import { UserContext } from '../../services/context/UserContext';
import { publicRoutes } from '../../services/routes';

import Waiting from '../parts/waiting';
import HeadPublic from '../parts/headPublic'
import HeadRibbon from '../parts/ribbon'
import { Foot } from '../components/foot'
import Desc from '../description'

export default function changePassPendejo(){
	const argumentos = useParams()
    const navegar = useNavigate();

	const reference = argumentos.reference
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
	// eslint-disable-next-line
	const [semaforo, setSemaforo] = useState('error')
	const [elFormu, setElFormu] = useState(false);

    // eslint-disable-next-line
	let [listado, setListado] = useState([]);
    const [meter, setMeter] = useState('password');

    // DEFAULT VALUES FORM
    let  [defaultValues, setDefaultValues] = useState({
        clave: '',
        reclave: '',
    });

	const { register, reset, formState: { errors } , handleSubmit } = useForm({});


	const elFade = {form:'elFormulario',response:'laRespuesta'}

	const [errorMessage, setErrorMessage] = useState({class:"text-success",message:""})

    const setDefaults = () => {
        defaultValues = {
            clave: '',
            reclave: '',
        }

        setDefaultValues(defaultValues)
    }

	const onRegister = async(data) => {
        const clave1 = document.getElementById('clave')
        const clave2 = document.getElementById('reclave')

        verificarClave(clave1,clave2)

        if(clave1.value === clave2.value){

            if(data!==""){
                setWaiting(waiting => true)

                data.reference=reference
                
                await messenger.poster({
                    method: 'POST',
                    value: data,
                    url: myConst.roots.engine + myConst.roots.rememberresetpass
                }).then((resultado) =>{
                    swal.fire({
                        title: resultado.status,
                        text: resultado.message,
                        icon: resultado.status,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonText:'Listo',
                        customClass: {
                            confirmButton:'btn btn-success',
                        }
                    })
                    .then(answer =>{
                        setWaiting(waiting => false)
                        if(answer.isConfirmed){
                            navegar(publicRoutes.LOGIN)
                        }
                    })
                    .catch(error =>{
                        setWaiting(waiting => false)
						// eslint-disable-next-line
                        console.log('Hubo un error: ', error.toString())
                    })
                });                
            }
        }
	}

    const verClave = () =>{
        (meter === 'text')? setMeter('password') : setMeter('text');
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

	const consultar = async() => {
		// IF USER NOT SET, REQUEST SERVER
		if(reference!==''){
			setWaiting(waiting => true)
			await messenger.poster({
				method: 'POST',
				value: { reference },
				url: myConst.roots.engine + myConst.roots.rememberpasscheck
			})
			.then(data => {
				if(
					data.message.rows.tiempovencido === true ||
					data.message.rows.registrousuado === true ||
					data.message.rows.linkusado === true				
				){
					setElFormu(viejo => false)
				}else{
					setElFormu(viejo => true)
				}

				setWaiting(waiting => false)
				setErrorMessage(miError => data.message.message)
				setSemaforo(color => data.status)
			})
			.catch(error => {
				// eslint-disable-next-line
				console.log(error.toString())
			})
		}else{
			setErrorMessage(miError => 'Enlace roto');
		}		
	};	

    useEffect(() => {
        // eslint-disable-next-line
        setWaiting(waiting => true)

		consultar()

        setIsFetching(isFetching => true)

        setDefaults();

        reset({...defaultValues});

		setIsFetching(isFetching => false)
        setWaiting(waiting => false)
  
    }, []);


	if(isFetching){
		return (
			<Fragment>
				<Waiting />
			</Fragment>
		);
	}else{
        return (
            <Fragment>
                <div id='elgrapper' className='wrapper overlay-sidebar'>
				<HeadPublic  waiting={waiting} setWaiting={setWaiting} />

				<div className="main-panel">
                    <div className="content">
						<HeadRibbon />

                        <div className="page-inner">
                            <div className="page-header">

                            </div>
                                <div className="row">
									<div className='col-md-8'>
										<Desc showButtons="false" />
									</div>

                                    <div className="col-md-4">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center">
                                                    <h2 className="text-center">
                                                        Cambiar clave 
                                                    </h2>
                                                </div>
                                            </div>
                                            <div className="card-body">
												{
													(elFormu)?
														<form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
															<div className="form-group  text-left has-feedback">                                                        
																<label htmlFor='clave'>Clave Nueva:</label>
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
																<label htmlFor='reclave'>Repetir clave nueva:</label>
																<input type={meter} className="form-control" 
																id="reclave" name="reclave" placeholder='Miclave-23'
																{...register("reclave", {
																	required:true, // depends on editing user to not password required
																	minLength: 6,
																	maxLength: 64,
																	onChange: () => verificarClave(document.getElementById('clave'), document.getElementById('reclave')),
																	pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/ //eslint-disable-line
																})} />
																<label htmlFor='visible'><input type="checkbox" name='visible' id="visible" onClick={verClave} /> Ver la clave</label><br/>
																<small className={"form-text "+errorMessage.class}>{ errorMessage.message }</small>
															</div>

															<div className='card-action text-center'>
																<button
																	type='submit'
																	className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
																	disabled={waiting}
																>
																	Cambiar
																</button>
															</div>
														</form>
													:
														<div className="row">
															<div className="col-5 text-center">
																<div className="icon-big text-center">
																	<i className="text-danger fas fa-ban fa-10x"></i>
																</div>
															</div>
															<div className="col-7 col-stats">
																<div className="numbers">										
																	<h2 className="text-center">Cambio de clave no disponible</h2>
																	<p className="card-subtitle text-center">
																		El cambio de clave que quieres utilizar ya no está disponible 
																		bien sea porque fué utilizado o porque venció el tiempo en el 
																		que debiste utilizarlo. <br/>
																		<Link
																			to={publicRoutes.RESET_PASSWORD}
																			className='btn btn-success btn-round mr-2'
																		>
																			<span className="btn-label">
																				<i className="fas fa-grin-beam-sweat"></i>
																			</span>
																			Solicitar cambio, otra vez!
																		</Link>
																	</p>
																</div>
															</div>
														</div>
												}
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
}