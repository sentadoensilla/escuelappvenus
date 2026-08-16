import { Fragment, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import swal from 'sweetalert2';

import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'

import { UserContext } from '../../services/context/UserContext';

import Waiting from '../parts/waiting';
import { privateRoutes } from '../../services/routes';

import UserHead from '../components/head'
import { Forbidden } from '../forbidden'
import { Foot } from '../components/foot'

export default function AddMenu(){
    const miUsuario =  tool.getUser()

    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.menuNew
    let titulo = myConst.labels.menuAdd[0][0]
    
    const id = (params.state)? params.state.id : null;
    
    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.menuUpdate
        titulo = myConst.labels.menuAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
    // eslint-disable-next-line
	let [listado, setListado] = useState([]);


     // DEFAULT VALUES FORM
    let  [defaultValues, setDefaultValues] = useState({
        idregistro: id||0,
        nombre: listado[0]?.nombre||'',
        descripcion: listado[0]?.descripcion||'',
        icono: listado[0]?.icono||0,
        idestado: listado[0]?.idestado||0,
        orden: listado[0]?.orden||''
    });

    const setDefaults = () => {
        defaultValues = {
            idregistro: id||0,
            nombre: listado[0]?.nombre||'',
            descripcion: listado[0]?.descripcion||'',
            icono: listado[0]?.icono||0,
            idestado: listado[0]?.idestado||0,
            orden: listado[0]?.orden||''
        }

        setDefaultValues(defaultValues)
    }
    
    // eslint-disable-next-line
	const [listaEstados, setListaEstados] = useState([])
    const [elEstados, setElEstados] = useState(defaultValues.estado||1)

	const { control, register, reset, formState: { errors } , handleSubmit } = useForm({});


	const elFade = {form:'elFormulario',response:'laRespuesta'}

	const errorMessage = {class:"text-success",message:""}

	const onRegister = async(data) => {

		if(data!==""){
			setWaiting(waiting => true)
            
            await messenger.poster({
                method: 'POST',
                value: data,
                url: uRl
            }).then((resultado) =>{
                
                swal.fire({
                    title: resultado.status,
                    text: resultado.message,
                    icon: resultado.status,
                    showConfirmButton: true,
                    customClass: {
                        confirmButton:'btn btn-primary'
                    }
                }).then(answer =>{
                    if(answer.isConfirmed){
                        navegar(privateRoutes.MENU_LIST, { replace: true })
                    }
                })
                
            });

			setWaiting(waiting => false)
		}
	}

    // FOR CHANGE ESTADOS
    const changeEstados = async(event) => {
        if(event.target.value!==null && event.target.value!==undefined ){
            setElEstados(event.target.value)
        }
    }

    const recoverRecord = () => {
        const partialListado = [tool.getRecord()]
        listado = partialListado 
        setDefaults()
    };

    useEffect(() => {
        recoverRecord()
        setIsFetching(fetching => true)
        setWaiting(waiting => true)
        let selected = ''

		fetch(myConst.roots.engine + myConst.roots.listaEstados+ '?criterio=0')
		.then((response) => response.json())
		.then((elMensaje) => {
			setListaEstados(
				elMensaje.message.map((elestado) =>{
                    selected =(listado[0]?.idestado === elestado.id)? ' selected ' : '' ;
                    return <option key={elestado.id} value={elestado.id} selected={selected}>{elestado.descripcion}</option>
				})				
			)
		});        

        setWaiting(waiting => false)



        setDefaults();


        
        reset({...defaultValues});

		setIsFetching(false)

    }, []);


	if(!miUsuario.isLogged){
		return (
			<Fragment>
				<Forbidden />
			</Fragment>
		);
	}

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

                                <div className="page-inner mt--2">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="d-flex align-items-center">
                                                        <h4 className="card-title">{titulo}</h4>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                        { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }
                                                        <div className="form-group  text-left has-feedback">
                                                            <label htmlFor='nombre'>Nombre:</label>
                                                            <input type="text" className="form-control" placeholder='Usuarios'
                                                            {...register("nombre", {
                                                                required:true,
                                                                minLength: 8
                                                            })} />
                                                            { errors.nombre?.type === 'required' && <small className="form-text text-danger">¿Cómo se llama el menú?</small> }
                                                            { errors.nombre?.type === 'minLength' && <small className="form-text text-danger">El menú está corto</small> }													
                                                        </div>

                                                        <div className="form-group  text-left has-feedback">
                                                            <label htmlFor='descripcion'>Descripción:</label>
                                                            <input type="text" className="form-control" placeholder='En este menu estan todas las opciones para gestionar los usuarios'
                                                            {...register("descripcion", {
                                                                required:true,
                                                                minLength: 8
                                                            })} />
                                                            { errors.descripcion?.type === 'required' && <small className="form-text text-danger">¿Cual es la descripción del menú?</small> }
                                                            { errors.descripcion?.type === 'minLength' && <small className="form-text text-danger">La descripción está corto</small> }													
                                                        </div>

                                                        <div className="form-group  text-left has-feedback">
                                                            <label htmlFor='icono'>Icono:</label>
                                                            <input type="text" className="form-control" placeholder='fas fa-user'
                                                            {...register("icono", {
                                                                required:true,
                                                                minLength: 4
                                                            })} />
                                                            { errors.icono?.type === 'required' && <small className="form-text text-danger">¿Que icono de bootstrap quieres que aparezca en el menú?</small> }
                                                            { errors.icono?.type === 'minLength' && <small className="form-text text-danger">El icono está corto</small> }													
                                                        </div>

                                                        <div className="form-group  text-left has-feedback">
                                                            <label htmlFor='orden'>Orden:</label>
                                                            <input 
                                                                type="text" className="form-control" placeholder='4'
                                                                {...register("orden", {
                                                                    required:true,
                                                                    pattern: /^\d+$/ //eslint-disable-line
                                                                })} 
                                                            
                                                            />
                                                            { errors.orden?.type === 'required' && <small className="form-text text-danger">¿En qué orden debe estar este menú?</small> }
                                                            { errors.orden?.type === 'pattern' && <small className="form-text text-danger">Sólo números, ejemplo: 4</small> }
                                                        </div>

                                                        <div className="form-group form-floating-label text-left has-feedback">
                                                            <Controller
                                                                name="idestado"
                                                                control={control}
                                                                defaultValue={elEstados}
                                                                render={({ onChange, value, ref }) => (
                                                                        <select value={elEstados} className="form-control input-border-bottom" 
                                                                        {...register("idestado", {
                                                                            onChange: (e) => {changeEstados(e)},
                                                                            required:true
                                                                        })}>
                                                                            <option key="" value="">Seleccione un estado</option>
                                                                            { listaEstados }
                                                                        </select>
                                                                    )}
                                                                    rules={{ required: true }}
                                                                />
                                                                <label htmlFor="estado" className="placeholder">Estado del menú</label>
                                                                { errors.estado?.type === 'required' && <small className="form-text text-danger">¿Activo, eliminado, zombie...?</small> }
                                                        </div>

                                                        <div className='card-action text-center'>
                                                            <button
                                                                type='submit'
                                                                className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
                                                                disabled={errorMessage.message||waiting}
                                                            >
                                                                Registrar
                                                            </button>
                                                        </div>
                                                    </form>
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
}