import { Fragment, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import swal from 'sweetalert2';

import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'

import { UserContext } from '../../services/context/UserContext';
import { Forbidden } from '../forbidden'
import Waiting from '../parts/waiting';
import { privateRoutes } from '../../services/routes';


export default function AddCampana(){
    const miUsuario =  tool.getUser()
	if(!miUsuario.isLogged){
		return (
			<Fragment>
				<Forbidden />
			</Fragment>
		);
	}


    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.clientNew
    let titulo = myConst.labels.campanaAdd[0][0] // CREAR CAMPANA
    
    const id = (params.state)? params.state.id : null;
    
    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.clientUpdate
        titulo = myConst.labels.campanaAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
	let [listado, setListado] = useState([]);

	const [listaPartidos, setListaPartidos] = useState([])
	const [listaTipocampana, setListaTipocampana] = useState([])
	const [listaEstados, setListaEstados] = useState([])

	const [listaPlanes, setListaPlanes] = useState([])

	const { register, reset, formState: { errors } , handleSubmit } = useForm({});


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
                        navegar(privateRoutes.CAMPANA_LISTADO, { replace: true })
                    }
                })
                
            });

			setWaiting(waiting => false)
		}
	}

    const recoverRecord = () => {
        listado = [tool.getRecord()]
        setListado(listado)
    };

    useEffect(() => {
        recoverRecord()
        setIsFetching(fetching => true)
        setWaiting(waiting => true)
        let selected = ''

		fetch(myConst.roots.engine + myConst.roots.listaPlanes+ '?criterio=0')
		.then((response) => response.json())
		.then((elMensaje) => {
			setListaPlanes(
				elMensaje.message.map((elplan) =>{
                    selected =(listado[0]?.idplan === elplan.id)? ' selected ' : '' ;
                    return <option key={elplan.id} defaultValue={elplan.id} selected={selected}>{elplan.descripcion}</option>
				})				
			)
		});

		fetch(myConst.roots.engine + myConst.roots.tipoCampana+ '?criterio=0')
		.then((response) => response.json())
		.then((elMensaje) => {
            setListaTipocampana(
				elMensaje.message.map((eltipo) =>{
                    selected =(listado[0]?.idtipocampana === eltipo.id)? ' selected ' : '' ;
                    return <option key={eltipo.id} defaultValue={eltipo.id} selected={selected}>{eltipo.descripcion}</option>
				})
			)
		});

		fetch(myConst.roots.engine + myConst.roots.listaPartidos+ '?criterio=0')
		.then((response) => response.json())
		.then((elMensaje) => {
			setListaPartidos(
				elMensaje.message.map((elpartido) =>{
                    selected =(listado[0]?.idpartidopolitico === elpartido.id)? ' selected ' : '' ;
                    return <option key={elpartido.id} defaultValue={elpartido.id} selected={selected}>{elpartido.descripcion}</option>
				})				
			)
		});

		fetch(myConst.roots.engine + myConst.roots.listaEstados+ '?criterio=0')
		.then((response) => response.json())
		.then((elMensaje) => {
			setListaEstados(
				elMensaje.message.map((elestado) =>{
                    selected =(listado[0]?.idestado === elestado.id)? ' selected ' : '' ;
                    return <option key={elestado.id} defaultValue={elestado.id} selected={selected}>{elestado.descripcion}</option>
				})				
			)
		});        

        setWaiting(waiting => false)

        // DEFAULT VALUES FORM
        const defaultValues = {};
        defaultValues.idcampana= id||''
        defaultValues.celular= listado[0]?.celular||''
        defaultValues.correo= listado[0]?.correo||''
        defaultValues.selanzaal= listado[0]?.idtipocampana||0
        defaultValues.miplan= listado[0]?.idplan||0
        defaultValues.campana= listado[0]?.nombre||''
        defaultValues.lema= listado[0]?.lema||''
        defaultValues.tarjeton= listado[0]?.tarjeton||''
        defaultValues.elpartido= listado[0]?.idpartidopolitico||0
        defaultValues.cupon= listado[0]?.cupon||''
        defaultValues.estado= listado[0]?.idestado||0
        reset({ ...defaultValues });

		setIsFetching(false)

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
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center">
                                    <h4 className="card-title">
                                        <img src={myConst.essentials.logohorizontal} alt="navbar brand" className="navbar-brand" />
                                        {titulo}
                                    </h4>
                                </div>
                            </div>
                            <div className="card-body">
                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idcampana")} /> : "" }
                                    <div className="form-group  text-left has-feedback">
                                        <label htmlFor='nombre'>Correo oficial de la campaña:</label>
                                        <input type="text" className="form-control" placeholder='micandidato@gmail.com'
                                        {...register("correo", {
                                            required:true,
                                            pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ //eslint-disable-line
                                        })} />
                                        { errors.correo?.type === 'required' && <small className="form-text text-danger">Debe escribir un correo de verdad</small> }
                                        { errors.correo?.type === 'pattern' && <small className="form-text text-danger">El correo está mal escrito</small> }
                                    </div>
                                    
                                    <div className="form-group  text-left has-feedback">
                                        <label htmlFor='celular'>Teléfono oficial de la campaña (Con Whatsapp):</label>
                                        <input type="text" className="form-control" placeholder='3117696973'
                                        {...register("celular", {
                                            required:true,
                                            minLength: 10,
                                            pattern: /^\d+$/ //eslint-disable-line
                                        })} />
                                        { errors.celular?.type === 'required' && <small className="form-text text-danger">Escriba un celular con acceso a Whatsapp por favor</small> }
                                        { errors.celular?.type === 'pattern' && <small className="form-text text-danger">Sólo números, ejemplo: 3117696973</small> }
                                    </div>
                                    
                                    <div className="form-group form-floating-label text-left has-feedback">
                                        <select className="form-control input-border-bottom" {...register("selanzaal", {
                                            required:true
                                        })}>
                                            <option key="0" value="">Seleccione el tipo de campaña</option>
                                            { listaTipocampana }
                                        </select>
                                        <label htmlFor="selanzaal" className="placeholder">Tipo de campaña o escaño</label>
                                        { errors.selanzaal?.type === 'required' && <small className="form-text text-danger">¿A qué se lanza?</small> }
                                    </div>

                                    <div className="form-group form-floating-label text-left has-feedback">
                                        <select className="form-control input-border-bottom" {...register("miplan", {
                                            required:true
                                        })}>
                                            <option key="0" value="">Seleccione un plan</option>
                                            { listaPlanes }
                                        </select>
                                        <label htmlFor="miplan" className="placeholder">Plan a elegir</label>
                                        { errors.miplan?.type === 'required' && <small className="form-text text-danger">Elija un plan para el servicio</small> }
                                    </div>

                                    <div className="form-group  text-left has-feedback">
                                        <label htmlFor='nombre'>Nombre de la campaña:</label>
                                        <input type="text" className="form-control" placeholder='Diogenes de Jesus Gobernador'
                                        {...register("campana", {
                                            required:true,
                                            minLength: 8
                                        })} />
                                        { errors.campana?.type === 'required' && <small className="form-text text-danger">¿Cómo se llama la campaña?</small> }
                                        { errors.campana?.type === 'minLength' && <small className="form-text text-danger">El nombre está corto</small> }													
                                    </div>
                                    
                                    <div className="form-group  text-left has-feedback">
                                        <label htmlFor='nombre'>Lema o slogan de la campaña:</label>
                                        <input type="text" className="form-control" placeholder='El cambio que necesita nuestra región'
                                        {...register("lema", {
                                            required:true,
                                            minLength: 8
                                        })} />
                                        { errors.lema?.type === 'required' && <small className="form-text text-danger">Campaña que se respete tiene un lema, ¿Cuál es el suyo?</small> }
                                        { errors.lema?.type === 'minLength' && <small className="form-text text-danger">¡El lema está corto, le hace falta calle, por favor inspírese!</small> }
                                    </div>
                                    
                                    <div className="form-group  text-left has-feedback">
                                        <label htmlFor='tarjeton'>Tarjetón:</label>
                                        <input type="text" className="form-control" placeholder='PU 07'
                                        {...register("tarjeton", {
                                            required:true
                                        })} />
                                        { errors.tarjeton?.type === 'required' && <small className="form-text text-danger">¿Cuál es la opción de votación?</small> }
                                    </div>
                                    
                                    <div className="form-group  form-floating-label text-left  has-feedback">
                                        <select className="form-control input-border-bottom"  {...register("elpartido", {
                                            required:true
                                        })}>
                                            <option key="0" value="">Seleccione un partido</option>
                                            { listaPartidos }
                                        </select>
                                        <label htmlFor="elpartido" className="placeholder">Partido politico...</label>
                                        { errors.elpartido?.type === 'required' && <small className="form-text text-danger">¿A qué partido pertenece la campaña?</small> }
                                    </div>
                                    
                                    <div className="form-group text-left ">
                                        <label htmlFor='cupon'>Cupón:</label>
                                        <input type="text" className="form-control" placeholder="Si tiene un cupón de descuento, escríbalo aquí"
                                        {...register("cupon")}
                                        />
                                    </div>

                                    <div className="form-group form-floating-label text-left has-feedback">
                                        <select className="form-control input-border-bottom" {...register('estado', {
                                            required:true
                                        })}>
                                            <option key="0" value="">Seleccione un estado</option>
                                            { listaEstados }
                                        </select>
                                        <label htmlFor="estado" className="placeholder">Estado de campaña</label>
                                        { errors.estado?.type === 'required' && <small className="form-text text-danger">¿Activo, eliminado, zombie...?</small> }
                                    </div>

                                    <div className='card-action text-center'>
                                        <button
                                            type='submit'
                                            className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
                                            disabled={errorMessage.message||waiting}
                                        >
                                            OK
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}