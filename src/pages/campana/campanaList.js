import { Fragment, useState, useReducer, useEffect, useContext } from 'react';

import swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../services/context/UserContext';

import { privateRoutes } from '../../services/routes';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'

import { Forbidden } from '../forbidden'
import Listado from '../components/tables'
import Waiting from '../parts/waiting';


export default function ListadoCampana(){
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
	const [listado, setListado] = useState([]);
	const [listadoController, setListadoController] = useState(0);
    const navegar = useNavigate()

	const columnas = [
        {name:'FECHA',selector: row => row.fechainiciocontrato,sortable:true},
        {name:'CAMPAÑA',selector: row => row.nombre,sortable:true},
        {name:'PARTIDO',selector: row => row.partidopolitico,sortable:true},
        {name:'TARJETON',selector: row => row.tarjeton,sortable:true},
        {name:'TIPO CAMPAÑA',selector: row => row.tipocampana,sortable:true},
        {name:'PLAN',selector: row => row.nombreplan,sortable:true},
        {name:'ESTADO',selector: row => row.estado,sortable:true},
        {button:true,
            cell: (miListado) => (
                <div className="form-button-action">
                    <button type="button" data-toggle="tooltip"  
                        onClick={() => editElement(miListado)} 
                        title="" className="btn btn-rounded btn-outline-primary btn-xs mr-1" 
                        data-original-title="Edtar elemento">
                        <i className="la flaticon-pencil"></i>
                    </button>
                    <button type="button" data-toggle="tooltip" 
                        onClick={() => dispatch({type:'delete', reference: miListado.idcampana})} 
                        title="" className="btn btn-rounded btn-outline-danger btn-xs mr-1" 
                        data-original-title="Eliminar elemento">
                        <i className="la flaticon-interface-5"></i>
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
        const laReferencia = action.reference
        switch(action.type){
            
            case 'list':
                setWaiting(waiting => true)
                await messenger.poster({
                    method:'POST',
                    url: myConst.roots.engine + myConst.roots.clientList,
                    value: {reference: action.reference, token: miUsuario.token }
                }) 
                .then((resultado)=>{
                    if(resultado.message.length > 0){
                        setListado(resultado.message)
                        return listado
                    }
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
                    // eslint-disable-next-line
                    setWaiting(waiting => true)
                    if (answer.isConfirmed) {
                        await messenger.poster({
                            method:'POST',
                            url: myConst.roots.engine + myConst.roots.clientDelete,
                            value: {reference: laReferencia, token: miUsuario.token}
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
                        })
                    } else {
                        swal.close();
                    }
                    setWaiting(waiting => false)
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
            reference: miUsuario.usuarioId
        })
    }

    const editElement = (laReferencia) =>{
        if(laReferencia !== ""){
            tool.setRecord(laReferencia)
            navegar(privateRoutes.CAMPANA_ADD, {state:{id: laReferencia.idcampana}})
        }
    }

    useEffect(() => {
        // tool.appendScript("assets/js/plugin/datatables/datatables.min.js")
        setWaiting(waiting => true)
        setIsFetching(true)
		dispatch({
            type:'list'
        })

		setIsFetching(false)
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
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center">
                                    <h4 className="card-title">
                                        <img src={myConst.essentials.logohorizontal} alt="navbar brand" className="navbar-brand" />
                                        Listado de campañas
                                    </h4>
                                    <Link to={privateRoutes.CAMPANA_ADD} className="btn btn-primary btn-round ml-auto">
                                        <i className="fa fa-plus">&nbsp;&nbsp;</i>
                                        Campaña 
                                    </Link>
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    { (listado.length > 0)?  <Listado props={{title:' Listado de campañas ',columns:columnas,data:listado}} /> : <div><h2 className='text-center text-danger'>Sin datos</h2></div> }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }


}