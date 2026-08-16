import { Fragment, useContext, useState, useReducer, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import swal from 'sweetalert2';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';
import CRUD from '../../main/crudConfig';

import { Forbidden } from '../forbidden';
import UserHead from '../components/head';
import Listado from '../components/tables';
import Waiting from '../parts/waiting';
import { Foot } from '../components/foot';

/**
 * gestionList: listado genérico para cualquier entidad del CRUD.
 * La entidad se resuelve desde la ruta `/gestion/:entidad` y su config
 * en `main/crudConfig.js`.
 */
export default function GestionList() {
    const { entidad } = useParams();
    const config = CRUD[entidad];
    // eslint-disable-next-line
    const { waiting, setWaiting } = useContext(UserContext);
    const [isFetching, setIsFetching] = useState(false);
    const [listado, setListado] = useState([]);
    const [listadoController, setListadoController] = useState(0);
    const navegar = useNavigate();
    const miUsuario = tool.getUser();

    // Columnas de la tabla (del config) + columna de acciones.
    const columnas = (config ? config.columns : []).map((c) => ({
        name: c.header,
        selector: (row) => row[c.key],
        sortable: true,
        minWidth: c.width || '160px',
        wrap: true,
    }));
    columnas.push({
        button: true,
        cell: (row) => (
            <div className="form-button-action">
                <button type="button" data-toggle="tooltip"
                    onClick={() => editElement(row)}
                    title="Editar elemento" className="btn btn-rounded btn-outline-primary btn-xs mr-1">
                    <i className="la flaticon-pencil"></i>
                </button>
                <button type="button" data-toggle="tooltip"
                    onClick={() => dispatch({ type: 'delete', reference: row.idregistro })}
                    title="Eliminar elemento" className="btn btn-rounded btn-outline-danger btn-xs mr-1">
                    <i className="la flaticon-interface-5"></i>
                </button>
            </div>
        ),
    });

    // eslint-disable-next-line
    const [miLista, dispatch] = useReducer(async (state = [], action) => {
        const laReferencia = action.reference;
        switch (action.type) {
            case 'list':
                setWaiting(true);
                await messenger.poster({
                    method: 'POST',
                    url: myConst.roots.engine + config.endpoints.listar,
                    value: {},
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
                    if (answer.isConfirmed) {
                        setWaiting(true);
                        // El idregistro ya viene encriptado desde la API.
                        await messenger.poster({
                            method: 'POST',
                            url: myConst.roots.engine + config.endpoints.borrar,
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
                        setWaiting(false);
                    } else {
                        swal.close();
                    }
                });
                break;

            default:
                return state;
        }
    });

    const editElement = (row) => {
        if (row && row !== '') {
            tool.setRecord(row);
            navegar(`/gestion/${entidad}/agregar`, { state: { id: row.idregistro } });
        }
    };

    useEffect(() => {
        if (config) {
            setWaiting(true);
            setIsFetching(true);
            dispatch({ type: 'list' });
            setIsFetching(false);
            setWaiting(false);
        }
        // eslint-disable-next-line
    }, [entidad, listadoController]);

    if (!miUsuario.isLogged) {
        return <Fragment><Forbidden /></Fragment>;
    }

    if (!config) {
        return (
            <Fragment>
                <div id="elgrapper" className="wrapper">
                    <UserHead waiting={waiting} setWaiting={setWaiting} />
                    <div className="main-panel">
                        <div className="content">
                            <div className="page-inner">
                                <h1 className="text-center text-danger">Entidad no reconocida: {entidad}</h1>
                            </div>
                        </div>
                        <Foot />
                    </div>
                </div>
            </Fragment>
        );
    }

    if (isFetching) {
        return <Fragment><Waiting /></Fragment>;
    }

    return (
        <Fragment>
            <div id="elgrapper" className="wrapper">
                <UserHead waiting={waiting} setWaiting={setWaiting} />
                <div className="main-panel">
                    <div className="content">
                        <div className="page-inner">
                            <div className="page-inner mt--5">
                                <h1 className="text-center">
                                    <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                                    {miUsuario.usuarioInstitucionNombre}
                                </h1>
                            </div>
                            <div className="page-inner mt--2">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center">
                                                    <h4 className="card-title">{config.titulo}</h4>
                                                    <Link to={`/gestion/${entidad}/agregar`} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-plus">&nbsp;&nbsp;</i>
                                                        Agregar
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                {(listado.length > 0)
                                                    ? <Listado props={{ title: config.titulo, columns: columnas, data: listado }} />
                                                    : <div><h2 className="text-center text-danger">Sin datos que mostrar</h2></div>}
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
