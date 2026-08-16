import { Fragment, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import swal from 'sweetalert2';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'
import { privateRoutes } from '../../services/routes';

import UserHead from '../components/head'
import { Forbidden } from '../forbidden'
import { Foot } from '../components/foot'

/**
 * Alta/edición de una institución educativa (SAE - public.tabinst).
 * Referencia de estilo: pages/observaciones/observacionesAdd.js
 */
export default function AddInstitucion(){
    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.institucionNew
    let titulo = myConst.labels.institucionesAdd[0][0]

    const id = (params.state)? params.state.reference : null;

    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.institucionUpdate
        titulo = myConst.labels.institucionesAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();

    // Registro previo guardado desde el listado (solo en edición).
    const record = (id !== "undefined" && id !== null) ? (tool.getRecord() || {}) : {}

    // Enmascarar las FKs crudas para que coincidan con las opciones (encriptadas).
    const enmascarar = (valor) => (valor !== undefined && valor !== null && valor !== '') ? tool.encriptar(String(valor)) : ''

    const { control, register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            nombre: record.nombre || '',
            codigodane: record.codigodane || '',
            nit: record.nit || '',
            direccion: record.direccion || '',
            telefono: record.telefono || '',
            email: record.email || '',
            lema: record.lema || '',
            idzona: enmascarar(record.idzona),
            idcaracter: enmascarar(record.idcaracter),
            idespecialidad: enmascarar(record.idespecialidad),
            idmetodo: enmascarar(record.idmetodo),
            iddepartamento: enmascarar(record.iddepartamento),
            idciudad: enmascarar(record.idciudad),
        }
    });

    const elFade = {form:'elFormulario',response:'laRespuesta'}

    // Catálogos para los select.
    const [zonas, setZonas] = useState([])
    const [caracteres, setCaracteres] = useState([])
    const [especialidades, setEspecialidades] = useState([])
    const [metodos, setMetodos] = useState([])
    const [departamentos, setDepartamentos] = useState([])
    const [ciudades, setCiudades] = useState([])

    // Carga un catálogo genérico (endpoint /catalogos/:tabla/listar) y lo mapea a opciones.
    const cargarCatalogo = (endpoint, setter, labelKey) => {
        messenger.poster({
            method:'POST',
            url: myConst.roots.engine + endpoint,
            value: {}
        }).then((elMensaje) => {
            setter((elMensaje.rows || []).map((dato) => ({
                value: dato.idregistro,      // encriptado por la API
                label: dato[labelKey]
            })))
        })
    }

    const onRegister = async(data) => {
        if(data !== ""){
            setWaiting(waiting => true)

            await messenger.poster({
                method: 'POST',
                value: data,
                url: uRl
            }).then((resultado) => {
                swal.fire({
                    title: myConst.protocolMessages.status[resultado.statusCode],
                    text: resultado.message,
                    icon: resultado.status,
                    showConfirmButton: true,
                    customClass: {
                        confirmButton:'btn btn-primary'
                    }
                }).then(answer => {
                    if(answer.isConfirmed){
                        navegar(privateRoutes.INSTITUCIONES_LIST, { replace: true })
                    }
                })
            });

            setWaiting(waiting => false)
        }
    }

    useEffect(() => {
        cargarCatalogo(myConst.roots.listaZonas, setZonas, 'czonaresidesc')
        cargarCatalogo(myConst.roots.listaCaracter, setCaracteres, 'ccaradesc')
        cargarCatalogo(myConst.roots.listaEspecialidades, setEspecialidades, 'cespeinstdesc')
        cargarCatalogo(myConst.roots.listaMetodos, setMetodos, 'cmetoinstdesc')
        cargarCatalogo(myConst.roots.listaDepartamentos, setDepartamentos, 'cdepageogdesc')
        cargarCatalogo(myConst.roots.listaCiudades, setCiudades, 'cciuddesc')
        // eslint-disable-next-line
    }, []);

    if(!miUsuario.isLogged){
        return (
            <Fragment>
                <Forbidden />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <div id='elgrapper' className="wrapper">
                <UserHead waiting={waiting} setWaiting={setWaiting} />

                <div className="main-panel">
                    <div className="content">
                        <div className="page-inner">
                            <div className="page-inner">
                                <div className="page-inner mt--5">
                                    <h1 className="text-center">
                                        <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                                        { titulo }
                                    </h1>
                                </div>
                            </div>

                            <div className="page-inner mt--2">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center">
                                                    <h4 className="card-title">{titulo}</h4>
                                                    <Link to={privateRoutes.INSTITUCIONES_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.institucionesList[0]}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='nombre'>Nombre de la institución:</label>
                                                                <input type="text" className="form-control" placeholder='Colegio...'
                                                                {...register("nombre", { required:true })} />
                                                                { errors.nombre?.type === 'required' && <small className="form-text text-danger">¿Cómo se llama la institución?</small> }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='codigodane'>Código DANE:</label>
                                                                <input type="text" className="form-control" placeholder='276109000855'
                                                                {...register("codigodane")} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='nit'>NIT:</label>
                                                                <input type="text" className="form-control" placeholder='800256881-3'
                                                                {...register("nit")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='direccion'>Dirección:</label>
                                                                <input type="text" className="form-control" placeholder='Calle ...'
                                                                {...register("direccion")} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='telefono'>Teléfono:</label>
                                                                <input type="text" className="form-control" placeholder='601 1234567'
                                                                {...register("telefono")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='email'>Correo electrónico:</label>
                                                                <input type="text" className="form-control" placeholder='contacto@colegio.edu.co'
                                                                {...register("email")} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor='lema'>Lema:</label>
                                                        <input type="text" className="form-control" placeholder='Lema institucional'
                                                        {...register("lema")} />
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idzona">Zona de residencia:</label>
                                                                <Controller
                                                                    name="idzona"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione una zona</option>
                                                                            { zonas.map((z,i) => <option key={i} value={z.value}>{z.label}</option>) }
                                                                        </select>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idcaracter">Carácter del colegio:</label>
                                                                <Controller
                                                                    name="idcaracter"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione el carácter</option>
                                                                            { caracteres.map((c,i) => <option key={i} value={c.value}>{c.label}</option>) }
                                                                        </select>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idespecialidad">Especialidad:</label>
                                                                <Controller
                                                                    name="idespecialidad"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione la especialidad</option>
                                                                            { especialidades.map((e,i) => <option key={i} value={e.value}>{e.label}</option>) }
                                                                        </select>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idmetodo">Método institucional:</label>
                                                                <Controller
                                                                    name="idmetodo"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione el método</option>
                                                                            { metodos.map((m,i) => <option key={i} value={m.value}>{m.label}</option>) }
                                                                        </select>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="iddepartamento">Departamento:</label>
                                                                <Controller
                                                                    name="iddepartamento"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione el departamento</option>
                                                                            { departamentos.map((d,i) => <option key={i} value={d.value}>{d.label}</option>) }
                                                                        </select>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idciudad">Ciudad / municipio:</label>
                                                                <Controller
                                                                    name="idciudad"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione la ciudad</option>
                                                                            { ciudades.map((c,i) => <option key={i} value={c.value}>{c.label}</option>) }
                                                                        </select>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='card-action text-center my-5'>
                                                        <button
                                                            type='submit'
                                                            className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
                                                            disabled={waiting}
                                                        >
                                                            { titulo }
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
