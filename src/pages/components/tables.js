
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';

/**
 * Barra de búsqueda del listado.
 * Sólo se dibuja cuando la página que usa <Listado/> envía props.filter=true.
 */
function FiltroListado({ value, onChange, onClear, placeholder }) {
    return (
        <div className="d-flex align-items-center ml-auto">
            <input
                type="search"
                className="form-control form-control-sm"
                style={{ minWidth: '220px' }}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Buscar en el listado"
            />
            <button
                type="button"
                className="btn btn-sm btn-outline-secondary ml-1"
                onClick={onClear}
                disabled={!value}
                title="Limpiar la búsqueda"
            >
                Limpiar
            </button>
        </div>
    );
}

export default function Listado({props}){
    const pagOpt = props.pagOpt || {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: true,
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos'
    };
    // Los dashboards pueden pasar props incompletas (p.ej. cuando la API
    // responde error con rows: {}). Nunca asumir que data es un arreglo.
    const data = Array.isArray(props.data) ? props.data : [];
    const columns = Array.isArray(props.columns) ? props.columns : [];

    // Filtro opcional: búsqueda en vivo sobre todas las columnas de datos.
    const conFiltro = props.filter === true;
    const [filtro, setFiltro] = useState('');

    // Texto plano de un registro (para poder buscar en cualquier columna).
    const textoDeFila = (fila) => {
        if (fila === null || fila === undefined) return '';
        if (typeof fila !== 'object') return String(fila);
        return Object.keys(fila)
            .map((llave) => {
                const valor = fila[llave];
                if (valor === null || valor === undefined) return '';
                if (typeof valor === 'object') return '';
                return String(valor);
            })
            .join(' ')
            .toLowerCase();
    };

    // Sólo se calcula el subconjunto cuando el filtro está activo y tiene texto.
    const dataFiltrada = useMemo(() => {
        if (!conFiltro) return data;
        const busqueda = filtro.trim().toLowerCase();
        if (busqueda === '') return data;
        const criterio = (typeof props.onFilter === 'function')
            ? props.onFilter
            : ((fila) => textoDeFila(fila).includes(busqueda));
        return data.filter((fila) => criterio(fila, busqueda));
        // eslint-disable-next-line
    }, [data, filtro, conFiltro]);

    const hayBusqueda = conFiltro && filtro.trim() !== '';

    if(data.length > 0){
        return ( 
            <div>
                <DataTable 
                    columns={columns}
                    data={hayBusqueda ? dataFiltrada : data}
                    responsive={true}
                    striped={true}
                    highlightOnHover
                    pagination={pagOpt}
                    {...(conFiltro ? {
                        subHeader: true,
                        subHeaderWrap: true,
                        subHeaderComponent: (
                            <FiltroListado
                                value={filtro}
                                onChange={setFiltro}
                                onClear={() => setFiltro('')}
                                placeholder={props.filterPlaceholder || 'Buscar…'}
                            />
                        )
                    } : {})}
                />
                { hayBusqueda &&
                    <div className="text-muted small mt-1">
                        { dataFiltrada.length } de { data.length } registro(s) para «{ filtro.trim() }»
                    </div>
                }
                { hayBusqueda && dataFiltrada.length === 0 &&
                    <div><h2 className='text-center text-danger'>Sin coincidencias</h2></div>
                }
                {
                    (props.link)?
                        <div className="text-right">
                            <Link className='btn btn-success' to={props.link}>Más...</Link>
                        </div>
                    :
                    ""
                }
            </div>
        )
    }else{
        return (
            <div>
                <h2 className='text-center text-danger'>Sin datos</h2>
            </div>
        )
    }
}
