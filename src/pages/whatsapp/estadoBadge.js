import { Fragment } from 'react';

/**
 * Semáforo de estados de la cola de mensajes.
 * verde = enviado · ámbar = en proceso · rojo = fallido · gris = cancelado
 */
export const ESTADO_BADGE = {
    sent: { clase: 'text-bg-success', texto: 'Enviado' },
    failed: { clase: 'text-bg-danger', texto: 'Fallido' },
    pending: { clase: 'text-bg-warning', texto: 'Pendiente' },
    queued: { clase: 'text-bg-warning', texto: 'En cola' },
    sending: { clase: 'text-bg-warning', texto: 'Enviando' },
    cancelled: { clase: 'text-bg-secondary', texto: 'Cancelado' },
};

export default function EstadoBadge({ estado }) {
    const e = ESTADO_BADGE[estado] || { clase: 'text-bg-secondary', texto: estado || '—' };
    return (
        <Fragment>
            <span className={`badge ${e.clase}`}>{e.texto}</span>
        </Fragment>
    );
}
