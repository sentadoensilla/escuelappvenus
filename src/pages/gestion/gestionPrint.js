import { Fragment, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';
import CRUD from '../../main/crudConfig';

import DataTable from 'react-data-table-component';
import AppIcon from '../components/AppIcon';


/**
 * gestionPrint: listado imprimible genérico (sin botones de acción) de una
 * entidad del CRUD. Se abre en OTRA PESTAÑA desde el botón PDF del listado
 * (sólo para las entidades con `print: true` en crudConfig.js).
 *
 * Estructura homóloga a pages/asignaturas/asignaturasPrint.js: carga el listado,
 * lo pinta sin acciones y abre el diálogo de impresión para guardarlo como PDF.
 */
export default function GestionPrint() {
    const { entidad } = useParams();
    const config = CRUD[entidad];
    // eslint-disable-next-line
    const { waiting, setWaiting } = useContext(UserContext);

    const [listado, setListado] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [imprimiendo, setImprimiendo] = useState(false);
    const [fecha] = useState(tool.dateNow());
    const dosDigitos = (valor) => String(valor).padStart(2, '0');

    const miUsuario = tool.getUser();

    // Columnas de datos únicamente (sin la columna de acciones).
    const columnas = (config ? config.columns : []).map((c) => ({
        name: c.header,
        selector: (row) => (typeof c.format === 'function' ? c.format(row[c.key], row) : row[c.key]),
        sortable: true,
        minWidth: c.width || '160px',
        wrap: true,
    }));

    useEffect(() => {
        if (!config) { setCargando(false); return; }
        setWaiting(() => true);
        messenger.poster({
            method: 'POST',
            url: myConst.roots.engine + config.endpoints.listar,
            value: {},
        }).then((resultado) => {
            setListado(Array.isArray(resultado.rows) ? resultado.rows : []);
        }).catch(() => {
            setListado([]);
        }).finally(() => {
            setCargando(false);
            setWaiting(() => false);
        });
        // eslint-disable-next-line
    }, [entidad]);

    useEffect(() => {
        if (cargando || imprimiendo) return;
        document.body.classList.add('modo-impresion');
        // Dejar que la tabla pinte y abrir el diálogo de impresión (Guardar como PDF).
        const elReloj = setTimeout(() => {
            setImprimiendo(true);
            try {
                window.print();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log('No se pudo abrir el diálogo de impresión: ', error);
            }
        }, 600);
        return () => clearTimeout(elReloj);
    }, [cargando, imprimiendo]);

    const imprimirDeNuevo = () => {
        window.print();
    };

    if (!miUsuario.isLogged) {
        return <Fragment><h2 className="text-center text-danger mt-5">Sesión no válida</h2></Fragment>;
    }

    if (!config) {
        return <Fragment><h2 className="text-center text-danger mt-5">Entidad no reconocida: {entidad}</h2></Fragment>;
    }

    return (
        <Fragment>
            <div className="container-fluid p-4" id="reporte-impresion">
                <div className="text-center mb-3">
                    <img src={myConst.essentials.logo} alt="logo" className="mb-2" style={{ height: '70px' }} />
                    <h3 className="mb-0">Listado de {config.titulo}</h3>
                    <small className="text-muted">
                        {miUsuario.usuarioInstitucionNombre || ''}
                    </small>
                    <div>
                        <small className="text-muted">
                            Listado de {config.titulo} &nbsp;·&nbsp; Generado el {fecha.date} a las {dosDigitos(fecha.hour)}:{dosDigitos(fecha.minute)}
                        </small>
                    </div>
                </div>

                {cargando
                    ? <div><h2 className="text-center text-danger">Cargando {config.titulo}…</h2></div>
                    : (listado.length > 0)
                        ? (
                            <DataTable
                                columns={columnas}
                                data={listado}
                                striped={true}
                                noHeader={true}
                                pagination={false}
                                responsive={false}
                            />
                        )
                        : <div><h2 className="text-center text-danger">Sin datos que mostrar</h2></div>}

                <div className="text-center mt-3 no-print">
                    <button type="button" className="btn btn-primary btn-round" onClick={imprimirDeNuevo}>
                        <AppIcon icon="tabler:file-type-pdf" /> Guardar como PDF
                    </button>
                    <Link to={`/gestion/${entidad}`} className="btn btn-border btn-light btn-round ms-1">
                        <AppIcon icon="la flaticon-list" /> Volver al listado
                    </Link>
                </div>
            </div>
        </Fragment>
    );
}
