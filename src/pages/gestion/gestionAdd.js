import { Fragment, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import swal from 'sweetalert2';
import QRCode from 'react-qr-code';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';
import CRUD from '../../main/crudConfig';

import { Forbidden } from '../forbidden';
import UserHead from '../components/head';
import Waiting from '../parts/waiting';
import { Foot } from '../components/foot';
import AppIcon from '../components/AppIcon';
import ActionButton from '../components/ActionButton';
import TituloPagina from '../components/TituloPagina';
import CampoFoto from './FotoCarnet';


/**
 * gestionAdd: formulario genérico (alta/edición) para cualquier entidad del CRUD.
 * La entidad se resuelve desde `/gestion/:entidad/agregar` y su config en crudConfig.js.
 *
 * Enmascarado de PK/FK:
 *  - El PK (`idregistro`) viene ENCRIPTADO desde el listado y se reenvía tal cual.
 *  - Las FKs (selects) usan como valor el `idregistro` ENCRIPTADO de la fuente;
 *    al editar, el valor crudo del registro se enmascara con tool.encriptar().
 *
 * Tipos de campo soportados (config.fields):
 *  text | number | date | textarea | select (source o options) | boolean | foto
 *  - `placeholder`: texto guía del input.
 *  - `validation`: 'email' | 'identificacion' | 'celular' (validación de formato).
 *  - `required`: campo obligatorio (se valida y marca en rojo).
 *  - `foto`: archivo de imagen que se reduce a tamaño carnet (300x400) y se envía en base64.
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

    // QR / enlace para compartir el formulario público de auto-gestión (si aplica).
    const [mostrarQR, setMostrarQR] = useState(false);
    const urlCompartir = (() => {
        if (!config || !config.compartirUrl) return '';
        const base = window.location.origin + config.compartirUrl;
        if (!config.autogestion) return base;
        const p = new URLSearchParams();
        if (miUsuario.usuarioEmpresaId) p.set('inst', miUsuario.usuarioEmpresaId);
        if (miUsuario.usuarioAnoId) p.set('ano', miUsuario.usuarioAnoId);
        const qs = p.toString();
        return qs ? `${base}?${qs}` : base;
    })();

    const [form, setForm] = useState({});
    const [fuentes, setFuentes] = useState({}); // { fieldName: [{value,label}] }
    const [errores, setErrores] = useState({});
    const [isFetching, setIsFetching] = useState(true);

    // Resuelve la URL y la etiqueta de una fuente de select.
    const resolverFuente = (source) => {
        if (!source) return null;
        if (source.tipo === 'catalogo') return { url: `/catalogos/listar/${source.tabla}`, label: source.label };
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
            if (f.type === 'foto') {
                defaults[f.name] = (raw !== undefined && raw !== null && raw !== '') ? raw : '';
            } else if (f.type === 'select') {
                if (f.options) {
                    // Select estático (p.ej. Sí/No): el valor crudo es '0'/'1'.
                    const enOpciones = (f.options || []).some((o) => String(o.value) === String(raw));
                    defaults[f.name] = enOpciones ? String(raw) : ((f.options && f.options[0] && f.options[0].value) || '');
                } else {
                    // La FK cruda se enmascara para coincidir con las opciones (encriptadas).
                    defaults[f.name] = (raw !== undefined && raw !== null && raw !== '') ? tool.encriptar(String(raw)) : '';
                }
            } else if (f.type === 'boolean') {
                defaults[f.name] = (raw === true || raw === 'true' || raw === '1') ? 'true' : 'false';
            } else if (f.type === 'date') {
                // La API entrega las fechas como fecha-hora ISO; el <input type="date">
                // solo acepta 'aaaa-mm-dd', si no, el campo queda vacío al editar.
                defaults[f.name] = tool.soloFecha(raw);
            } else {
                defaults[f.name] = (raw !== undefined && raw !== null) ? raw : '';
            }
        });
        setForm(defaults);
        setErrores({});

        config.fields.filter((f) => f.source).forEach((f) => cargarFuente(f));

        setIsFetching(false);
        // eslint-disable-next-line
    }, [entidad]);

    const cambiar = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        // Al corregir un campo, se quita su error.
        setErrores((prev) => {
            if (!prev[name]) return prev;
            const siguiente = { ...prev };
            delete siguiente[name];
            return siguiente;
        });
    };

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

    // Validación genérica: obligatorios + formatos (email, identificación, celular).
    const validar = () => {
        const nuevos = {};
        config.fields.forEach((f) => {
            const valor = form[f.name];
            const vacio = valor === undefined || valor === null || String(valor).trim() === '';
            if (f.required && vacio) {
                nuevos[f.name] = 'Este campo es obligatorio';
            } else if (!vacio) {
                const texto = String(valor).trim();
                if (f.validation === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)) {
                    nuevos[f.name] = 'Correo no válido';
                } else if (f.validation === 'identificacion' && !/^\d{5,15}$/.test(texto)) {
                    nuevos[f.name] = 'Identificación no válida (sólo números, 5 a 15 dígitos)';
                } else if (f.validation === 'celular' && !/^\d{7,15}$/.test(texto)) {
                    nuevos[f.name] = 'Celular no válido (sólo números)';
                }
            }
        });
        setErrores(nuevos);
        return Object.keys(nuevos).length === 0;
    };

    const onRegister = async (event) => {
        event.preventDefault();

        if (!validar()) {
            await swal.fire({
                title: 'Faltan datos por revisar',
                text: 'Corrige los campos marcados en rojo antes de continuar.',
                icon: 'warning',
                showConfirmButton: true,
                customClass: { confirmButton: 'btn btn-primary' },
            });
            return;
        }

        setWaiting(true);
        const data = construirPayload();
        const url = myConst.roots.engine + (esEdicion ? config.endpoints.actualizar : config.endpoints.registrar);

        // Confirma (o cancela) antes de registrar/actualizar.
        const confirmacion = await swal.fire({
            title: esEdicion ? '¿Actualizar registro?' : 'Agregar registro?',
            text: esEdicion
                ? `Se actualizará el registro de ${config.titulo}.`
                : `Se registrará un nuevo registro en ${config.titulo}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: esEdicion ? 'Sí, actualizar' : 'Sí, registrar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            customClass: { confirmButton: 'btn btn-primary mx-1', cancelButton: 'btn btn-danger mx-1' },
            buttonsStyling: false,
        });

        if (!confirmacion.isConfirmed) {
            setWaiting(false);
            return;
        }

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

    // Copia al portapapeles el enlace del formulario de auto-gestión.
    const copiarEnlace = async () => {
        try {
            await navigator.clipboard.writeText(urlCompartir);
            await swal.fire({
                title: 'Enlace copiado',
                text: 'Ya puedes pegarlo donde lo necesites.',
                icon: 'success',
                showConfirmButton: true,
                timer: 1800,
                customClass: { confirmButton: 'btn btn-primary' },
            });
        } catch (error) {
            await swal.fire({
                title: 'No se pudo copiar',
                text: urlCompartir,
                icon: 'info',
                showConfirmButton: true,
                customClass: { confirmButton: 'btn btn-primary' },
            });
        }
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

    // Clases de columna del campo: `field.col` si la config las define; 'col-12' abarca
    // todo el ancho del formulario y el resto se reparte a dos columnas.
    const claseColumna = (field) => field.col || 'col-md-6 col-sm-12';

    const claseInput = (field) => `form-control ${errores[field.name] ? 'is-invalid' : ''}`.trim();

    const renderField = (field) => {
        switch (field.type) {
            case 'textarea':
                return (
                    <textarea className={claseInput(field)} placeholder={field.placeholder || field.label}
                        value={form[field.name] || ''}
                        onChange={(e) => cambiar(field.name, e.target.value)} />
                );
            case 'select': {
                const opciones = field.options || (fuentes[field.name] || []);
                return (
                    <select className={`form-select ${errores[field.name] ? 'is-invalid' : ''}`.trim()}
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
                    <select className={`form-select ${errores[field.name] ? 'is-invalid' : ''}`.trim()}
                        value={form[field.name] || 'false'}
                        onChange={(e) => cambiar(field.name, e.target.value)}>
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                    </select>
                );
            case 'foto':
                return <CampoFoto value={form[field.name] || ''} onChange={(v) => cambiar(field.name, v)} />;
            case 'number':
                return <input type="number" className={claseInput(field)} placeholder={field.placeholder || field.label}
                    value={form[field.name] ?? ''}
                    onChange={(e) => cambiar(field.name, e.target.value)} />;
            case 'date':
                return <input type="date" className={claseInput(field)}
                    value={form[field.name] || ''}
                    onChange={(e) => cambiar(field.name, e.target.value)} />;
            default:
                return <input type="text" className={claseInput(field)} placeholder={field.placeholder || field.label}
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
                                                <div className="d-flex align-items-center flex-wrap">
                                                    <TituloPagina>
                                                        {esEdicion ? `Editar ${config.titulo}` : `Registrar ${config.titulo}`}
                                                    </TituloPagina>
                                                    <div className="ms-auto d-flex align-items-center flex-wrap">
                                                        {urlCompartir && (
                                                            <button type="button" onClick={() => setMostrarQR(true)}
                                                                className="btn btn-outline-primary btn-round me-2"
                                                                title={`Compartir el formulario de ${config.titulo}`}>
                                                                <AppIcon icon="tabler:qr-code" /> Compartir formulario
                                                            </button>
                                                        )}
                                                        <Link to={`/gestion/${entidad}`} className="btn btn-primary btn-round">
                                                            <AppIcon icon="la flaticon-list" /> Volver al listado
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form onSubmit={onRegister} method="POST">
                                                    <div className="row">
                                                        {config.fields.map((field, i) => (
                                                            <div key={i} className={claseColumna(field)}>
                                                                <div className="form-group text-start has-feedback">
                                                                    <label htmlFor={field.name}>
                                                                        {field.label}{field.required ? <span className="text-danger"> *</span> : null}:
                                                                    </label>
                                                                    {renderField(field)}
                                                                    {errores[field.name] && (
                                                                        <small className="text-danger">{errores[field.name]}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="card-action text-center my-4">
                                                        <ActionButton
                                                            type="submit"
                                                            loading={waiting}
                                                            icon="la flaticon-check"
                                                            className="btn btn-primary ms-1"
                                                        >
                                                            {esEdicion ? 'Actualizar' : 'Registrar'}
                                                        </ActionButton>
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

            {/* Modal QR para compartir el formulario de auto-gestión. */}
            {mostrarQR && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                    onClick={() => setMostrarQR(false)}
                >
                    <div className="card" style={{ width: '340px', maxWidth: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <div className="card-body text-center">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <h5 className="card-title mb-0">Compartir formulario</h5>
                                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setMostrarQR(false)} />
                            </div>
                            <div className="bg-white d-inline-block p-2 border rounded">
                                <QRCode value={urlCompartir} size={200} />
                            </div>
                            <p className="text-muted mt-3 mb-1">Escanea el QR o copia el enlace para llenar el formulario:</p>
                            <code className="d-block text-break mb-3" style={{ userSelect: 'all' }}>{urlCompartir}</code>
                            <div className="d-flex justify-content-center">
                                <button type="button" className="btn btn-primary btn-sm me-1" onClick={copiarEnlace}>
                                    <AppIcon icon="tabler:copy" /> Copiar enlace
                                </button>
                                <button type="button" className="btn btn-light btn-sm" onClick={() => setMostrarQR(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}
