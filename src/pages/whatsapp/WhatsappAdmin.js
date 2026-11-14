import { Fragment, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import EstadoBadge from './estadoBadge';
import DetalleEnvioModal from './DetalleEnvio';

const BASE = myConst.roots.engine + '/whatsapp';

const ESTADO_SESION = { 1: 'Esperando QR', 2: 'QR generado', 3: 'Escaneando', 4: 'Conectado', 5: 'Desconectado', 6: 'Cerrado', 7: 'Error' };

export default function WhatsappAdmin() {
    const { setWaiting } = useContext(UserContext);
    const miUsuario = tool.getUser();
    const [emisores, setEmisores] = useState([]);
    const [mensajes, setMensajes] = useState([]);
    const [total, setTotal] = useState(0);
    const [filtros, setFiltros] = useState({ status: '', busqueda: '' });
    const [emisorSel, setEmisorSel] = useState('');
    const [config, setConfig] = useState(null);
    const [institucionesLista, setInstitucionesLista] = useState([]);
    const [msgInstituciones, setMsgInstituciones] = useState('');
    const [detalle, setDetalle] = useState(null);
    const [selInstituciones, setSelInstituciones] = useState([]);
    const { register, handleSubmit, reset } = useForm();

    const cargarInstituciones = async () => {
        const r = await messenger.poster({ method: 'POST', url: BASE + '/instituciones', value: {} });
        setInstitucionesLista(r.rows || []);
    };

    const notificarInstituciones = async () => {
        if (!msgInstituciones.trim()) return swal.fire({ title: 'Escribe el mensaje', icon: 'warning' });
        const c = await swal.fire({
            title: '¿Enviar la notificación?',
            text: selInstituciones.length ? `A ${selInstituciones.length} institución(es)` : 'A TODAS las instituciones',
            icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, enviar', cancelButtonText: 'Cancelar',
        });
        if (!c.isConfirmed) return;
        setWaiting(true);
        const r = await messenger.poster({
            method: 'POST', url: BASE + '/notificar',
            value: {
                audiencia: { tipo: 'instituciones', ids: selInstituciones },
                tipo: 1,
                payload: { text: msgInstituciones },
            },
        });
        setWaiting(false);
        swal.fire({ title: r.message, icon: parseInt(r.statusCode) === 200 ? 'success' : 'error' });
    };

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

    const cargarConfig = async (idemisor) => {
        if (!idemisor) return;
        setWaiting(true);
        const r = await messenger.poster({ method: 'POST', url: BASE + '/config/consultar', value: { idemisor } });
        if (r.rows && r.rows[0]) {
            setConfig(r.rows[0]);
            reset({
                base_delay: r.rows[0].base_delay,
                jitter: r.rows[0].jitter,
                burst_limit: r.rows[0].burst_limit,
                burst_pause: r.rows[0].burst_pause,
                concurrency: r.rows[0].concurrency,
                modo_prueba: r.rows[0].modo_prueba ? 'true' : 'false',
                test_phone: r.rows[0].test_phone || '',
            });
        }
        setWaiting(false);
    };

    const guardarConfig = async (datos) => {
        if (!emisorSel) return;
        setWaiting(true);
        const r = await messenger.poster({
            method: 'POST', url: BASE + '/config/actualizar',
            value: {
                idemisor: emisorSel,
                base_delay: parseInt(datos.base_delay) || 700,
                jitter: parseInt(datos.jitter) || 400,
                burst_limit: parseInt(datos.burst_limit) || 5,
                burst_pause: parseInt(datos.burst_pause) || 3000,
                concurrency: parseInt(datos.concurrency) || 1,
                modo_prueba: datos.modo_prueba === 'true',
                test_phone: datos.test_phone || null,
            },
        });
        swal.fire({ title: r.message, icon: parseInt(r.statusCode) === 200 ? 'success' : 'error' });
        setWaiting(false);
    };

    useEffect(() => { cargarEmisores(); cargarMensajes(); cargarInstituciones(); /* eslint-disable-next-line */ }, []);

    const accion = (endpoint, idemisorEncrypted, confirmText) => async () => {
        const c = await swal.fire({ title: confirmText, icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, continuar', cancelButtonText: 'Cancelar' });
        if (!c.isConfirmed) return;
        const r = await messenger.poster({ method: 'POST', url: BASE + endpoint, value: { idemisor: idemisorEncrypted } });
        swal.fire({ title: r.message, icon: parseInt(r.statusCode) === 200 ? 'success' : 'error' });
        await cargarEmisores();
    };

    // react-data-table-component v7 espera { name, selector }; con { header, key }
    // la grilla pinta las filas pero sin encabezados ni celdas visibles.
    const fechaCorta = (v) => (v ? String(v).slice(0, 16).replace('T', ' ') : '—');
    const columnasEmisores = [
        { name: 'Institución', selector: (row) => row.institucion, sortable: true, wrap: true },
        { name: 'Número', selector: (row) => row.numero, sortable: true },
        { name: 'Sesión', selector: (row) => row.estado_sesion, format: (row) => ESTADO_SESION[row.estado_sesion] || '—', sortable: true },
        { name: 'Pendientes', selector: (row) => row.pendientes, sortable: true },
        { name: 'Enviados', selector: (row) => row.enviados, sortable: true },
        { name: 'Fallidos', selector: (row) => row.fallidos, sortable: true },
        {
            name: 'Acciones',
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
        { name: 'Institución', selector: (row) => row.institucion, sortable: true, wrap: true },
        {
            name: 'Destinatario',
            selector: (row) => `${row.persona_nombre || ''} ${row.destino || ''} ${row.grupo || ''}`,
            cell: (row) => (
                <div>
                    <div className="fw-bold">{row.persona_nombre || '—'}</div>
                    <div className="small text-muted">
                        {row.destino || '—'}{row.grupo ? ` · Grupo ${row.grupo}` : ''}
                    </div>
                </div>
            ),
            sortable: true, wrap: true,
        },
        { name: 'Envío real', selector: (row) => row.destino_efectivo || row.destino, sortable: true, wrap: true },
        { name: 'Tipo', selector: (row) => row.tipo_nombre || row.type, sortable: true },
        { name: 'Estado', selector: (row) => row.status, cell: (row) => <EstadoBadge estado={row.status} error={row.last_error} />, sortable: true },
        { name: 'Creación', selector: (row) => row.fecha_creacion, format: (row) => fechaCorta(row.fecha_creacion), sortable: true },
        { name: 'Envío', selector: (row) => row.fecha_envio, format: (row) => fechaCorta(row.fecha_envio), sortable: true },
        { name: 'Intentos', selector: (row) => row.attempts, sortable: true },
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
                                <div className="card-header"><h4 className="card-title">Configuración de envío (velocidad y modo de pruebas)</h4></div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label>Emisor:</label>
                                        <select className="form-control" value={emisorSel} onChange={(e) => { setEmisorSel(e.target.value); cargarConfig(e.target.value); }}>
                                            <option value="">Seleccione un emisor…</option>
                                            {emisores.map((e) => <option key={e.idregistro} value={e.idregistro}>{e.institucion || e.numero} — {e.numero}</option>)}
                                        </select>
                                    </div>
                                    {config && (
                                        <form onSubmit={handleSubmit(guardarConfig)} className="row mt-3">
                                            <div className="col-6 col-md-3 form-group">
                                                <label>Base delay (ms)</label>
                                                <input type="number" className="form-control" {...register('base_delay')} />
                                            </div>
                                            <div className="col-6 col-md-3 form-group">
                                                <label>Jitter (ms)</label>
                                                <input type="number" className="form-control" {...register('jitter')} />
                                            </div>
                                            <div className="col-6 col-md-3 form-group">
                                                <label>Burst límite</label>
                                                <input type="number" className="form-control" {...register('burst_limit')} />
                                            </div>
                                            <div className="col-6 col-md-3 form-group">
                                                <label>Burst pausa (ms)</label>
                                                <input type="number" className="form-control" {...register('burst_pause')} />
                                            </div>
                                            <div className="col-6 col-md-3 form-group">
                                                <label>Concurrencia</label>
                                                <input type="number" className="form-control" {...register('concurrency')} />
                                            </div>
                                            <div className="col-6 col-md-3 form-group">
                                                <label>Modo de pruebas</label>
                                                <select className="form-control" {...register('modo_prueba')}>
                                                    <option value="false">No</option>
                                                    <option value="true">Sí</option>
                                                </select>
                                            </div>
                                            <div className="col-6 col-md-3 form-group">
                                                <label>Número de pruebas</label>
                                                <input className="form-control" placeholder="573001234567" {...register('test_phone')} />
                                            </div>
                                            <div className="col-12 mt-3">
                                                <ActionButton type="submit" icon="tabler:device-floppy" className="btn btn-primary">Guardar configuración</ActionButton>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>

                            <div className="card mt-3">
                                <div className="card-header"><h4 className="card-title">Notificar a instituciones (mantenimiento, pagos, avisos)</h4></div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label>Mensaje:</label>
                                        <textarea className="form-control" rows={3}
                                            value={msgInstituciones}
                                            onChange={(e) => setMsgInstituciones(e.target.value)}
                                            placeholder="Texto a enviar al contacto institucional (rector)…" />
                                    </div>
                                    <div className="form-group">
                                        <label>Destinatarios:</label>
                                        <select multiple className="form-select" size={6}
                                            value={selInstituciones.map(String)}
                                            onChange={(e) => setSelInstituciones(Array.from(e.target.selectedOptions).map((o) => parseInt(o.value)))}>
                                            {institucionesLista.map((i) => (
                                                <option key={i.cinstid} value={i.cinstid}>{i.nombre} — {i.telefono}</option>
                                            ))}
                                        </select>
                                        <small className="text-muted">Sin selección = todas las instituciones con emisor.</small>
                                    </div>
                                    <ActionButton icon="tabler:send" className="btn btn-primary" onClick={notificarInstituciones}>Enviar notificación</ActionButton>
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
                                    <Listado props={{
                                        columns: columnasMensajes,
                                        data: mensajes,
                                        onRowClicked: (row) => setDetalle(row),
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Foot />
                </div>
            </div>

            <DetalleEnvioModal envio={detalle} onClose={() => setDetalle(null)} />
        </Fragment>
    );
}

export { ESTADO_SESION };
