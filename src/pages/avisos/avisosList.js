import { Fragment, useContext, useState, useReducer, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import swal from 'sweetalert2';

import { UserContext } from '../../services/context/UserContext';
import { privateRoutes } from '../../services/routes';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';

import { Forbidden } from '../forbidden';
import UserHead from '../components/head';
import Listado from '../components/tables';
import Waiting from '../parts/waiting';
import { Foot } from '../components/foot';

/**
 * Avisos institucionales (SAE - public.tabavisroll).
 * Listado de avisos dirigidos a roles. Patrón de referencia: pages/menu/menuList.js
 */
export default function ListadoAvisos() {
    // eslint-disable-next-line
    const { waiting, setWaiting } = useContext(UserContext);
    const [isFetching, setIsFetching] = useState(false);
    const [listado, setListado] = useState([]);
    const [listadoController, setListadoController] = useState(0);
    const navegar = useNavigate();
    const miUsuario = tool.getUser();

    const columnas = [
        { name: 'TÍTULO', selector: row => row.titulo, minWidth: '180px', wrap: true, sortable: true },
        { name: 'CONTENIDO', selector: row => tool.removeTags(row.contenido), minWidth: '220px', wrap: true, sortable: true },
        { name: 'AUTOR', selector: row => row.autor, minWidth: '160px', sortable: true },
        { name: 'FECHA', selector: row => row.fecharegistro, maxWidth: '150px', sortable: true },
        { button: true, cell: (fila) => (
            <div className="form-button-action">
                <button type="button" data-toggle="tooltip"
                    onClick={() => editElement(fila)} title="Editar aviso"
                    className="btn btn-rounded btn-outline-primary btn-xs mr-1">
                    <i className="la flaticon-pencil"></i>
                </button>
                <button type="button" data-toggle="tooltip"
                    onClick={() => dispatch({ type: 'delete', reference: fila.idregistro })}
                    title="Eliminar aviso" className="btn btn-rounded btn-outline-danger btn-xs mr-1">
                    <i className="la flaticon-interface-5"></i>
                </button>
            </div>
        ) },
    ];

    // eslint-disable-next-line
    const [miLista, dispatch] = useReducer(async (state = [], action) => {
        const laReferencia = action.reference;
        switch (action.type) {
            case 'list':
                setWaiting(true);
                await messenger.poster({
                    method: 'POST',
                    url: myConst.roots.engine + myConst.roots.avisoList,
                    value: { idautor: miUsuario.usuarioId },
                }).then((resultado) => {
                    setListado(resultado.rows || []);
                    return listado;
                }).catch(() => setListado([]));
                setWaiting(false);
                break;

            case 'delete':
                swal.fire({
                    title: '¿Está seguro?',
                    text: 'Eliminar esto no tiene reversa!',
                    icon: 'warning',
                    showConfirmButton: true,
                    confirmButtonText: 'Sí, eliminar!',
                    showCancelButton: true,
                    customClass: { confirmButton: 'btn btn-danger', closeButton: 'btn btn-primary' },
                }).then(async (answer) => {
                    setWaiting(true);
                    if (answer.isConfirmed) {
                        await messenger.poster({
                            method: 'POST',
                            url: myConst.roots.engine + myConst.roots.avisoDelete,
                            value: { idregistro: laReferencia },
                        }).then((resultado) => {
                            setListadoController(listadoController + 1);
                            swal.fire({
                                title: (parseInt(resultado.statusCode) === 200) ? 'Eliminado!' : 'El sistema no pudo eliminar el dato!',
                                text: resultado.message,
                                icon: resultado.status,
                                showConfirmButton: true,
                                customClass: { confirmButton: 'btn btn-primary' },
                            });
                        });
                    } else {
                        swal.close();
                    }
                    setWaiting(false);
                });
                break;

            default:
                return state;
        }
    });

    const editElement = (fila) => {
        if (fila && fila !== '') {
            tool.setRecord(fila);
            navegar(privateRoutes.AVISOS_ADD, { state: { reference: fila.idregistro } });
        }
    };

    useEffect(() => {
        setWaiting(true);
        setIsFetching(true);
        dispatch({ type: 'list' });
        setIsFetching(false);
        setWaiting(false);
        // eslint-disable-next-line
    }, [listadoController]);

    if (!miUsuario.isLogged) {
        return <Fragment><Forbidden /></Fragment>;
    }

    if (isFetching) {
        return <Fragment><Waiting /></Fragment>;
    }

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
                                    {myConst.labels.avisosList[0]}
                                </h1>
                            </div>
                            <div className="page-inner mt--2">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center">
                                                    <h4 className="card-title">{myConst.labels.avisosList[0]}</h4>
                                                    <Link to={privateRoutes.AVISOS_ADD} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-plus">&nbsp;&nbsp;</i>
                                                        {myConst.labels.avisosAdd[0][0]}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                {(listado.length > 0)
                                                    ? <Listado props={{ title: myConst.labels.avisosList[0], columns: columnas, data: listado }} />
                                                    : <div><h2 className='text-center text-danger'>Sin avisos que mostrar</h2></div>}
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
