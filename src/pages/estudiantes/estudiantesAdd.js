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
 * Alta/edición de un estudiante (SAE - public.tabestu).
 * Referencia de estilo: pages/observaciones/observacionesAdd.js
 */
export default function AddEstudiante(){
    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.estudianteNew
    let titulo = myConst.labels.estudiantesAdd[0][0]

    const id = (params.state)? params.state.reference : null;

    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.estudianteUpdate
        titulo = myConst.labels.estudiantesAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();

    const record = (id !== "undefined" && id !== null) ? (tool.getRecord() || {}) : {}

    const enmascarar = (valor) => (valor !== undefined && valor !== null && valor !== '') ? tool.encriptar(String(valor)) : ''

    const { control, register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            identificacion: record.identificacion || '',
            idtipodocumento: enmascarar(record.idtipodocumento),
            nombre1: record.nombre1 || '',
            nombre2: record.nombre2 || '',
            apellido1: record.apellido1 || '',
            apellido2: record.apellido2 || '',
            fechanacimiento: record.fechanacimiento || '',
            idgenero: enmascarar(record.idgenero),
            idtiposangre: enmascarar(record.idtiposangre),
            telefono: record.telefono || '',
            direccion: record.direccion || '',
            email: record.email || '',
        }
    });

    const elFade = {form:'elFormulario',response:'laRespuesta'}

    const [tiposdocumento, setTiposDocumento] = useState([])
    const [sexos, setSexos] = useState([])
    const [tipossangre, setTiposSangre] = useState([])

    const cargarCatalogo = (endpoint, setter, labelKey) => {
        messenger.poster({
            method:'POST',
            url: myConst.roots.engine + endpoint,
            value: {}
        }).then((elMensaje) => {
            setter((elMensaje.rows || []).map((dato) => ({ value: dato.idregistro, label: dato[labelKey] })))
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
                    customClass: { confirmButton:'btn btn-primary' }
                }).then(answer => {
                    if(answer.isConfirmed){
                        navegar(privateRoutes.ESTUDIANTES_SAE_LIST, { replace: true })
                    }
                })
            });
            setWaiting(waiting => false)
        }
    }

    useEffect(() => {
        cargarCatalogo(myConst.roots.listaTiposDocumento, setTiposDocumento, 'ctipodocudesc')
        cargarCatalogo(myConst.roots.listaSexos, setSexos, 'csexodesc')
        cargarCatalogo(myConst.roots.listaTiposSangre, setTiposSangre, 'ctiposangdesc')
        // eslint-disable-next-line
    }, []);

    if(!miUsuario.isLogged){
        return (<Fragment><Forbidden /></Fragment>);
    }

    return (
        <Fragment>
            <div id='elgrapper' className="wrapper">
                <UserHead waiting={waiting} setWaiting={setWaiting} />
                <div className="main-panel">
                    <div className="content">
                        <div className="page-inner">
                            <div className="page-inner mt--5">
                                <h1 className="text-center">
                                    <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                                    { titulo }
                                </h1>
                            </div>
                            <div className="page-inner mt--2">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center">
                                                    <h4 className="card-title">{titulo}</h4>
                                                    <Link to={privateRoutes.ESTUDIANTES_SAE_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.estudiantesList[0]}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }

                                                    <div className="row">
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idtipodocumento">Tipo de documento:</label>
                                                                <Controller name="idtipodocumento" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { tiposdocumento.map((t,i) => <option key={i} value={t.value}>{t.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-8 col-lg-8">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='identificacion'>Identificación:</label>
                                                                <input type="text" className="form-control" placeholder='1234567890'
                                                                {...register("identificacion", { required:true })} />
                                                                { errors.identificacion?.type === 'required' && <small className="form-text text-danger">Falta la identificación del estudiante</small> }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='nombre1'>Primer nombre:</label>
                                                                <input type="text" className="form-control" {...register("nombre1")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='nombre2'>Segundo nombre:</label>
                                                                <input type="text" className="form-control" {...register("nombre2")} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='apellido1'>Primer apellido:</label>
                                                                <input type="text" className="form-control" {...register("apellido1")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='apellido2'>Segundo apellido:</label>
                                                                <input type="text" className="form-control" {...register("apellido2")} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='fechanacimiento'>Fecha de nacimiento:</label>
                                                                <input type="date" className="form-control" {...register("fechanacimiento")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idgenero">Género:</label>
                                                                <Controller name="idgenero" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { sexos.map((s,i) => <option key={i} value={s.value}>{s.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idtiposangre">Tipo de sangre:</label>
                                                                <Controller name="idtiposangre" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { tipossangre.map((s,i) => <option key={i} value={s.value}>{s.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='telefono'>Teléfono:</label>
                                                                <input type="text" className="form-control" {...register("telefono")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='direccion'>Dirección:</label>
                                                                <input type="text" className="form-control" {...register("direccion")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='email'>Correo electrónico:</label>
                                                                <input type="text" className="form-control" {...register("email")} />
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
