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

const BASE = myConst.roots.engine + '/whatsapp';
const ESTADO_SESION = { 1: 'Esperando QR', 2: 'QR generado', 3: 'Escaneando', 4: 'Conectado', 5: 'Desconectado', 6: 'Cerrado', 7: 'Error' };
const ESTADOS_COLA = ['pending', 'queued', 'sending', 'sent', 'failed', 'cancelled'];

export default function WhatsappInstitucion() {
    const { setWaiting } = useContext(UserContext);
    const miUsuario = tool.getUser();

    const [emisor, setEmisor] = useState(null);
    const [elQR, setElQR] = useState('');
    const [elNumero, setElNumero] = useState('');
    const [vinculando, setVinculando] = useState(false);
    const [mensajes, setMensajes] = useState([]);
    const [total, setTotal] = useState(0);
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

    const columnasMensajes = [
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

                            {emisor && (
                                <div className="card mt-3">
                                    <div className="card-header">
                                        <h4 className="card-title">Emisor: {emisor.numero}</h4>
                                        <span className={`badge ms-auto ${emisor.estado_sesion === 4 ? 'bg-success' : 'bg-warning text-dark'}`}>
                                            {ESTADO_SESION[emisor.estado_sesion] || 'Desconectado'}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex flex-wrap gap-2">
                                            <ActionButton icon="tabler:brand-whatsapp" className="btn btn-success" onClick={cargarQr}>Cargar QR</ActionButton>
                                            <ActionButton icon="tabler:player-pause" className="btn btn-warning" onClick={accion('/colas/pausar', '¿Pausar la cola de mensajes?')}>Pausar cola</ActionButton>
                                            <ActionButton icon="tabler:player-play" className="btn btn-success" onClick={accion('/colas/reanudar', '¿Reanudar la cola?')}>Reanudar cola</ActionButton>
                                            <ActionButton icon="tabler:player-stop" className="btn btn-secondary" onClick={accion('/colas/detener', '¿Detener la cola?')}>Detener cola</ActionButton>
                                            <ActionButton icon="tabler:trash" className="btn btn-danger" onClick={accion('/colas/eliminar', '¿Eliminar los mensajes pendientes?')}>Eliminar cola</ActionButton>
                                            <ActionButton icon="tabler:circle-off" className="btn btn-danger" onClick={accion('/emisores/eliminar', '¿Eliminar el emisor y su sesión?')}>Eliminar emisor</ActionButton>
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
