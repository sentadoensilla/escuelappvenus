import { useCallback, useState } from 'react';
import AppIcon from './AppIcon';

/**
 * ActionButton — botón con estado de carga (iconos Tabler).
 *
 * Comportamiento:
 *  - Muestra el `icon` relativo a la acción, heredando el color del texto.
 *  - Mientras ejecuta la acción (onClick async), intercambia el icono por un
 *    spinner (`icono` por defecto `tabler:loader-2`), añade `bg-muted` y queda
 *    `disabled`; al terminar vuelve a la normalidad. Evita dobles clics.
 *
 * Al entrar en carga: se cambia el icono de la acción por el de carga (mismo
 * tamaño), se MANTIENE el texto del botón y su tamaño/posición originales; sólo
 * se atenúa el color (bg-muted) y se deshabilita hasta que la acción concluye.
 *
 * Props:
 *  - icon          nombre Iconify de la acción (p. ej. "tabler:device-floppy").
 *  - onClick       handler async (recibe el evento). Si el botón es `type="submit"`,
 *                  no se usa: el formulario maneja el submit y el estado se controla
 *                  con la prop `loading`.
 *  - loading       estado de carga controlado (opcional). Si se pasa, tiene prioridad.
 *  - loadingIcon   icono de carga (por defecto "tabler:loader-2").
 *  - children      texto del botón (se mantiene visible durante la carga).
 *  - className     clases del botón (por defecto "btn btn-primary").
 *  - type          "button" | "submit" | "reset" (por defecto "button").
 */
export default function ActionButton({
    icon,
    onClick,
    loading,
    loadingIcon = 'tabler:loader-2',
    children,
    className = 'btn btn-primary',
    type = 'button',
    disabled = false,
    msIcon = '',
    ...rest
}) {
    const [innerLoading, setInnerLoading] = useState(false);
    const esControlado = typeof loading === 'boolean';
    const cargando = esControlado ? loading : innerLoading;

    const handleClick = useCallback(async (e) => {
        if (type === 'submit') return; // lo maneja el <form onSubmit>
        if (cargando || disabled || typeof onClick !== 'function') return;
        try {
            setInnerLoading(true);
            await onClick(e);
        } finally {
            setInnerLoading(false);
        }
    }, [type, cargando, disabled, onClick]);

    const clases = [className, 'action-btn', cargando ? 'bg-muted' : ''].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            onClick={handleClick}
            className={clases}
            disabled={cargando || disabled}
            aria-busy={cargando}
            {...rest}
        >
            {/* Mismo tamaño de icono (1em) para no alterar tamaño/posición; el texto se mantiene. */}
            {cargando
                ? <AppIcon icon={loadingIcon} className="app-icon-spin" />
                : (icon ? <AppIcon icon={icon} /> : null)}
            {children ? <span className={msIcon}>{children}</span> : children}
        </button>
    );
}
