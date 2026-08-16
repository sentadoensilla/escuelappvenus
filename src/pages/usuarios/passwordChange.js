import { Fragment, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import swal from 'sweetalert2';

import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'

import { UserContext } from '../../services/context/UserContext';
import { Forbidden } from '../forbidden'
import Waiting from '../parts/waiting';
import UserHead from '../components/head';
import { Foot } from '../components/foot'

export default function Addlider(){

    const miUsuario =  tool.getUser()
	if(!miUsuario.isLogged){
		return (
			<Fragment>
				<Forbidden />
			</Fragment>
		);
	}

    const navegar = useNavigate();
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
    // eslint-disable-next-line
	let [listado, setListado] = useState([]);
    const [meter, setMeter] = useState('password');

    // DEFAULT VALUES FORM
    let  [defaultValues, setDefaultValues] = useState({
        clavenow: listado[0]?.clavenow||'',
        clave: listado[0]?.clave||'',
        reclave: listado[0]?.reclave||'',
    });

	const { register, reset, formState: { errors } , handleSubmit } = useForm({});


	const elFade = {form:'elFormulario',response:'laRespuesta'}

	const [errorMessage, setErrorMessage] = useState({class:"text-success",message:""})

    const setDefaults = () => {
        defaultValues = {
            clavenow: listado[0]?.clavenow||'',
            clave: listado[0]?.clave||'',
            reclave: listado[0]?.reclave||'',
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

                data.usuario=miUsuario.usuarioId
                data.campana=miUsuario.usuarioCampanaId[0]
                
                await messenger.poster({
                    method: 'POST',
                    value: data,
                    url: myConst.roots.engine + myConst.roots.resetpass
                }).then((resultado) =>{
                    swal.fire({
                        title: resultado.status,
                        text: resultado.message,
                        icon: resultado.status,
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText:'Listo',
                        customClass: {
                            confirmButton:'btn btn-success',
                        }
                    })
                    .then(answer =>{
                        setWaiting(waiting => false)
                        if(answer.isConfirmed){
                            navegar(miUsuario.usuarioIndex)
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
    
    useEffect(() => {
        // eslint-disable-next-line
        setWaiting(waiting => true)

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
                <div id='elgrapper' className="wrapper">
				<UserHead />

				<div className="main-panel">
                    <div className="content">
                        <div className="page-inner">
                            <div className="page-header">

                            </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center">
                                                    <h4 className="card-title">
                                                        <img src={myConst.essentials.logohorizontal} alt="navbar brand" className="navbar-brand" />
                                                        Cambiar clave 
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">

                                                    <div className="form-group  text-left has-feedback">                                                        
                                                        <label htmlFor='clavenow'>Clave actual:</label>
                                                        <input type={meter} className="form-control" 
                                                        id="clavenow" name="clavenow" placeholder='Miclave-23'
                                                        {...register("clavenow", {
                                                            required: true, // depends on editing user to not password required
                                                            minLength: 6,
                                                            maxLength: 64,
                                                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/ //eslint-disable-line
                                                        })} />
                                                        { errors.clavenow?.type === 'required' && <small className="form-text text-danger">Escriba la clave actual</small> }
                                                        { errors.clavenow?.type === 'minLength' && <small className="form-text text-danger">La clave actual es muy corta</small> }
                                                        { errors.clavenow?.type === 'maxLength' && <small className="form-text text-danger">La clave actual es muy larga</small> }
                                                        { errors.clavenow?.type === 'pattern' && <small className="form-text text-danger">Al menos 1 mayuscula, 1 minuscula, 1 digito, 1 simbolo (:.-_@!) </small> }
                                                    </div>

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
                                                            disabled={errorMessage.message||waiting}
                                                        >
                                                            Guardar
                                                        </button>
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
}