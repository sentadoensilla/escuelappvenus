import { Fragment, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert2'


import * as myConst from '../main/constants';
import {UserContext} from '../services/context/UserContext';
// import { publicRoutes } from '../services/routes';
import { Foot } from './components/foot'
import HeadRibbon from './parts/ribbon'
import HeadPublic from './parts/headPublic'
import messenger from "../services/messenger";
import tool from '../services/tools';
import Desc from './description'


export default function Login() {
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario, setElUsuario } = useContext(UserContext);

	let [esteUsuario, setEsteUsuario] = useState(elUsuario);
	const [usuario, setUsuario] = useState('');
	const [clave, setClave] = useState('');
	const [esAceptado, setEsAceptado] = useState(false);

	const navegar = useNavigate();

	let preEsteUsuario = elUsuario // tool.getUser()

	let data = null
	/**
	 * validEmail RETURN RANDOM STRING AS LONG AS LENGHT
	 * @param {*} length (INTEGER)
	 * @returns 'aS.u$F'
	 */
	const validEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const validateData = (usuario, clave) => {
		if (validEmail(usuario) == null){
			return 'Escribe tu usuario '
		}
		if (clave.length < 5) {
			return 'Escribe la clave';
		}
	};

	const errorMessage = validateData(usuario, clave);

	const ingresar = async(usuario, clave) => {
		if (!errorMessage) {

			setWaiting(waiting => !waiting)
			// FISRT VERIFY USER TO GET NULL OR USER PROPERTIES
			data = tool.verifyUser(usuario)

			// IF USER NOT SET, REQUEST SERVER
			if(data===null){

				await messenger.poster({
					method: 'POST',
					value: { username: usuario, password: clave },
					url: myConst.roots.engine + myConst.roots.login
				}).then((elMensaje) =>{
					if(parseInt(elMensaje.statusCode) !== 200){
						swal.fire({
							title: '!',
							text: elMensaje.message,
							icon: elMensaje.status,
							showConfirmButton: true,
							confirmButtonText : 'Listo!',
							showCancelButton: false,
							customClass: {
								confirmButton:'btn btn-primary'
							},
						})				
					
					}else{
						data = elMensaje

						if(data.message !== ""){
							// data.message.token = data.rows[0].datos_usuario.token
							// SETTING LOCALSTORAGE
							tool.setUser(data.rows[0].datos_usuario)
							esteUsuario = tool.getUser()
							setEsteUsuario(esteUsuario)
							setElUsuario(esteUsuario)

							if(esteUsuario.token !== null){
								navegar(data.rows[0].usuarioIndex, { replace: true })
							}
						}
					}
				})

			}
			setWaiting(waiting => !waiting)
			preEsteUsuario = tool.getUser()
			setEsteUsuario(preEsteUsuario)
			// eslint-disable-next-line
			// console.log('Antes de navegar adentro: ', esteUsuario)
			
			// let menu = null
			if(tool.verifyUser(esteUsuario.usuarioNick) != null){
				// menu = tool.getNav(esteUsuario)
				navegar(esteUsuario.usuarioIndex, { replace: true })
			}
			// console.log('Validando: ', validity )
			// console.log('menu: ', menu)		
				
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		ingresar(usuario, clave);
	};

	return (
		<Fragment>
			<div id='elgrapper' className='wrapper overlay-sidebar'>
				<HeadPublic />

				<div className='main-panel'>
					<div className='content'>

						<HeadRibbon />
						<div className='page-inner mt--5'>
							<div className='row'>
								<div className='col-md-8'>
									<Desc showButtons="false" />
								</div>
								<div className='col-md-4'>
									<div className='card'>
										<div className='card-header'>
											<div className='card-title text-center text-secondary'>
												Ingresar
											</div>
										</div>
										<div className='card-body'>
											<form onSubmit={handleSubmit} method='POST'>
												<div className="form-group {(errorMessage!='')? 'has-error' : ''; } text-left">
													<label htmlFor='miusuario'>Usuario o Email:</label>
													<input
														type='text'
														autoFocus
														className='form-control form-control'
														name='usuario'
														id='usuario'
														placeholder='miemail@xxxxx.com'
														onChange={(e) => setUsuario(e.target.value)}
														value={usuario}
														autoComplete='off'
													/>
												</div>
												<div className="form-group {(errorMessage!='')? 'has-error' : ''; } text-left">
													<label htmlFor='clave'>Clave:</label>
													<input
														type={ (esAceptado)? 'text': 'password' }
														className='form-control form-control'
														name='clave'
														id='clave'
														onChange={(e) => setClave(e.target.value)}
														value={clave}
														autoComplete='off'
														placeholder='*********'
													/>
												</div>
												<div className="form-check text-left ">
													<label htmlFor='verclave' 
														onClick={() => {setEsAceptado(!esAceptado)}}
														className="form-check-label"
													>
														<input className="form-check-input mb-5" 
														checked={esAceptado}
														type="checkbox" 
														value="verclave"
														onChange={e => {}}
														/>
														<span className="form-check-sign">
															Ver clave
														</span>
													</label>
												</div>

												<div className='card-action text-center'>
													<button
														type='submit'
														className={waiting? 'btn is-loading btn-success ml-1' : 'btn btn-success ml-1'}
														disabled={errorMessage||waiting}
													>
														Ingresar
													</button>
													<button type='reset' className='btn btn-border btn-light ml-1'>
														Cancelar
													</button>
												</div>
												<div className='form-group text-center text-danger'>
													{errorMessage}
												</div>
											</form>
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
