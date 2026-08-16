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
 * Alta/edición de un curso (SAE - public.tabcurs).
 * Referencia de estilo: pages/observaciones/observacionesAdd.js
 */
export default function AddCurso(){
    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.cursoNew
    let titulo = myConst.labels.cursosAdd[0][0]

    const id = (params.state)? params.state.reference : null;

    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.cursoUpdate
        titulo = myConst.labels.cursosAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();

    // En el listado las FKs vienen crudas con estos nombres (ver cursos.sql.js).
    const record = (id !== "undefined" && id !== null) ? (tool.getRecord() || {}) : {}

    const enmascarar = (valor) => (valor !== undefined && valor !== null && valor !== '') ? tool.encriptar(String(valor)) : ''

    const { control, register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            idinstitucion: enmascarar(record.cinstid),
            idgrado: enmascarar(record.cgradid),
            idjornada: enmascarar(record.cjornid),
            idano: enmascarar(record.canolid),
            nombre: record.nombre || '',
            limiteestudiantes: record.limiteestudiantes ?? '',
            idsede: enmascarar(record.idsede),
        }
    });

    const elFade = {form:'elFormulario',response:'laRespuesta'}

    const [instituciones, setInstituciones] = useState([])
    const [grados, setGrados] = useState([])
    const [jornadas, setJornadas] = useState([])
    const [anos, setAnos] = useState([])
    const [sedes, setSedes] = useState([])

    const cargarOpciones = (endpoint, setter, getLabel) => {
        messenger.poster({
            method:'POST',
            url: myConst.roots.engine + endpoint,
            value: {}
        }).then((elMensaje) => {
            setter((elMensaje.rows || []).map((dato) => ({ value: dato.idregistro, label: getLabel(dato) })))
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
                        navegar(privateRoutes.CURSOS_LIST, { replace: true })
                    }
                })
            });
            setWaiting(waiting => false)
        }
    }

    useEffect(() => {
        cargarOpciones(myConst.roots.institucionList, setInstituciones, d => d.nombre)
        cargarOpciones(myConst.roots.listaGrados, setGrados, d => d.cgraddesc)
        cargarOpciones(myConst.roots.listaJornadas, setJornadas, d => d.cjorndesc)
        cargarOpciones(myConst.roots.listaAnos, setAnos, d => d.descripcion)
        cargarOpciones(myConst.roots.listaSedes, setSedes, d => d.nombre)
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
                                                    <Link to={privateRoutes.CURSOS_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.cursosList[0]}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='nombre'>Nombre del curso:</label>
                                                                <input type="text" className="form-control" placeholder='1-A'
                                                                {...register("nombre", { required:true })} />
                                                                { errors.nombre?.type === 'required' && <small className="form-text text-danger">¿Cómo se llama el curso?</small> }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idinstitucion">Institución:</label>
                                                                <Controller name="idinstitucion" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { instituciones.map((i,idx) => <option key={idx} value={i.value}>{i.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idgrado">Grado:</label>
                                                                <Controller name="idgrado" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { grados.map((g,i) => <option key={i} value={g.value}>{g.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idjornada">Jornada:</label>
                                                                <Controller name="idjornada" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { jornadas.map((j,i) => <option key={i} value={j.value}>{j.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idano">Año lectivo:</label>
                                                                <Controller name="idano" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { anos.map((a,i) => <option key={i} value={a.value}>{a.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='limiteestudiantes'>Límite de estudiantes:</label>
                                                                <input type="number" className="form-control" {...register("limiteestudiantes")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idsede">Sede:</label>
                                                                <Controller name="idsede" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { sedes.map((s,i) => <option key={i} value={s.value}>{s.label}</option>) }
                                                                        </select>
                                                                    )} />
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
