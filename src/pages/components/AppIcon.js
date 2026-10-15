import { Icon } from '@iconify/react';

/**
 * AppIcon — icono unificado del frontend.
 *
 * Acepta dos formas:
 *  - Iconify: `icon="tabler:home"` o `icon="twemoji:school"` (SVG on-demand).
 *  - Clase CSS heredada de Atlantis/Flaticon: `icon="la flaticon-pencil"` →
 *    se renderiza como <i className="app-icon la flaticon-pencil" />.
 *
 * El tamaño se controla por CSS (`font-size`); `size` permite forzarlo puntualmente.
 */
const esIconify = (n) => typeof n === 'string' && n.indexOf(':') > 0;

export default function AppIcon({ icon, className = '', size, style, ...rest }) {
    if (!esIconify(icon)) {
        // Icono basado en clase CSS (Atlantis/Flaticon/…): la clase del icono va en el className.
        const clases = `app-icon ${icon || ''} ${className}`.trim();
        return <i className={clases} style={style} aria-hidden="true" {...rest}></i>;
    }

    return (
        <Icon
            icon={icon}
            className={`app-icon ${className}`.trim()}
            width={size}
            height={size}
            style={style}
            aria-hidden="true"
            inline
            {...rest}
        />
    );
}
