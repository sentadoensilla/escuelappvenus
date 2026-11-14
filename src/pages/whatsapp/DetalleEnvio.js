import { Fragment, useEffect } from 'react';
import EstadoBadge, { ESTADO_BADGE } from './estadoBadge';

// Fecha/hora legible (ISO → local es-CO).
const fechaHora = (v) => {
    if (!v) return '—';
    const d = new Date(v);
    if (isNaN(d.getTime())) return String(v).slice(0, 16).replace('T', ' ');
    return d.toLocaleString('es-CO', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
};

const hora = (v) => {
    if (!v) return '';
    const d = new Date(v);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};

const parseJson = (v, fallback = null) => {
    if (v == null) return fallback;
    if (typeof v === 'object') return v;
    try { return JSON.parse(v); } catch (e) { return fallback; }
};

// Interpreta el formato de WhatsApp: *negrita*, _cursiva_, ~tachado~, ```mono``` y URLs.
function renderWhatsApp(texto) {
    const patron = /(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~|```[^`]+```|https?:\/\/[^\s]+)/g;
    return String(texto || '').split(patron).map((parte, i) => {
        if (!parte) return null;
        if (/^\*[^*\n]+\*$/.test(parte)) return <strong key={i}>{parte.slice(1, -1)}</strong>;
        if (/^_[^_\n]+_$/.test(parte)) return <em key={i}>{parte.slice(1, -1)}</em>;
        if (/^~[^~\n]+~$/.test(parte)) return <del key={i}>{parte.slice(1, -1)}</del>;
        if (/^```[^`]+```$/.test(parte)) return <code key={i}>{parte.slice(3, -3)}</code>;
        if (/^https?:\/\/[^\s]+$/.test(parte)) {
            return <a key={i} href={parte} target="_blank" rel="noreferrer">{parte}</a>;
        }
        return <Fragment key={i}>{parte}</Fragment>;
    });
}

export function VistaPreviaWhatsApp({ envio }) {
    const payload = parseJson(envio?.payload, {}) || {};
    const texto = payload.text || payload.caption || '';
    const fallido = envio?.status === 'failed';
    const enviado = envio?.status === 'sent';

    return (
        <div
            style={{
                background: '#e5ddd5',
                borderRadius: 12,
                padding: 16,
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
            }}
        >
            <div
                style={{
                    marginLeft: 'auto',
                    maxWidth: '88%',
                    background: '#d9fdd3',
                    borderRadius: 10,
                    padding: '8px 10px',
                    boxShadow: '0 1px 1px rgba(0,0,0,.18)',
                    wordBreak: 'break-word',
                }}
            >
                {payload.imageUrl && (
                    <img src={payload.imageUrl} alt="Adjunto"
                        style={{ maxWidth: '100%', borderRadius: 6, marginBottom: 6, display: 'block' }} />
                )}
                {payload.videoUrl && (
                    <video src={payload.videoUrl} controls
                        style={{ maxWidth: '100%', borderRadius: 6, marginBottom: 6, display: 'block' }} />
                )}
                {payload.audioUrl && (
                    <audio src={payload.audioUrl} controls style={{ width: '100%', marginBottom: 6 }} />
                )}

                {texto ? (
                    <div style={{ whiteSpace: 'pre-wrap', color: '#111b21', fontSize: 14, lineHeight: 1.35 }}>
                        {renderWhatsApp(texto)}
                    </div>
                ) : (
                    <div className="text-muted small">Sin texto</div>
                )}

                <div style={{ textAlign: 'right', fontSize: 11, color: '#667781', marginTop: 4 }}>
                    {hora(envio?.fecha_envio || envio?.fecha_creacion)}
                    {enviado && <span style={{ marginLeft: 4, color: '#53bdeb' }}>✓✓</span>}
                    {fallido && <span style={{ marginLeft: 4, color: '#d9534f' }}>⚠</span>}
                </div>
            </div>

            {fallido && (
                <div className="text-danger small mt-2" style={{ wordBreak: 'break-word' }}>
                    <strong>No entregado:</strong> {envio?.last_error || 'sin detalle'}
                </div>
            )}
        </div>
    );
}

export default function DetalleEnvioModal({ envio, onClose }) {
    useEffect(() => {
        if (!envio) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.classList.add('modal-open');
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.classList.remove('modal-open');
        };
    }, [envio, onClose]);

    if (!envio) return null;

    const payload = parseJson(envio.payload, {}) || {};
    const detalles = parseJson(envio.enviosdetalles, {}) || {};
    const estado = ESTADO_BADGE[envio.status] || { clase: 'text-bg-secondary', texto: envio.status || '—' };

    const filas = [
        ['ID de envío', envio.idlogenvios],
        ['Institución', envio.institucion || envio.idempresa],
        ['Destinatario', envio.persona_nombre || '—'],
        ['Teléfono', envio.destino || '—'],
        ['Grupo', envio.grupo || '—'],
        ['Envío real', envio.destino_efectivo || envio.destino || '—'],
        ['Tipo', envio.tipo_nombre || envio.type || '—'],
        ['Creado', fechaHora(envio.fecha_creacion)],
        ['Actualizado', fechaHora(envio.fecha_envio)],
        ['Intentos', envio.attempts ?? 0],
        ['Referencia', envio.idreferencia ?? 0],
        ['Emisor', envio.emisor || '—'],
        ['LID', envio.lid || '—'],
        ['ID WhatsApp', detalles.wa_message_id || '—'],
        ['Sesión', detalles.sessionId || '—'],
        ['ACK', detalles.ack ?? '—'],
    ];

    return (
        <Fragment>
            <div className="modal fade show d-block" tabIndex={-1} role="dialog"
                aria-modal="true" onClick={onClose}>
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
                    role="document" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content" style={{ borderTop: `4px solid ${
                        envio.status === 'sent' ? '#198754'
                        : envio.status === 'failed' ? '#dc3545'
                        : '#ffc107'}` }}>
                        <div className="modal-header">
                            <h5 className="modal-title d-flex align-items-center gap-2">
                                Detalle del envío #{envio.idlogenvios}
                                <EstadoBadge estado={envio.status} error={envio.last_error} />
                            </h5>
                            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
                        </div>

                        <div className="modal-body">
                            <div className="row g-4">
                                <div className="col-lg-6">
                                    <h6 className="text-muted mb-2">Vista previa en WhatsApp</h6>
                                    <VistaPreviaWhatsApp envio={envio} />
                                </div>

                                <div className="col-lg-6">
                                    <h6 className="text-muted mb-2">Datos del envío</h6>
                                    <div className="table-responsive">
                                        <table className="table table-sm table-borderless mb-3">
                                            <tbody>
                                                {filas.map(([k, v]) => (
                                                    <tr key={k}>
                                                        <th className="text-muted fw-normal" style={{ width: '42%' }}>{k}</th>
                                                        <td style={{ wordBreak: 'break-word' }}>{String(v)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mb-2">
                                        <span className="text-muted">Estado: </span>
                                        <span className={`badge ${estado.clase}`}>{estado.texto}</span>
                                    </div>

                                    {envio.status === 'failed' && (
                                        <div className="alert alert-danger py-2 mb-3" style={{ wordBreak: 'break-word' }}>
                                            <strong>Error:</strong> {envio.last_error || 'sin detalle'}
                                        </div>
                                    )}

                                    <details>
                                        <summary className="text-muted" style={{ cursor: 'pointer' }}>Ver payload (JSON)</summary>
                                        <pre className="bg-light p-2 rounded mt-2" style={{ fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {JSON.stringify(payload, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" />
        </Fragment>
    );
}
