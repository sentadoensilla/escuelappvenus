import { Fragment, useContext, useState, useReducer, useEffect } from 'react';

import swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../services/context/UserContext';

import { privateRoutes, publicRoutes } from '../../services/routes';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'

import { Forbidden } from '../forbidden'
import UserHead from '../components/head'
import Listado from '../components/tables'
import Waiting from '../parts/waiting';
import { Foot } from '../components/foot'

export default function ListadoComunicados(){
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
	const [listado, setListado] = useState([]);
	const [listadoController, setListadoController] = useState(0);
    const navegar = useNavigate()

	const columnas = [
        {name:'DESDE',selector: row => row.date_init,maxWidth: "200px",sortable:true},
        {name:'HASTA',selector: row => row.date_finish,maxWidth: "200px",sortable:true},
        {name:'GRUPO',selector: row => row.group.replaceAll(',', ', '),maxWidth: "200px",sortable:true},
        {name:'EMISOR',selector: row => row.emisor,maxWidth: "200px",sortable:true},
        {name:'TITULO',selector: row => row.title,maxWidth: "200px",sortable:true},
        {name:'DESCRIPCION',selector: row => tool.removeTags(row.comunicate) ,maxWidth: "200px",sortable:true},
        {name:'COMENTARIOS',selector: row => row.comentarios,maxWidth: "200px",sortable:true},
        {name:'ESTADO',selector: row => row.estado,maxWidth: "200px",sortable:true},

        {button:true,
            cell: (miListado) => (
                <div className="form-button-action">
                    <button type="button" data-toggle="tooltip"  
                        onClick={() => showElement(miListado)} 
                        title="" className="btn btn-rounded btn-success btn-xs mr-1" 
                        data-original-title="Ver elemento">
                        <i className="fas fa-glasses"></i>
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
                    url: myConst.roots.engine + myConst.roots.alertList,
                    value: {
                        ano_lectivo: miUsuario.usuarioAnoId,
                        id_institucion: miUsuario.usuarioEmpresaId,
                        id_usuario: miUsuario.usuarioId,
                        id_academico: miUsuario.academicoId,
                        rol: miUsuario.usuarioRollId
                    }
                }) 
                .then((resultado)=>{
                    if(resultado.rows.length > 0){
                        
                        console.log('El listado es: ', resultado)
                        setListado(resultado.rows)
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
                            url: myConst.roots.engine + myConst.roots.alertDelete,

                            value: {
                                reference: laReferencia, 
                                id_usuario: miUsuario.usuarioId,
                                rol: miUsuario.usuarioRollId,
                                id_academico: miUsuario.academicoId,
                                ano_lectivo: miUsuario.usuarioAnoId,
                                id_institucion: miUsuario.usuarioEmpresaId
                            }
                        }).then((resultado)=>{
                            // CALL USEEFFECT TO RUN LIST AGAIN
                            setListadoController(listadoController+1)

                            if( parseInt(resultado.statusCode) === 200){
                                swal.fire({
                                    title: 'Eliminado!',
                                    text: resultado.message,
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

    const showElement = (laReferencia) =>{
        if(laReferencia !== ""){
            tool.setRecord(laReferencia)
            window.open(
                publicRoutes.COMUNICACION_VIEW+"/"+laReferencia.idregistro, 
                "_blank"
            )
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
                                                        <h4>{myConst.labels.alertList[0]} </h4>
                                                        <Link to={privateRoutes.COMUNICACION_ADD} className="btn btn-primary btn-round ml-auto">
                                                            <i className="fa fa-plus">&nbsp;&nbsp;</i>
                                                            {myConst.labels.alertAdd[0][0]} 
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <form onSubmit={handleSubmit}>
                                                        { (listado.length > 0)?  
                                                            <Listado props={{title:' ',columns:columnas,data:listado}} /> 
                                                            : 
                                                            <div><h2 className='text-center text-danger'>Sin comunicados que mostrar</h2></div> }
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