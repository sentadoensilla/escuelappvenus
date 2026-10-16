import { Fragment, useContext, useEffect, useState } from 'react';
import swal from 'sweetalert2';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';

import { Forbidden } from '../forbidden';
import UserHead from '../components/head';
import { Foot } from '../components/foot';
import Listado from '../components/tables';
import TituloPagina from '../components/TituloPagina';
import ActionButton from '../components/ActionButton';
import AppIcon from '../components/AppIcon';

const BASE = myConst.roots.engine + '/whatsapp';

const ESTADO_SESION = { 1: 'Esperando QR', 2: 'QR generado', 3: 'Escaneando', 4: 'Conectado', 5: 'Desconectado', 6: 'Cerrado', 7: 'Error' };

export default function WhatsappAdmin() {
    const { setWaiting } = useContext(UserContext);
    const miUsuario = tool.getUser();
    const [emisores, setEmisores] = useState([]);
    const [mensajes, setMensajes] = useState([]);
    const [total, setTotal] = useState(0);
    const [filtros, setFiltros] = useState({ status: '', busqueda: '' });

    const cargarEmisores = async () => {
        setWaiting(true);
        const r = await messenger.poster({ method: 'POST', url: BASE + '/emisores/listar', value: {} });
        setEmisores(r.rows || []);
        setWaiting(false);
    };

    const cargarMensajes = async () => {
        setWaiting(true);
        const r = await messenger.poster({ method: 'POST', url: BASE + '/mensajes/consultar', value: { status: filtros.status || undefined, busqueda: filtros.busqueda || undefined, limit: 100 } });
        setMensajes(r.rows || []);
        setTotal(r.total || 0);
        setWaiting(false);
    };

    useEffect(() => { cargarEmisores(); cargarMensajes(); /* eslint-disable-next-line */ }, []);

    const accion = (endpoint, idemisorEncrypted, confirmText) => async () => {
        const c = await swal.fire({ title: confirmText, icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, continuar', cancelButtonText: 'Cancelar' });
        if (!c.isConfirmed) return;
        const r = await messenger.poster({ method: 'POST', url: BASE + endpoint, value: { idemisor: idemisorEncrypted } });
        swal.fire({ title: r.message, icon: parseInt(r.statusCode) === 200 ? 'success' : 'error' });
        await cargarEmisores();
    };

    const columnasEmisores = [
        { header: 'Institución', key: 'institucion' },
        { header: 'Número', key: 'numero' },
        { header: 'Sesión', key: 'estado_sesion', format: (v) => ESTADO_SESION[v] || '—' },
        { header: 'Pendientes', key: 'pendientes' },
        { header: 'Enviados', key: 'enviados' },
        { header: 'Fallidos', key: 'fallidos' },
        {
            button: true,
            cell: (row) => (
                <div className="form-button-action">
                    <ActionButton type="button" icon="tabler:player-pause" title="Pausar cola" onClick={accion('/colas/pausar', row.idregistro, '¿Pausar la cola de este emisor?')} className="btn btn-rounded btn-outline-warning btn-xs me-1" />
                    <ActionButton type="button" icon="tabler:player-play" title="Reanudar cola" onClick={accion('/colas/reanudar', row.idregistro, '¿Reanudar la cola?')} className="btn btn-rounded btn-outline-success btn-xs me-1" />
                    <ActionButton type="button" icon="tabler:player-stop" title="Detener cola" onClick={accion('/colas/detener', row.idregistro, '¿Detener la cola?')} className="btn btn-rounded btn-outline-secondary btn-xs me-1" />
                    <ActionButton type="button" icon="tabler:trash" title="Eliminar cola" onClick={accion('/colas/eliminar', row.idregistro, '¿Eliminar mensajes pendientes?')} className="btn btn-rounded btn-outline-danger btn-xs me-1" />
                    <ActionButton type="button" icon="tabler:circle-off" title="Eliminar emisor" onClick={accion('/emisores/eliminar', row.idregistro, '¿Eliminar el emisor y su sesión?')} className="btn btn-rounded btn-outline-danger btn-xs" />
                </div>
            ),
        },
    ];

    const columnasMensajes = [
        { header: 'Institución', key: 'institucion' },
        { header: 'Destinatario', key: 'destino' },
        { header: 'Tipo', key: 'tipo_nombre' },
        { header: 'Estado', key: 'status' },
        { header: 'Creación', key: 'fecha_creacion' },
        { header: 'Envío', key: 'fecha_envio' },
        { header: 'Intentos', key: 'attempts' },
        { header: 'Error', key: 'last_error' },
    ];

    if (!miUsuario.isLogged) return <Fragment><Forbidden /></Fragment>;

    return (
        <Fragment>
            <div id="elgrapper" className="wrapper">
                <UserHead />
                <div className="main-panel">
                    <div className="content">
                        <div className="page-inner">
                            <TituloPagina icon="tabler:brand-whatsapp">WhatsApp — Administración global</TituloPagina>

                            <div className="card mt-3">
                                <div className="card-header"><h4 className="card-title">Emisores</h4></div>
                                <div className="card-body">
                                    <Listado props={{ columns: columnasEmisores, data: emisores }} />
                                </div>
                            </div>

                            <div className="card mt-3">
                                <div className="card-header">
                                    <h4 className="card-title">Mensajes ({total})</h4>
                                    <div className="d-flex ms-auto gap-2">
                                        <input className="form-control form-control-sm" placeholder="Buscar destino/emisor" value={filtros.busqueda} onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })} />
                                        <ActionButton icon="tabler:search" className="btn btn-sm btn-primary" onClick={cargarMensajes}>Filtrar</ActionButton>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <Listado props={{ columns: columnasMensajes, data: mensajes }} />
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

export { ESTADO_SESION };
