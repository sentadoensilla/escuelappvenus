import { useState, Fragment } from 'react';
import * as myConst from '../main/constants';
import messenger from "../services/messenger";
// import { publicRoutes } from '../services/routes';
import HeadPublic from './parts/headPublic'
import HeadRibbon from './parts/ribbon'
import { Foot } from './components/foot'
import Desc from './description'

// import UserContext, { UserContextProvider } from '../services/context/contextUser';
// import auth from '../services/login'

export default function ResetPassword() {
    // eslint-disable-next-line
	const [waiting, setWaiting] = useState(false);
	const [usuario, setUsuario] = useState('');
	const [errorMessage, setErrorMessage] = useState('')
	const [semaforo, setSemaforo] = useState('error')
	let preerror = false

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

	const validateData = (usuario) => {
		if (validEmail(usuario) === null){
			setErrorMessage(miError => 'Escribe tu correo, te enviaremos un enlace para que puedas recuperar tu clave');
		}else{
			setErrorMessage(miError => '');
		}
	};	

	const ingresar = async(usuario) => {
		preerror = validateData(usuario)
		// IF USER NOT SET, REQUEST SERVER
		if(preerror!==''){
			setWaiting(waiting => true)
			await messenger.poster({
				method: 'POST',
				value: { u: usuario},
				url: myConst.roots.engine + myConst.roots.rememberpass
			})
			.then(data => {
				setWaiting(waiting => false)
				setErrorMessage(miError => data.message)
				setSemaforo(color => data.status)
			})
			.catch(error => {
				// eslint-disable-next-line
				console.log(error.toString())
			})
		}else{
			setErrorMessage(miError => preerror);
		}
		
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		ingresar(usuario);
	};

	return (
		<Fragment>
			<div id='elgrapper' className='wrapper overlay-sidebar'>
				<HeadPublic  waiting={waiting} setWaiting={setWaiting} />

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
											Recordar clave
										</div>
									</div>
									<div className='card-body'>
										<form onSubmit={handleSubmit} method='POST'>
											<div className="form-group {(errorMessage!='')? 'has-error' : ''; } text-left">
												<label htmlFor='miusuario'>Email:</label>
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

											<div className='card-action text-center'>
												<button
													type='submit'
													className={waiting? 'btn is-loading btn-success ml-1' : 'btn btn-success ml-1'}
													disabled={waiting}
												>
													Recordar
												</button>
												<button type='reset' className='btn btn-border btn-light ml-1'>
													Cancelar
												</button>
											</div>
											<div className={'form-group text-center text-'+semaforo}>
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
