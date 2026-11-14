import { Fragment } from 'react';

/**
 * Semáforo de estados de la cola de mensajes.
 * verde = enviado · ámbar = en proceso · rojo = fallido · gris = cancelado
 *
 * Si el estado es 'failed', el error se muestra como tooltip al pasar el mouse
 * por el badge (no como columna aparte).
 */
export const ESTADO_BADGE = {
    sent: { clase: 'text-bg-success', texto: 'Enviado' },
    failed: { clase: 'text-bg-danger', texto: 'Fallido' },
    pending: { clase: 'text-bg-warning', texto: 'Pendiente' },
    queued: { clase: 'text-bg-warning', texto: 'En cola' },
    sending: { clase: 'text-bg-warning', texto: 'Enviando' },
    cancelled: { clase: 'text-bg-secondary', texto: 'Cancelado' },
};

export default function EstadoBadge({ estado, error }) {
    const e = ESTADO_BADGE[estado] || { clase: 'text-bg-secondary', texto: estado || '—' };
    const detalle = estado === 'failed' && error ? String(error) : '';
    return (
        <Fragment>
            <span
                className={`badge ${e.clase}`}
                title={detalle || undefined}
                style={detalle ? { cursor: 'help' } : undefined}
            >
                {e.texto}
            </span>
        </Fragment>
    );
}
