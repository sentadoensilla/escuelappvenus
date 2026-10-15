import { useCallback, useState } from 'react';

/**
 * useAction — envuelve una función async y expone su estado de carga.
 * Útil cuando la acción no usa <ActionButton/> (p. ej. botones `<Link/>`, submit
 * de formulario, o acciones disparadas desde tablas/swal).
 *
 *   const [guardar, guardando] = useAction(async () => { await messenger.poster(...) });
 *   <ActionButton type="submit" loading={guardando} icon="tabler:device-floppy">Guardar</ActionButton>
 */
export default function useAction(fn) {
    const [loading, setLoading] = useState(false);

    const run = useCallback(async (...args) => {
        try {
            setLoading(true);
            return await fn(...args);
        } finally {
            setLoading(false);
        }
    }, [fn]);

    return [run, loading];
}
