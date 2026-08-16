import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as myConst from '../../main/constants';

/**
 * VistaEnlace — Página pública que abre un enlace seguro (SAE → Escuelapp → Padre).
 * Valida el token contra el backend y muestra el evento (novedad/asistencia o comunicado).
 * No requiere sesión: el enlace firmado es la autorización.
 */
export default function VistaEnlace(){
    const { token } = useParams();
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [dato, setDato] = useState(null);

    useEffect(() => {
        // GET público al Integration Layer (valida token, registra acceso, consulta SAE).
        fetch(myConst.roots.engine + '/integration/enlace/' + token, { method: 'GET' })
            .then((r) => r.json())
            .then((r) => {
                if (parseInt(r.statusCode) === 200) setDato(r.rows);
                else setError(r.message);
            })
            .catch(() => setError('No se pudo abrir el enlace'))
            .finally(() => setCargando(false));
        // eslint-disable-next-line
    }, [token]);

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="page-inner mt-4">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-sm-12">
                            <div className="card">
                                <div className="card-header text-center">
                                    <img src={myConst.essentials.logo} alt="Escuelapp" className="navbar-brand" />
                                    <h4 className="card-title">Escuelapp — Notificación</h4>
                                </div>
                                <div className="card-body">
                                    {cargando && (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status"></div>
                                            <p>Cargando información…</p>
                                        </div>
                                    )}

                                    {error && !cargando && (
                                        <div className="alert alert-danger text-center">
                                            <h5>{error}</h5>
                                            <p>Si el enlace expiró, solicita uno nuevo a tu institución.</p>
                                        </div>
                                    )}

                                    {dato && !cargando && (
                                        <div>
                                            {dato.evento?.tipo === 'novedad' && (
                                                <div>
                                                    <h5 className="text-primary">
                                                        {dato.evento.tiponovedad || 'Novedad'} — {dato.evento.estudiante || 'Estudiante'}
                                                    </h5>
                                                    <p><strong>Fecha:</strong> {dato.evento.cnovefech || ''}</p>
                                                    <p><strong>Curso:</strong> {dato.evento.curso || ''}</p>
                                                    <div className="alert alert-light border">
                                                        {dato.evento.cnoveobse || 'Sin observación.'}
                                                    </div>
                                                    <hr />
                                                    <h6>Historial reciente</h6>
                                                    <ul className="list-group">
                                                        {(dato.evento.historial || []).map((h, i) => (
                                                            <li key={i} className="list-group-item d-flex justify-content-between">
                                                                <span>{h.tiponovedad}</span>
                                                                <small>{h.cnovefech}</small>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {dato.evento?.tipo === 'aviso' && (
                                                <div>
                                                    <h5 className="text-primary">{dato.evento.titulo || 'Comunicado'}</h5>
                                                    <div className="alert alert-light border">
                                                        {dato.evento.contenido || 'Sin contenido.'}
                                                    </div>
                                                    <small className="text-muted">Fecha: {dato.evento.fecharegistro || ''}</small>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
