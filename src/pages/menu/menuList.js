import { Fragment, useContext, useState, useReducer, useEffect } from 'react';

import swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../services/context/UserContext';

import { privateRoutes } from '../../services/routes';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'

import { Forbidden } from '../forbidden'
import UserHead from '../components/head'
import Listado from '../components/tables'
import Waiting from '../parts/waiting';
import { Foot } from '../components/foot'

export default function ListadoMenu(){
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
	const [listado, setListado] = useState([]);
	const [listadoController, setListadoController] = useState(0);
    const navegar = useNavigate()

	const columnas = [
        {name:'NOMBRE',selector: row => row.nombre,sortable:true},
        {name:'DESCRIPCION',selector: row => row.descripcion,sortable:true},
        {name:'ESTADO',selector: row => row.estado,sortable:true},
        {name:'ICONO',selector: row => row.icono,sortable:true},
        {name:'ORDEN',selector: row => row.orden,sortable:true},
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
                        onClick={() => dispatch({type:'delete', reference: miListado.idregistro})} 
                        title="" className="btn btn-rounded btn-outline-danger btn-xs mr-1" 
                        data-original-title="Eliminar elemento">
                        <i className="la flaticon-interface-5"></i>
                    </button>
                </div>                
            )}
    ]

    let miUsuario =  tool.getUser()

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
                    url: myConst.roots.engine + myConst.roots.menuList,
                    value: {reference: action.reference }
                }) 
                .then((resultado)=>{
                    if(resultado.rows.data.length > 0){
                        
                        console.log('El listado es: ', resultado)
                        setListado(resultado.rows.data)
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
                            url: myConst.roots.engine + myConst.roots.menuDelete,

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
            navegar(privateRoutes.MENU_ADD, {state:{id: laReferencia.idregistro}})
        }
    }

    useEffect(() => {
        setWaiting(waiting => true)
        setIsFetching(true)
		dispatch({
            type:'list'
        })

		setIsFetching(false)
        setWaiting(waiting => false)
    }, [listadoController]);


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
                                                        <Link to={privateRoutes.MENU_ADD} className="btn btn-primary btn-round ml-auto">
                                                            <i className="fa fa-plus">&nbsp;&nbsp;</i>
                                                            {myConst.labels.menuAdd[0][0]} 
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <form onSubmit={handleSubmit}>
                                                        { (listado.length > 0)?  
                                                            <Listado props={{title:'Menues de la base de datos',columns:columnas,data:listado}} /> 
                                                            : 
                                                            <div><h2 className='text-center text-danger'>Sin menues que mostrar</h2></div> }
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