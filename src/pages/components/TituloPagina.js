import AppIcon from './AppIcon';
import tool from '../../services/tools';

/**
 * TituloPagina — título de los formularios/listados.
 *
 * Muestra el texto en color rojo acompañado del icono del menú/submenú que
 * invocó la ruta (resuelto por `tool.iconoDeRuta()`), con el mismo tamaño y color
 * que el título. Se puede forzar un icono con la prop `icon`.
 */
export default function TituloPagina({ children, icon, className = '' }) {
    const elIcono = icon || tool.iconoDeRuta();
    return (
        <h4 className={`card-title titulo-pagina ${className}`.trim()}>
            {elIcono ? <AppIcon icon={elIcono} className="titulo-pagina-icono" /> : null}
            <span>{children}</span>
        </h4>
    );
}
