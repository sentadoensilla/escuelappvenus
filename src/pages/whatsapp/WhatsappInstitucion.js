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

const BASE = myConst.roots.engine + '/whatsapp';
const ESTADO_SESION = { 1: 'Esperando QR', 2: 'QR generado', 3: 'Escaneando', 4: 'Conectado', 5: 'Desconectado', 6: 'Cerrado', 7: 'Error' };

export default function WhatsappInstitucion() {
    const { setWaiting } = useContext(UserContext);
    const miUsuario = tool.getUser();
    const [emisor, setEmisor] = useState(null);
    const [qr, setQr] = useState('');
    const [mensajes, setMensajes] = useState([]);
    const { register, handleSubmit, reset } = useForm();

    const cargar = async () => {
        setWaiting(true);
        const e = await messenger.poster({ method: 'POST', url: BASE + '/emisores/listar', value: {} });
        setEmisor((e.rows || [])[0] || null);
        const m = await messenger.poster({ method: 'POST', url: BASE + '/mensajes/consultar', value: { limit: 100 } });
        setMensajes(m.rows || []);
        setWaiting(false);
    };

    useEffect(() => { cargar(); /* eslint-disable-next-line */ }, []);

    const vincular = async (datos) => {
        setWaiting(true);
        const r = await messenger.poster({ method: 'POST', url: BASE + '/emisores/vincular', value: { numero: datos.numero } });
        swal.fire({ title: r.message, icon: parseInt(r.statusCode) === 200 ? 'success' : 'error' });
        setWaiting(false);
        if (parseInt(r.statusCode) === 200) { reset(); await cargar(); }
    };

    const cargarQr = async () => {
        const r = await messenger.poster({ method: 'POST', url: BASE + '/emisores/qr', value: {} });
        if (r.rows?.qr) setQr(r.rows.qr); else swal.fire({ title: r.message, icon: 'info' });
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

                            {!emisor ? (
                                <div className="card mt-3">
                                    <div className="card-header"><h4 className="card-title">Vincular emisor</h4></div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit(vincular)} className="row">
                                            <div className="col-md-6 form-group">
                                                <label>Número de WhatsApp (emisor):</label>
                                                <input className="form-control" placeholder="3001234567" {...register('numero', { required: true })} />
                                            </div>
                                            <div className="col-12 mt-3">
                                                <ActionButton type="submit" icon="tabler:link" className="btn btn-primary">Vincular emisor</ActionButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="card mt-3">
                                    <div className="card-header">
                                        <h4 className="card-title">Emisor: {emisor.numero}</h4>
                                        <span className="badge ms-auto">{ESTADO_SESION[emisor.estado_sesion] || 'Desconectado'}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex flex-wrap gap-2">
                                            <ActionButton icon="tabler:qr-code" className="btn btn-primary" onClick={cargarQr}>Ver QR</ActionButton>
                                            <ActionButton icon="tabler:player-pause" className="btn btn-warning" onClick={accion('/colas/pausar', '¿Pausar la cola?')}>Pausar</ActionButton>
                                            <ActionButton icon="tabler:player-play" className="btn btn-success" onClick={accion('/colas/reanudar', '¿Reanudar la cola?')}>Reanudar</ActionButton>
                                            <ActionButton icon="tabler:player-stop" className="btn btn-secondary" onClick={accion('/colas/detener', '¿Detener la cola?')}>Detener</ActionButton>
                                            <ActionButton icon="tabler:trash" className="btn btn-danger" onClick={accion('/colas/eliminar', '¿Eliminar mensajes pendientes?')}>Eliminar cola</ActionButton>
                                            <ActionButton icon="tabler:circle-off" className="btn btn-danger" onClick={accion('/emisores/eliminar', '¿Eliminar el emisor y su sesión?')}>Eliminar emisor</ActionButton>
                                        </div>
                                        {qr && <div className="mt-3 text-center"><img src={qr} alt="QR de vinculación" style={{ width: 220 }} /><p className="text-muted mt-2">Escanea con WhatsApp (Dispositivos vinculados)</p></div>}
                                    </div>
                                </div>
                            )}

                            <div className="card mt-3">
                                <div className="card-header"><h4 className="card-title">Mensajes de la institución</h4></div>
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
