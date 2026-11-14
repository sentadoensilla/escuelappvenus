import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import swal from 'sweetalert2';
import QRCode from 'react-qr-code';

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
import { SparklineCard } from '../components/sparklineStats';
import EstadoBadge from './estadoBadge';
import DetalleEnvioModal from './DetalleEnvio';

const BASE = myConst.roots.engine + '/whatsapp';
const ESTADO_SESION = { 1: 'Esperando QR', 2: 'QR generado', 3: 'Escaneando', 4: 'Conectado', 5: 'Desconectado', 6: 'Cerrado', 7: 'Error' };
const ESTADOS_COLA = ['pending', 'queued', 'sending', 'sent', 'failed', 'cancelled'];
// Color de la burbuja del icono (Atlantis: icon-*) según el estado de la sesión.
const iconoEstado = (estado) => {
    if (estado === 4) return 'icon-success';
    if (estado === 1 || estado === 2 || estado === 3) return 'icon-info';
    return 'icon-secondary';
};

export default function WhatsappInstitucion() {
    const { setWaiting } = useContext(UserContext);
    const miUsuario = tool.getUser();

    const [emisor, setEmisor] = useState(null);
    const [elQR, setElQR] = useState('');
    const [elNumero, setElNumero] = useState('');
    const [vinculando, setVinculando] = useState(false);
    const [mensajes, setMensajes] = useState([]);
    const [estadisticas, setEstadisticas] = useState([]);
    const dias = 14;
    const [total, setTotal] = useState(0);
    const [msgComunicado, setMsgComunicado] = useState('');
    const [detalle, setDetalle] = useState(null);
    const [filtros, setFiltros] = useState({ busqueda: '', status: '', desde: '', hasta: '' });
    const timerRef = useRef(null);

    const cargarMensajes = async (f = filtros) => {
        const r = await messenger.poster({
            method: 'POST', url: BASE + '/mensajes/consultar',
            value: {
                busqueda: f.busqueda || undefined,
                status: f.status || undefined,
                desde: f.desde || undefined,
                hasta: f.hasta || undefined,
                limit: 200,
            },
        });
        setMensajes(r.rows || []);
        setTotal(r.total || 0);
    };

    const cargar = async () => {
        setWaiting(true);
        const e = await messenger.poster({ method: 'POST', url: BASE + '/emisores/listar', value: {} });
        setEmisor((e.rows || [])[0] || null);
        const st = await messenger.poster({ method: 'POST', url: BASE + '/mensajes/estadisticas', value: { dias } });
        setEstadisticas(st.rows || []);
        await cargarMensajes();
        setWaiting(false);
    };

    useEffect(() => {
        cargar();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
        // eslint-disable-next-line
    }, []);

    // Flujo de vinculación (como misvotos): vincular → iniciar sesión → QR → confirmar.
    const cargarQr = async () => {
        const numero = String(elNumero).replace(/\D/g, '');
        if (numero.length < 10) {
            return swal.fire({ title: 'Número incorrecto', text: 'Debe ser un número de WhatsApp de 10 o más dígitos', icon: 'warning' });
        }
        setWaiting(true);

        // 1) Registrar el emisor para la institución.
        const v = await messenger.poster({ method: 'POST', url: BASE + '/emisores/vincular', value: { numero } });
        if (parseInt(v.statusCode) !== 200) {
            setWaiting(false);
            return swal.fire({ title: v.message, icon: 'error' });
        }

        // 2) Iniciar (crear o recuperar) la sesión Baileys en apibaileys.
        const s = await messenger.poster({ method: 'POST', url: BASE + '/emisores/sesion/iniciar', value: {} });
        if (parseInt(s.statusCode) !== 200) {
            setWaiting(false);
            return swal.fire({ title: s.message, icon: 'error' });
        }

        // 3) Publicar el QR y confirmar el estado.
        setVinculando(true);
        setWaiting(false);

        let intentos = 0;
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(async () => {
            intentos++;
            try {
                const q = await messenger.poster({ method: 'POST', url: BASE + '/emisores/qr', value: {} });
                if (q.rows?.qr) setElQR(q.rows.qr);

                const e = await messenger.poster({ method: 'POST', url: BASE + '/emisores/listar', value: {} });
                const estado = (e.rows || [])[0]?.estado_sesion;

                if (estado === 4) {
                    clearInterval(timerRef.current);
                    setVinculando(false);
                    setElQR('');
                    swal.fire({ title: 'Conectado', text: 'El emisor quedó vinculado y listo para enviar/recibir.', icon: 'success' });
                    await cargar();
                } else if (estado === 6 || estado === 7) {
                    clearInterval(timerRef.current);
                    setVinculando(false);
                    swal.fire({ title: 'No se pudo conectar', text: ESTADO_SESION[estado] || 'Intenta nuevamente.', icon: 'error' });
                    await cargar();
                } else if (intentos > 40) {
                    clearInterval(timerRef.current);
                    setVinculando(false);
                    swal.fire({ title: 'Tiempo agotado', text: 'No se detectó el escaneo del QR. Reintenta.', icon: 'warning' });
                    await cargar();
                }
            } catch (err) {
                clearInterval(timerRef.current);
                setVinculando(false);
            }
        }, 3000);
    };

    const accion = (endpoint, confirmText) => async () => {
        const c = await swal.fire({ title: confirmText, icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'Cancelar' });
        if (!c.isConfirmed) return;
        const r = await messenger.poster({ method: 'POST', url: BASE + endpoint, value: {} });
        swal.fire({ title: r.message, icon: parseInt(r.statusCode) === 200 ? 'success' : 'error' });
        await cargar();
    };

    const notificar = (audienciaTipo, etiqueta) => async () => {
        if (!msgComunicado.trim()) return swal.fire({ title: 'Escribe el mensaje', icon: 'warning' });
        const c = await swal.fire({
            title: `¿Enviar a ${etiqueta}?`, icon: 'warning',
            showCancelButton: true, confirmButtonText: 'Sí, enviar', cancelButtonText: 'Cancelar',
        });
        if (!c.isConfirmed) return;
        let anolectivo = null;
        try { anolectivo = parseInt(tool.decriptar(miUsuario.usuarioAnoId)); } catch (e) { anolectivo = null; }
        setWaiting(true);
        const r = await messenger.poster({
            method: 'POST', url: BASE + '/notificar',
            value: { audiencia: { tipo: audienciaTipo, ids: [] }, tipo: 1, anolectivo, payload: { text: msgComunicado } },
        });
        setWaiting(false);
        swal.fire({ title: r.message, icon: parseInt(r.statusCode) === 200 ? 'success' : 'error' });
    };

    // react-data-table-component v7 espera { name, selector }; con { header, key }
    // la grilla pinta las filas pero sin encabezados ni celdas visibles.
    const fechaCorta = (v) => (v ? String(v).slice(0, 16).replace('T', ' ') : '—');
    const columnasMensajes = [
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

    // Métricas del widget tipo sparkline: total enviado y variación (2ª mitad vs 1ª).
    const totalEnviados = estadisticas.reduce((s, e) => s + (parseInt(e.enviados) || 0), 0);
    const corte = Math.floor(estadisticas.length / 2);
    const primeraMitad = estadisticas.slice(0, corte).reduce((s, e) => s + (parseInt(e.enviados) || 0), 0);
    const segundaMitad = estadisticas.slice(corte).reduce((s, e) => s + (parseInt(e.enviados) || 0), 0);
    const pct = primeraMitad > 0 ? Math.round(((segundaMitad - primeraMitad) / primeraMitad) * 100) : (segundaMitad > 0 ? 100 : 0);
    const deltaEnviados = (pct > 0 ? '+' : '') + pct + '%';

    if (!miUsuario.isLogged) return <Fragment><Forbidden /></Fragment>;

    return (
        <Fragment>
            <div id="elgrapper" className="wrapper">
                <UserHead />
                <div className="main-panel">
                    <div className="content">
                        <div className="page-inner">
                            <TituloPagina icon="tabler:brand-whatsapp">WhatsApp de la institución</TituloPagina>

                            <div className="card mt-3 full-height">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8 px-2 pb-2 pb-md-0">
                                            <ul className="nav nav-pills nav-info" id="pills-tab" role="tablist">
                                                <li className="nav-item">
                                                    <a className="nav-link active" data-bs-toggle="pill" href="#v-pills-init" role="tab">Para empezar</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" data-bs-toggle="pill" href="#v-pills-howmany" role="tab">¿Cuántos mensajes puedo enviar?</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" data-bs-toggle="pill" href="#v-pills-guide" role="tab">Instrucciones</a>
                                                </li>
                                            </ul>
                                            <div className="tab-content mt-2 mb-3">
                                                <div className="tab-pane fade show active" id="v-pills-init" role="tabpanel">
                                                    <p>Aquí puedes conectar la cuenta de WhatsApp Business de tu institución, que se usará como emisor para comunicarse con estudiantes, acudientes y docentes (avisos, asistencias, notas, citaciones y recordatorios).</p>
                                                    <p>Debe ser una cuenta de WhatsApp Business distinta del WhatsApp personal de la institución y configurada con la información institucional.</p>
                                                </div>
                                                <div className="tab-pane fade" id="v-pills-howmany" role="tabpanel">
                                                    <p>WhatsApp maneja límites diarios de mensajes: las cuentas nuevas empiezan con un límite de 1000 destinatarios diarios y pueden ser bloqueadas por envíos agresivos.</p>
                                                    <p>El sistema aplica pausas entre mensajes para respetar esos límites. Consulta los <a rel="noreferrer" href="https://developers.facebook.com/docs/whatsapp/messaging-limits?locale=es_ES" target="_blank">límites de WhatsApp</a> y las <a rel="noreferrer" href="https://www.whatsapp.com/legal/business-terms/" target="_blank">políticas de WhatsApp</a>.</p>
                                                </div>
                                                <div className="tab-pane fade" id="v-pills-guide" role="tabpanel">
                                                    <ol>
                                                        <li>Escribe el número de WhatsApp Business que quieres vincular y pulsa "Cargar QR".</li>
                                                        <li>Escanea el QR desde el smartphone (WhatsApp → Ajustes → Dispositivos vinculados → Vincular un dispositivo).</li>
                                                        <li>Espera unos segundos: el sistema confirma la conexión (o te avisa si no fue posible).</li>
                                                        <li>El teléfono debe permanecer conectado a internet mientras uses el sistema.</li>
                                                    </ol>
                                                    <p>Guardar este contacto en la agenda de la institución mejora la entrega de los mensajes.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 px-2 pb-2 pb-md-0">
                                            <div className="px-2 pb-2 text-center">
                                                {elQR === '' ? (
                                                    <img src={myConst.essentials.qrprime} alt="QR de instrucciones" style={{ width: '220px' }} />
                                                ) : (
                                                    <div>
                                                        <QRCode value={elQR} />
                                                        {vinculando && <h6 className="text-danger mt-2">Escanea y espera la confirmación…</h6>}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <span className="fw-bold mb-1">Número de WhatsApp: </span>
                                                <input type="text" placeholder="3001234567"
                                                    value={elNumero}
                                                    onChange={(e) => setElNumero(e.target.value)}
                                                    style={{ width: '128px', textAlign: 'center' }} />
                                            </div>
                                            <div className="text-center mt-2">
                                                <ActionButton icon="tabler:brand-whatsapp" className="btn btn-success"
                                                    onClick={cargarQr}>
                                                    {vinculando ? 'Conectando…' : 'Cargar QR'}
                                                </ActionButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fila 1: estado del WhatsApp + botones de control de colas */}
                            {emisor && (
                                <div className="row mt-3 align-items-stretch">
                                    <div className="col-sm-6 col-md-3">
                                        <div className="card card-stats card-round h-100">
                                            <div className="card-body">
                                                <div className="row align-items-center g-0">
                                                    <div className="col-5">
                                                        <div className={`icon-big text-center ${iconoEstado(emisor.estado_sesion)} bubble-shadow-small`} style={{ fontSize: '2.6em' }}>
                                                            <AppIcon icon="tabler:brand-whatsapp" />
                                                        </div>
                                                    </div>
                                                    <div className="col-7 col-stats">
                                                        <div className="numbers">
                                                            <p className="card-category">{emisor.numero}</p>
                                                            <h4 className="card-title">{ESTADO_SESION[emisor.estado_sesion] || 'Desconectado'}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-md-9">
                                        <div className="card h-100">
                                            <div className="card-body d-flex flex-wrap gap-2 align-items-center">
                                                <ActionButton icon="tabler:brand-whatsapp" className="btn btn-success" onClick={cargarQr}>Cargar QR</ActionButton>
                                                <ActionButton icon="tabler:player-pause" className="btn btn-warning" onClick={accion('/colas/pausar', '¿Pausar la cola de mensajes?')}>Pausar cola</ActionButton>
                                                <ActionButton icon="tabler:player-play" className="btn btn-success" onClick={accion('/colas/reanudar', '¿Reanudar la cola?')}>Reanudar cola</ActionButton>
                                                <ActionButton icon="tabler:player-stop" className="btn btn-secondary" onClick={accion('/colas/detener', '¿Detener la cola?')}>Detener cola</ActionButton>
                                                <ActionButton icon="tabler:trash" className="btn btn-danger" onClick={accion('/colas/eliminar', '¿Eliminar los mensajes pendientes?')}>Eliminar cola</ActionButton>
                                                <ActionButton icon="tabler:circle-off" className="btn btn-danger" onClick={accion('/emisores/eliminar', '¿Eliminar el emisor y su sesión?')}>Eliminar emisor</ActionButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fila 2: gráfico de mensajes enviados por periodo */}
                            <div className="row mt-3">
                                <div className="col-12">
                                    <SparklineCard
                                        value={totalEnviados}
                                        label={`Mensajes enviados (${dias} días)`}
                                        delta={deltaEnviados}
                                        series={estadisticas.map((e) => parseInt(e.enviados) || 0)}
                                    />
                                </div>
                            </div>

                            {emisor && (
                                <div className="card mt-3">
                                    <div className="card-header"><h4 className="card-title">Comunicaciones masivas</h4></div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label>Mensaje:</label>
                                            <textarea className="form-control" rows={3}
                                                value={msgComunicado}
                                                onChange={(e) => setMsgComunicado(e.target.value)}
                                                placeholder="Texto para docentes o acudientes…" />
                                        </div>
                                        <div className="d-flex flex-wrap gap-2">
                                            <ActionButton icon="tabler:users" className="btn btn-primary"
                                                onClick={notificar('docentes', 'todos los docentes')}>A todos los docentes</ActionButton>
                                            <ActionButton icon="tabler:users-group" className="btn btn-success"
                                                onClick={notificar('todos', 'todos los acudientes (boletines)')}>A todos los acudientes (boletines)</ActionButton>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="card mt-3">
                                <div className="card-header">
                                    <h4 className="card-title">Cola de mensajes ({total})</h4>
                                    <div className="d-flex flex-wrap ms-auto gap-2">
                                        <input className="form-control form-control-sm" style={{ width: 160 }}
                                            placeholder="Destinatario" value={filtros.busqueda}
                                            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })} />
                                        <select className="form-select form-select-sm" style={{ width: 150 }}
                                            value={filtros.status}
                                            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}>
                                            <option value="">Estado: todos</option>
                                            {ESTADOS_COLA.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <input type="date" className="form-control form-control-sm" style={{ width: 150 }}
                                            title="Desde" value={filtros.desde}
                                            onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })} />
                                        <input type="date" className="form-control form-control-sm" style={{ width: 150 }}
                                            title="Hasta" value={filtros.hasta}
                                            onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })} />
                                        <ActionButton icon="tabler:search" className="btn btn-sm btn-primary"
                                            onClick={() => cargarMensajes()}>Filtrar</ActionButton>
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
