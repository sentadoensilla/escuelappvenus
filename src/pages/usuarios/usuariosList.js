import { Fragment, useState, useReducer, useEffect, useContext } from 'react'

import swal from 'sweetalert2'
import { useNavigate, Link } from 'react-router-dom'

import { privateRoutes } from '../../services/routes'
import * as myConst from '../../main/constants'
import messenger from '../../services/messenger'
import tool from '../../services/tools'
import { UserContext } from '../../services/context/UserContext';
import { Forbidden } from '../forbidden'
import Listado from '../components/tables'
import Waiting from '../parts/waiting'
import UserHead from '../components/head'
import { Foot } from '../components/foot'

export default function Listadolider(){
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
	const [listado, setListado] = useState([]);
	const [listadoController, setListadoController] = useState(0);
    const navegar = useNavigate()

	const columnas = [
        {name:'NOMBRE',selector: row => row.nombres,sortable:true},
        {name:'USUARIO',selector: row => row.usuario,sortable:true},
        {name:'CAMPAÑA',selector: row => row.campana,sortable:true},
        {name:'DEPARTAMENTO',selector: row => row.departamento,sortable:true},
        {name:'MUNICIPIO',selector: row => row.municipio,sortable:true},
        {name:'TIPO DE USUARIO',selector: row => row.tipousuario,sortable:true},
        {name:'ESTADO',selector: row => row.estado,sortable:true},
        {button:true,
            cell: (miListado) => (
                <div className="form-button-action">
                    <button type="button" data-toggle="tooltip"  
                        onClick={() => editElement(miListado)} 
                        title="" className="btn btn-rounded btn-primary btn-xs mr-1" 
                        data-original-title="Edtar elemento">
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button type="button" data-toggle="tooltip" 
                        onClick={() => dispatch({type:'delete', reference: miListado.idusuario, campana: miListado.idcampana})} 
                        title="" className="btn btn-rounded btn-danger btn-xs mr-1" 
                        data-original-title="Eliminar elemento">
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </div>                
            )}
    ]

    let miUsuario =  tool.getUser()
	
	if(!miUsuario.isLogged){
		return (
			<Fragment>
				<Forbidden />
			</Fragment>
		);
	}

    // eslint-disable-next-line
    const [miLista, dispatch] = useReducer(async (state = [], action) => {
        // EACH INTERACTION GET USER INFORMATION
        miUsuario = tool.getUser()
        const laReferencia = miUsuario.usuarioId
        switch(action.type){
            
            case 'list':
                setWaiting(waiting => true)

                await messenger.poster({
                    method:'POST',
                    url: myConst.roots.engine + myConst.roots.liderList,
                    value: {
                        reference: laReferencia,
                        t: miUsuario.usuarioRollId,
                        campana: miUsuario.usuarioCampanaId,
                        token: miUsuario.token 
                    }
                }) 
                .then((resultado)=>{
                    if(resultado.message.length > 0){
                        setListado(resultado.message)
                        return listado
                    }
                    setWaiting(waiting => false)
                })
                setWaiting(waiting => false)
            break;

            case 'delete':
                
                swal.fire({
                    title: '¿Está seguro?',
                    text: "Eliminar esto no tiene reversa!",
                    icon: 'warning',
                    showConfirmButton: true,
                    confirmButtonText : 'Si, eliminar!',
                    showCancelButton: true,
                    customClass: {
                        confirmButton:'btn btn-danger',
                        closeButton:'btn btn-primary'
                    },
                }).then(async (answer) => {
                    if (answer.isConfirmed) {
                        setWaiting(waiting => true)

                        await messenger.poster({
                            method:'POST',
                            url: myConst.roots.engine + myConst.roots.liderDelete,
                            value: {reference: action.reference, campana: action.campana, token: miUsuario.token}
                        }).then((resultado)=>{
                            // CALL USEEFFECT TO RUN LIST AGAIN
                            setListadoController(listadoController+1)

                            if( parseInt(resultado.statusCode) === 200){
                                swal.fire({
                                    title: 'Eliminado!',
                                    text: 'El dato fue eliminado',
                                    icon: resultado.status,
                                    showConfirmButton: true,
                                    customClass: {
                                        confirmButton:'btn btn-success'
                                    }
                                });

                            }else{
                                swal.fire({
                                    title: 'El sistema no pudo eliminar el dato!',
                                    text: resultado.message,
                                    icon: resultado.status,
                                    showConfirmButton: true,
                                    customClass: {
                                        confirmButton:'btn btn-primary'
                                    }
                                });
                            }
                            setWaiting(waiting => false)
                        })
                        setWaiting(waiting => false)
                    } else {
                        swal.close();
                    }
                });

            break;

            default:
                return state;
            
        }

    });

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch({
            type:'list',
            reference: event.target.value,
            lider: miUsuario.usuarioId, 
            campana: miUsuario.usuarioCampanaId
        })
    }

    const editElement = (laReferencia) =>{
        if(laReferencia !== ""){
            tool.setRecord(laReferencia)
            navegar(
                privateRoutes.USUARIO_ADD, 
                {
                    state:{
                        idusuario: laReferencia.idusuario
                    }
                }
            )
        }
    }

    useEffect(() => {
        setIsFetching(fetch => true)
        setWaiting(waiting => true)

		dispatch({
            type:'list'
        })

		setIsFetching(fetch => false)
        setWaiting(waiting => false)

    }, [listadoController]);


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
                                                    Mis lideres
                                                </h4>
                                                <Link to={privateRoutes.USUARIO_ADD} className="btn btn-primary btn-round ml-auto">
                                                    <i className="fa fa-plus">&nbsp;&nbsp;</i>
                                                    lider 
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                { (listado.length > 0)?  <Listado props={{title:' Listado de lideres ',columns:columnas,data:listado}} /> : <div><h2 className='text-center text-danger'>Sin datos</h2></div> }
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