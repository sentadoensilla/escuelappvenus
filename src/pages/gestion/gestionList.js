import { Fragment, useContext, useState, useReducer, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import swal from 'sweetalert2';
import QRCode from 'react-qr-code';

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
import AppIcon from '../components/AppIcon';
import TituloPagina from '../components/TituloPagina';


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
    const [mostrarQR, setMostrarQR] = useState(false);
    const navegar = useNavigate();
    const miUsuario = tool.getUser();

    // Enlace del formulario de llenado para compartir (QR + copiar).
    // Para entidades con auto-gestión (docentes) apunta al formulario público y
    // lleva los datos de sesión ENCRIPTADOS (institución/año) en el query string.
    const urlFormulario = (() => {
        const base = window.location.origin + (config && config.compartirUrl ? config.compartirUrl : `/gestion/${entidad}/agregar`);
        if (!(config && config.autogestion)) return base;
        const params = new URLSearchParams();
        if (miUsuario.usuarioEmpresaId) params.set('inst', miUsuario.usuarioEmpresaId);
        if (miUsuario.usuarioAnoId) params.set('ano', miUsuario.usuarioAnoId);
        const qs = params.toString();
        return qs ? `${base}?${qs}` : base;
    })();

    // Columnas de la tabla (del config) + columna de acciones.
    // `c.format` permite transformar el valor crudo de la API antes de mostrarlo
    // (ej. fechas -> 'aaaa-mm-dd', estados -> descripción).
    const columnas = (config ? config.columns : []).map((c) => ({
        name: c.header,
        selector: (row) => (typeof c.format === 'function' ? c.format(row[c.key], row) : row[c.key]),
        sortable: true,
        minWidth: c.width || '160px',
        wrap: true,
    }));
    columnas.push({
        button: true,
        cell: (row) => (
            <div className="form-button-action">
                {config.autorizar && Number(row.idestado) === 4 && (
                    <button type="button" data-bs-toggle="tooltip"
                        onClick={() => autorizarElement(row)}
                        title="Autorizar docente (activar en la institución)"
                        className="btn btn-rounded btn-outline-success btn-xs me-1">
                        <AppIcon icon="tabler:user-check" />
                    </button>
                )}
                <button type="button" data-bs-toggle="tooltip"
                    onClick={() => editElement(row)}
                    title="Editar elemento" className="btn btn-rounded btn-outline-primary btn-xs me-1">
                    <i className="la flaticon-pencil"></i>
                </button>
                <button type="button" data-bs-toggle="tooltip"
                    onClick={() => deleteElement(row.idregistro)}
                    title="Eliminar elemento" className="btn btn-rounded btn-outline-danger btn-xs me-1">
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

    // Autoriza (activa) un docente autogestionado que está PENDIENTE.
    // Luego se puede editar para completar cargo / jefe de área.
    const autorizarElement = async (row) => {
        const answer = await swal.fire({
            title: '¿Autorizar docente?',
            text: 'Se activará como docente de la institución. Después podrás completar cargo y jefe de área con "Editar".',
            icon: 'question',
            showConfirmButton: true,
            confirmButtonText: 'Sí, autorizar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            customClass: { confirmButton: 'btn btn-primary mx-1', cancelButton: 'btn btn-danger mx-1' },
            buttonsStyling: false,
        });
        if (!answer.isConfirmed) { swal.close(); return; }
        setWaiting(true);
        try {
            const resultado = await messenger.poster({
                method: 'POST',
                url: myConst.roots.engine + config.autorizar,
                value: { idregistro: row.idregistro },
            });
            setListadoController(listadoController + 1);
            await swal.fire({
                title: (parseInt(resultado.statusCode) === 200) ? 'Docente autorizado' : 'No se pudo autorizar',
                text: resultado.message,
                icon: resultado.status,
                showConfirmButton: true,
                customClass: { confirmButton: 'btn btn-primary' },
            });
        } finally {
            setWaiting(false);
        }
    };

    // Borrado con confirmación y estado de carga del botón (ActionButton).
    const deleteElement = async (reference) => {
        const answer = await swal.fire({
            title: '¿Está seguro?',
            text: 'Eliminar esto no tiene reversa!',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Sí, eliminar!',
            showCancelButton: true,
            customClass: { confirmButton: 'btn btn-danger', closeButton: 'btn btn-primary' },
        });
        if (!answer.isConfirmed) { swal.close(); return; }
        setWaiting(true);
        try {
            // El idregistro ya viene encriptado desde la API.
            const resultado = await messenger.poster({
                method: 'POST',
                url: myConst.roots.engine + config.endpoints.borrar,
                value: { idregistro: reference },
            });
            setListadoController(listadoController + 1);
            await swal.fire({
                title: (parseInt(resultado.statusCode) === 200) ? 'Eliminado!' : 'El sistema no pudo eliminar el dato!',
                text: resultado.message,
                icon: resultado.status,
                showConfirmButton: true,
                customClass: { confirmButton: 'btn btn-primary' },
            });
        } finally {
            setWaiting(false);
        }
    };

    // Abre en OTRA PESTAÑA el listado imprimible (PDF) de la entidad, sin acciones.
    // Sólo se muestra para las entidades con `print: true` (p.ej. docentes).
    const generarPdf = () => {
        window.open(`/gestion/${entidad}/print`, '_blank', 'noopener,noreferrer');
    };

    // Copia al portapapeles el enlace del formulario de llenado.
    const copiarEnlace = async () => {
        try {
            await navigator.clipboard.writeText(urlFormulario);
            await swal.fire({
                title: 'Enlace copiado',
                text: 'Ya puedes pegarlo donde lo necesites.',
                icon: 'success',
                showConfirmButton: true,
                timer: 1800,
                customClass: { confirmButton: 'btn btn-primary' },
            });
        } catch (error) {
            await swal.fire({
                title: 'No se pudo copiar',
                text: urlFormulario,
                icon: 'info',
                showConfirmButton: true,
                customClass: { confirmButton: 'btn btn-primary' },
            });
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
                                                <div className="d-flex align-items-center flex-wrap">
                                                    <TituloPagina>{config.titulo}</TituloPagina>
                                                    <div className="ms-auto d-flex align-items-center flex-wrap">
                                                        {config.compartir && (
                                                            <button type="button" onClick={() => setMostrarQR(true)}
                                                                className="btn btn-outline-primary btn-round me-2"
                                                                title={`Compartir el formulario de ${config.titulo}`}>
                                                                <AppIcon icon="tabler:qr-code" /> Compartir formulario
                                                            </button>
                                                        )}
                                                        {config.print && (
                                                            <button type="button" onClick={generarPdf}
                                                                className="btn btn-danger btn-round me-2"
                                                                title={`Listado de ${config.titulo} en PDF`}>
                                                                <AppIcon icon="tabler:file-type-pdf" /> Listado de {config.titulo}
                                                            </button>
                                                        )}
                                                        <Link to={`/gestion/${entidad}/agregar`} className="btn btn-primary btn-round">
                                                            <AppIcon icon="la flaticon-plus" />
                                                            Agregar
                                                        </Link>
                                                    </div>
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

            {/* Modal QR para compartir el formulario de llenado. */}
            {mostrarQR && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                    onClick={() => setMostrarQR(false)}
                >
                    <div className="card" style={{ width: '340px', maxWidth: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <div className="card-body text-center">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <h5 className="card-title mb-0">Compartir formulario</h5>
                                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setMostrarQR(false)} />
                            </div>
                            <div className="bg-white d-inline-block p-2 border rounded">
                                <QRCode value={urlFormulario} size={200} />
                            </div>
                            <p className="text-muted mt-3 mb-1">Escanea el QR o copia el enlace para llenar el formulario:</p>
                            <code className="d-block text-break mb-3" style={{ userSelect: 'all' }}>{urlFormulario}</code>
                            <div className="d-flex justify-content-center">
                                <button type="button" className="btn btn-primary btn-sm me-1" onClick={copiarEnlace}>
                                    <AppIcon icon="tabler:copy" /> Copiar enlace
                                </button>
                                <button type="button" className="btn btn-light btn-sm" onClick={() => setMostrarQR(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}
