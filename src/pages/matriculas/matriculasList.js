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

/**
 * Listado de matrículas (SAE - public.tabmatr).
 * Referencia de estilo: pages/observaciones/observacionesList.js
 */
export default function ListadoMatriculas(){
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [isFetching, setIsFetching] = useState(false);
	const [listado, setListado] = useState([]);

	const [listadoController, setListadoController] = useState(0);
    const navegar = useNavigate()

	const columnas = [
        {name:'ESTUDIANTE',selector: row => row.estudiante,minWidth: "220px",wrap: true,sortable:true},
        {name:'CURSO',selector: row => row.curso,maxWidth: "160px",sortable:true},
        {name:'FECHA',selector: row => row.fecha,maxWidth: "120px",sortable:true},
        {name:'PENSIÓN',selector: row => row.valorpension,maxWidth: "120px",sortable:true},
        {button:true,
            cell: (miListado) => {
                return (<div className="form-button-action">
                    <button type="button" data-toggle="tooltip"
                        onClick={() => editElement(miListado)}
                        title="Editar matrícula" className="btn btn-rounded btn-outline-primary btn-xs mr-1"
                        data-original-title="Editar matrícula">
                        <i className="la flaticon-pencil"></i>
                    </button>
                    <button type="button" data-toggle="tooltip"
                        onClick={() => dispatch({type:'delete', reference: miListado.idregistro}) }
                        title="Eliminar matrícula" className="btn btn-rounded btn-outline-danger btn-xs mr-1"
                        data-original-title="Eliminar matrícula">
                        <i className="la flaticon-interface-5"></i>
                    </button>
                </div>)
            }
        }
    ]

    let miUsuario =  tool.getUser()

    // eslint-disable-next-line
    const [miLista, dispatch] = useReducer(async (state = [], action) => {
        miUsuario = tool.getUser()
        const laReferencia = action.reference
        switch(action.type){
            case 'list':
                setWaiting(waiting => true)
                await messenger.poster({
                    method:'POST',
                    url: myConst.roots.engine + myConst.roots.matriculaList,
                    value: {}
                }).then((resultado)=>{
                    setListado(resultado.rows || [])
                    return listado
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
                    customClass: { confirmButton:'btn btn-danger', closeButton:'btn btn-primary' },
                }).then(async (answer) => {
                    // eslint-disable-next-line
                    setWaiting(waiting => true)
                    if (answer.isConfirmed) {
                        await messenger.poster({
                            method:'POST',
                            url: myConst.roots.engine + myConst.roots.matriculaDelete,
                            value: { idregistro: laReferencia }
                        }).then((resultado)=>{
                            setListadoController(listadoController+1)
                            if( parseInt(resultado.statusCode) === 200){
                                swal.fire({ title: 'Eliminada!', text: resultado.message, icon: resultado.status, showConfirmButton: true, customClass: { confirmButton:'btn btn-success' } });
                            }else{
                                swal.fire({ title: 'El sistema no pudo eliminar el dato!', text: resultado.message, icon: resultado.status, showConfirmButton: true, customClass: { confirmButton:'btn btn-primary' } });
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
        dispatch({ type:'list', reference: miUsuario.usuarioId })
    }

    const editElement = (laReferencia) =>{
        if(laReferencia !== ""){
            tool.setRecord(laReferencia)
            navegar(privateRoutes.MATRICULAS_ADD, {state:{reference: laReferencia.idregistro}})
        }
    }

    useEffect(() => {
        setWaiting(waiting => true)
        setIsFetching(true)
		dispatch({ type:'list' })
		setIsFetching(false)
        setWaiting(waiting => false)
        // eslint-disable-next-line
    }, [listadoController]);

	if(!miUsuario.isLogged){
		return (<Fragment><Forbidden /></Fragment>);
	}
	if(isFetching){
		return (<Fragment><Waiting /></Fragment>);
	}else{
        return (
            <Fragment>
                <div id='elgrapper' className="wrapper">
                    <UserHead waiting={waiting} setWaiting={setWaiting} />
                    <div className="main-panel">
                        <div className="content">
                            <div className="page-inner">
                                <div className="page-inner mt--5">
                                    <h1 className="text-center">
                                        <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                                        { myConst.labels.matriculasList[0] }
                                    </h1>
                                </div>
                                <div className="page-inner mt--2">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="d-flex align-items-center">
                                                        <h4 className="card-title">{ myConst.labels.matriculasList[0] }</h4>
                                                        <Link to={privateRoutes.MATRICULAS_ADD} className="btn btn-primary btn-round ml-auto">
                                                            <i className="fa fa-plus">&nbsp;&nbsp;</i>
                                                            {myConst.labels.matriculasAdd[0][0]}
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <form onSubmit={handleSubmit}>
                                                        { (listado.length > 0)?
                                                            <Listado props={{title:'Matrículas',columns:columnas,data:listado}} />
                                                            :
                                                            <div><h2 className='text-center text-danger'>Sin matrículas que mostrar</h2></div> }
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
