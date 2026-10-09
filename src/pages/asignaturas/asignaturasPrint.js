import { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../../services/context/UserContext';
import { privateRoutes } from '../../services/routes';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';

import DataTable from 'react-data-table-component';

/**
 * Listado imprimible de asignaturas (SAE - public.tabasig).
 * Se abre en OTRA PESTAÑA desde /asignaturas y NO tiene botones de acción:
 * sólo las columnas de datos, para poder guardarlo como PDF con Ctrl+P
 * (el diálogo de impresión se abre solo al terminar de cargar).
 */
export default function AsignaturasPrint(){
    // eslint-disable-next-line
    const { waiting, setWaiting } = useContext(UserContext);

    const [listado, setListado] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [imprimiendo, setImprimiendo] = useState(false);
    const [fecha] = useState(tool.dateNow());
    const dosDigitos = (valor) => String(valor).padStart(2, '0');

    const miUsuario = tool.getUser();

    // Sólo datos: sin botón de editar/eliminar (el listado en PDF no lleva acciones).
    const columnas = [
        { name: 'DESCRIPCIÓN', selector: (fila) => fila.descripcion, minWidth: '240px', wrap: true, sortable: true },
        { name: 'ÁREA', selector: (fila) => fila.area, maxWidth: '180px', sortable: true },
        { name: 'ABREV.', selector: (fila) => fila.abreviatura, maxWidth: '90px', sortable: true },
        { name: 'EVALUABLE', selector: (fila) => fila.evaluable ? 'SI' : 'NO', maxWidth: '100px', sortable: true }
    ];

    useEffect(() => {
        setWaiting(() => true)
        messenger.poster({
            method: 'POST',
            url: myConst.roots.engine + myConst.roots.asignaturaList,
            value: {}
        }).then((resultado) => {
            setListado(Array.isArray(resultado.rows) ? resultado.rows : [])
        }).catch(() => {
            setListado([])
        }).finally(() => {
            setCargando(false)
            setWaiting(() => false)
        })
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (cargando || imprimiendo) return
        document.body.classList.add('modo-impresion')
        // Dejar que la tabla pinte y abrir el diálogo de impresión (Guardar como PDF).
        const elReloj = setTimeout(() => {
            setImprimiendo(true)
            try {
                window.print()
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log('No se pudo abrir el diálogo de impresión: ', error)
            }
        }, 600)
        return () => clearTimeout(elReloj)
    }, [cargando, imprimiendo]);

    const imprimirDeNuevo = () => {
        window.print()
    }

    if(!miUsuario.isLogged){
        return (<Fragment><h2 className="text-center text-danger mt-5">Sesión no válida</h2></Fragment>)
    }

    return (
        <Fragment>
            <div className="container-fluid p-4" id="reporte-impresion">
                <div className="text-center mb-3">
                    <img src={myConst.essentials.logo} alt="logo" className="mb-2" style={{ height: '70px' }} />
                    <h3 className="mb-0">{ myConst.labels.asignaturasList[0] }</h3>
                    <small className="text-muted">
                        { miUsuario.usuarioInstitucionNombre || '' }
                    </small>
                    <div>
                        <small className="text-muted">
                            Listado de asignaturas &nbsp;·&nbsp; Generado el { fecha.date } a las { dosDigitos(fecha.hour) }:{ dosDigitos(fecha.minute) }
                        </small>
                    </div>
                </div>

                { cargando ?
                    <div><h2 className="text-center text-danger">Cargando asignaturas…</h2></div>
                    :
                    (listado.length > 0) ?
                        <DataTable
                            columns={columnas}
                            data={listado}
                            striped={true}
                            noHeader={true}
                            pagination={false}
                            responsive={false}
                        />
                        :
                        <div><h2 className="text-center text-danger">Sin asignaturas que mostrar</h2></div>
                }

                <div className="text-center mt-3 no-print">
                    <button type="button" className="btn btn-primary btn-round" onClick={imprimirDeNuevo}>
                        <i className="fas fa-file-pdf">&nbsp;&nbsp;</i>
                        Guardar como PDF
                    </button>
                    <Link to={privateRoutes.ASIGNATURAS_LIST} className="btn btn-border btn-light btn-round ml-1">
                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                        { myConst.labels.asignaturasList[0] }
                    </Link>
                </div>
            </div>
        </Fragment>
    );
}
