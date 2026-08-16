import { Fragment, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import swal from 'sweetalert2';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';
import CRUD from '../../main/crudConfig';

import { Forbidden } from '../forbidden';
import UserHead from '../components/head';
import Waiting from '../parts/waiting';
import { Foot } from '../components/foot';

/**
 * gestionAdd: formulario genérico (alta/edición) para cualquier entidad del CRUD.
 * La entidad se resuelve desde `/gestion/:entidad/agregar` y su config en crudConfig.js.
 *
 * Enmascarado de PK/FK:
 *  - El PK (`idregistro`) viene ENCRIPTADO desde el listado y se reenvía tal cual.
 *  - Las FKs (selects) usan como valor el `idregistro` ENCRIPTADO de la fuente;
 *    al editar, el valor crudo del registro se enmascara con tool.encriptar().
 */
export default function GestionAdd() {
    const { entidad } = useParams();
    const config = CRUD[entidad];
    const params = useLocation();
    const navegar = useNavigate();
    // eslint-disable-next-line
    const { waiting, setWaiting } = useContext(UserContext);
    const miUsuario = tool.getUser();

    const id = (params.state) ? params.state.id : null;
    const esEdicion = (id !== null && id !== undefined && id !== '');

    const [form, setForm] = useState({});
    const [fuentes, setFuentes] = useState({}); // { fieldName: [{value,label}] }
    const [isFetching, setIsFetching] = useState(true);

    // Resuelve la URL y la etiqueta de una fuente de select.
    const resolverFuente = (source) => {
        if (!source) return null;
        if (source.tipo === 'catalogo') return { url: `/catalogos/${source.tabla}/listar`, label: source.label };
        if (source.tipo === 'sae') return { url: `/sae/${source.recurso}/listar`, label: source.label };
        if (source.tipo === 'pre') return { url: `/preescolar/${source.recurso}/listar`, label: source.label };
        if (source.tipo === 'institucion') return { url: `/institucion/instituciones/listar`, label: 'nombre' };
        if (source.tipo === 'sedes') return { url: `/institucion/sedes/listar`, label: 'nombre' };
        return null;
    };

    // Carga las opciones de un select desde su fuente.
    const cargarFuente = async (field) => {
        const src = resolverFuente(field.source);
        if (!src) return;
        await messenger.poster({ method: 'POST', url: myConst.roots.engine + src.url, value: {} })
            .then((r) => {
                const opciones = (r.rows || []).map((row) => ({
                    value: row.idregistro, // ya viene encriptado desde la API
                    label: (typeof src.label === 'function') ? src.label(row) : row[src.label],
                }));
                setFuentes((prev) => ({ ...prev, [field.name]: opciones }));
            })
            .catch(() => setFuentes((prev) => ({ ...prev, [field.name]: [] })));
    };

    // Inicializa el formulario y carga las fuentes.
    useEffect(() => {
        if (!config) { setIsFetching(false); return; }

        const record = esEdicion ? (tool.getRecord() || {}) : {};
        const defaults = {};
        config.fields.forEach((f) => {
            const raw = record[f.get || f.name];
            if (f.type === 'select') {
                // La FK cruda se enmascara para coincidir con las opciones (encriptadas).
                defaults[f.name] = (raw !== undefined && raw !== null && raw !== '') ? tool.encriptar(String(raw)) : '';
            } else if (f.type === 'boolean') {
                defaults[f.name] = (raw === true || raw === 'true' || raw === '1') ? 'true' : 'false';
            } else {
                defaults[f.name] = (raw !== undefined && raw !== null) ? raw : '';
            }
        });
        setForm(defaults);

        config.fields.filter((f) => f.source).forEach((f) => cargarFuente(f));

        setIsFetching(false);
        // eslint-disable-next-line
    }, [entidad]);

    const cambiar = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

    // Construye el payload aplicando el enmascarado de FKs y la conversión de tipos.
    const construirPayload = () => {
        const data = { ...form };
        if (esEdicion) {
            // El PK ya está encriptado en el registro guardado.
            const record = tool.getRecord() || {};
            data.idregistro = record.idregistro || id;
        }
        config.fields.forEach((f) => {
            if (f.type === 'boolean') data[f.name] = (form[f.name] === 'true');
            else if (f.type === 'number' && form[f.name] !== '' && form[f.name] !== null) data[f.name] = Number(form[f.name]);
        });
        return data;
    };

    const onRegister = async (event) => {
        event.preventDefault();
        setWaiting(true);

        const data = construirPayload();
        const url = myConst.roots.engine + (esEdicion ? config.endpoints.actualizar : config.endpoints.registrar);

        await messenger.poster({ method: 'POST', url, value: data })
            .then((resultado) => {
                swal.fire({
                    title: (parseInt(resultado.statusCode) === 200) ? 'Éxito' : 'Error',
                    text: resultado.message,
                    icon: resultado.status,
                    showConfirmButton: true,
                    customClass: { confirmButton: 'btn btn-primary' },
                }).then((answer) => {
                    if (answer.isConfirmed) navegar(`/gestion/${entidad}`, { replace: true });
                });
            });

        setWaiting(false);
    };

    if (!miUsuario.isLogged) {
        return <Fragment><Forbidden /></Fragment>;
    }

    if (!config) {
        return (
            <Fragment>
                <div id="elgrapper" className="wrapper">
                    <UserHead waiting={waiting} setWaiting={setWaiting} />
                    <div className="main-panel"><div className="content"><div className="page-inner">
                        <h1 className="text-center text-danger">Entidad no reconocida: {entidad}</h1>
                    </div></div><Foot /></div>
                </div>
            </Fragment>
        );
    }

    if (isFetching) {
        return <Fragment><Waiting /></Fragment>;
    }

    const renderField = (field) => {
        switch (field.type) {
            case 'textarea':
                return (
                    <textarea className="form-control" placeholder={field.label}
                        value={form[field.name] || ''}
                        onChange={(e) => cambiar(field.name, e.target.value)} />
                );
            case 'select': {
                const opciones = fuentes[field.name] || [];
                return (
                    <select className="form-control"
                        value={form[field.name] || ''}
                        onChange={(e) => cambiar(field.name, e.target.value)}>
                        <option value="">Seleccione una opción</option>
                        {opciones.map((o, i) => (
                            <option key={i} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                );
            }
            case 'boolean':
                return (
                    <select className="form-control"
                        value={form[field.name] || 'false'}
                        onChange={(e) => cambiar(field.name, e.target.value)}>
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                    </select>
                );
            case 'number':
                return <input type="number" className="form-control" placeholder={field.label}
                    value={form[field.name] ?? ''}
                    onChange={(e) => cambiar(field.name, e.target.value)} />;
            case 'date':
                return <input type="date" className="form-control"
                    value={form[field.name] || ''}
                    onChange={(e) => cambiar(field.name, e.target.value)} />;
            default:
                return <input type="text" className="form-control" placeholder={field.label}
                    value={form[field.name] || ''}
                    onChange={(e) => cambiar(field.name, e.target.value)} />;
        }
    };

    return (
        <Fragment>
            <div id="elgrapper" className="wrapper">
                <UserHead waiting={waiting} setWaiting={setWaiting} />
                <div className="main-panel">
                    <div className="content">
                        <div className="page-inner">
                            <div className="page-inner mt--5">
                                <h1 className="text-center">
                                    <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                                    {miUsuario.usuarioInstitucionNombre}
                                </h1>
                            </div>
                            <div className="page-inner mt--2">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center">
                                                    <h4 className="card-title">
                                                        {esEdicion ? `Editar ${config.titulo}` : `Registrar ${config.titulo}`}
                                                    </h4>
                                                    <Link to={`/gestion/${entidad}`} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i> Volver al listado
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form onSubmit={onRegister} method="POST">
                                                    <div className="row">
                                                        {config.fields.map((field, i) => (
                                                            <div key={i} className="col-md-6 col-sm-12">
                                                                <div className="form-group text-left has-feedback">
                                                                    <label htmlFor={field.name}>{field.label}:</label>
                                                                    {renderField(field)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="card-action text-center my-4">
                                                        <button type="submit"
                                                            className={waiting ? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
                                                            disabled={waiting}>
                                                            {esEdicion ? 'Actualizar' : 'Registrar'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Foot />
                </div>
            </div>
        </Fragment>
    );
}
