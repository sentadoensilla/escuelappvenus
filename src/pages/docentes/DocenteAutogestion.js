import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import swal from 'sweetalert2';

import { publicRoutes } from '../../services/routes';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import CampoFoto from '../gestion/FotoCarnet';
import AppIcon from '../components/AppIcon';


/**
 * DocenteAutogestion — formulario PÚBLICO de auto-gestión del docente.
 *
 * No requiere iniciar sesión: el docente (o quien escanee el QR) llena sus
 * datos personales y la foto; se guarda en `tabdoce` vía el endpoint público
 * `/sae/docentes/autoregistro`. Los catálogos se cargan del endpoint público
 * `/catalogos/publico/listar/:tabla` (id encriptado).
 *
 * El cargo, jefe de área e institución los asigna después el administrador.
 */

const CATALOGO_URL = (tabla) => `${myConst.roots.engine}/catalogos/publico/listar/${tabla}`;
const REGISTRO_URL = `${myConst.roots.engine}/sae/docentes/autoregistro`;

const CAMPOS = [
    { name: 'foto', label: 'Foto (tipo carnet)', type: 'foto', col: 'col-12' },
    { name: 'idtipodocumento', label: 'Tipo documento', type: 'select', catalogo: 'tiposdocumento', labelKey: 'ctipodocudesc' },
    { name: 'identificacion', label: 'Identificación', type: 'text', required: true, validation: 'identificacion', placeholder: 'Número de documento' },
    { name: 'nombre1', label: 'Primer nombre', type: 'text', required: true, placeholder: 'Ej: María' },
    { name: 'nombre2', label: 'Segundo nombre', type: 'text', placeholder: 'Ej: Fernanda' },
    { name: 'apellido1', label: 'Primer apellido', type: 'text', required: true, placeholder: 'Ej: Gómez' },
    { name: 'apellido2', label: 'Segundo apellido', type: 'text', placeholder: 'Ej: Pérez' },
    { name: 'fechanacimiento', label: 'Fecha nacimiento', type: 'date', required: true },
    { name: 'idsexo', label: 'Sexo', type: 'select', catalogo: 'sexos', labelKey: 'csexodesc', required: true },
    { name: 'idtiposangre', label: 'Tipo de sangre', type: 'select', catalogo: 'tipossangre', labelKey: 'ctiposangdesc', required: true },
    { name: 'celular', label: 'Celular', type: 'text', required: true, validation: 'celular', placeholder: 'Ej: 3001234567' },
    { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Teléfono fijo (opcional)' },
    { name: 'email', label: 'Email', type: 'text', required: true, validation: 'email', placeholder: 'correo@ejemplo.com' },
    { name: 'direccion', label: 'Dirección', type: 'text', col: 'col-12', placeholder: 'Dirección de residencia' },
];

const REGLAS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    identificacion: /^\d{5,15}$/,
    celular: /^\d{7,15}$/,
};

const MENSAJE_VALIDACION = {
    email: 'Correo no válido',
    identificacion: 'Identificación no válida (sólo números, 5 a 15 dígitos)',
    celular: 'Celular no válido (sólo números)',
};

export default function DocenteAutogestion() {
    const [form, setForm] = useState({});
    const [opciones, setOpciones] = useState({});
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);

    // Datos de sesión ENCRIPTADOS que llegan en el enlace/QR (institución y año).
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const instEnlace = query.get('inst') || '';
    const anoEnlace = query.get('ano') || '';

    // Carga los catálogos públicos (tipo documento, sexo, tipo de sangre).
    useEffect(() => {
        ['tiposdocumento', 'sexos', 'tipossangre'].forEach((tabla) => {
            messenger.poster({ method: 'POST', url: CATALOGO_URL(tabla), value: {} })
                .then((r) => {
                    const campo = CAMPOS.find((c) => c.catalogo === tabla);
                    setOpciones((prev) => ({
                        ...prev,
                        [tabla]: (r.rows || []).map((row) => ({ value: row.idregistro, label: row[campo.labelKey] })),
                    }));
                })
                .catch(() => setOpciones((prev) => ({ ...prev, [tabla]: [] })));
        });
        // eslint-disable-next-line
    }, []);

    const cambiar = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrores((prev) => {
            if (!prev[name]) return prev;
            const siguiente = { ...prev };
            delete siguiente[name];
            return siguiente;
        });
    };

    const validar = () => {
        const nuevos = {};
        CAMPOS.forEach((c) => {
            const valor = form[c.name];
            const vacio = valor === undefined || valor === null || String(valor).trim() === '';
            if (c.required && vacio) {
                nuevos[c.name] = 'Este campo es obligatorio';
            } else if (!vacio && c.validation && REGLAS[c.validation] && !REGLAS[c.validation].test(String(valor).trim())) {
                nuevos[c.name] = MENSAJE_VALIDACION[c.validation];
            }
        });
        setErrores(nuevos);
        return Object.keys(nuevos).length === 0;
    };

    const enviar = async (evento) => {
        evento.preventDefault();
        if (!validar()) {
            await swal.fire({ title: 'Faltan datos', text: 'Corrige los campos marcados en rojo.', icon: 'warning', showConfirmButton: true, customClass: { confirmButton: 'btn btn-primary' } });
            return;
        }
        setEnviando(true);
        // Se incluyen la institución y el año encriptados que vienen en el enlace.
        const datos = { ...form };
        if (instEnlace) datos.idinstitucion = instEnlace;
        if (anoEnlace) datos.idano = anoEnlace;
        await messenger.poster({ method: 'POST', url: REGISTRO_URL, value: datos })
            .then((resultado) => {
                swal.fire({
                    title: (parseInt(resultado.statusCode) === 200) ? 'Registro exitoso' : 'No se pudo registrar',
                    text: resultado.message,
                    icon: resultado.status,
                    showConfirmButton: true,
                    customClass: { confirmButton: 'btn btn-primary' },
                }).then((answer) => {
                    if (answer.isConfirmed && parseInt(resultado.statusCode) === 200) {
                        setForm({});
                        setErrores({});
                    }
                });
            })
            .catch(() => swal.fire({ title: 'Error', text: 'No se pudo conectar con el servidor.', icon: 'error', showConfirmButton: true, customClass: { confirmButton: 'btn btn-primary' } }));
        setEnviando(false);
    };

    const claseCol = (c) => c.col || 'col-md-6 col-sm-12';

    const renderCampo = (c) => {
        switch (c.type) {
            case 'foto':
                return <CampoFoto value={form[c.name] || ''} onChange={(v) => cambiar(c.name, v)} />;
            case 'select': {
                const lista = opciones[c.catalogo] || [];
                return (
                    <select className={`form-select ${errores[c.name] ? 'is-invalid' : ''}`.trim()}
                        value={form[c.name] || ''}
                        onChange={(e) => cambiar(c.name, e.target.value)}>
                        <option value="">Seleccione una opción</option>
                        {lista.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
                    </select>
                );
            }
            case 'date':
                return <input type="date" className={`form-control ${errores[c.name] ? 'is-invalid' : ''}`.trim()}
                    value={form[c.name] || ''} onChange={(e) => cambiar(c.name, e.target.value)} />;
            default:
                return <input type="text" className={`form-control ${errores[c.name] ? 'is-invalid' : ''}`.trim()}
                    placeholder={c.placeholder || c.label} value={form[c.name] || ''}
                    onChange={(e) => cambiar(c.name, e.target.value)} />;
        }
    };

    return (
        <Fragment>
            <div className="min-vh-100 d-flex flex-column">
                <div className="main-header bg-primary py-3">
                    <div className="container d-flex align-items-center justify-content-between">
                        <span className="d-flex align-items-center">
                            <img src={myConst.essentials.logo} alt="logo" className="bg-white rounded p-1" style={{ height: '44px' }} />
                            <span className="text-white fw-bold ms-2">Auto-gestión del docente</span>
                        </span>
                        <Link to={publicRoutes.INDEX} className="btn btn-light btn-sm">Inicio</Link>
                    </div>
                </div>

                <div className="container py-4 flex-grow-1">
                    <div className="row justify-content-center">
                        <div className="col-lg-9 col-xl-8">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title mb-0">Registro de datos del docente</h4>
                                </div>
                                <div className="card-body">
                                    <p className="text-muted mb-3">
                                        Llena tus datos personales. Los campos con <span className="text-danger">*</span> son obligatorios.
                                    </p>
                                    <form onSubmit={enviar} method="POST">
                                        <div className="row">
                                            {CAMPOS.map((c, i) => (
                                                <div key={i} className={claseCol(c)}>
                                                    <div className="form-group text-start has-feedback">
                                                        <label htmlFor={c.name}>
                                                            {c.label}{c.required ? <span className="text-danger"> *</span> : null}:
                                                        </label>
                                                        {renderCampo(c)}
                                                        {errores[c.name] && <small className="text-danger">{errores[c.name]}</small>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="card-action text-center my-4">
                                            <button type="submit" className={enviando ? 'btn is-loading btn-warning ms-1' : 'btn btn-primary ms-1'} disabled={enviando}>
                                                <AppIcon icon="tabler:device-floppy" /> {enviando ? 'Guardando…' : 'Guardar mis datos'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
