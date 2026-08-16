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
 * Alta/edición de una calificación / nota (SAE - public.tabnota).
 * Referencia de estilo: pages/observaciones/observacionesAdd.js
 */
export default function AddNota(){
    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.notaNew
    let titulo = myConst.labels.notasAdd[0][0]

    const id = (params.state)? params.state.reference : null;

    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.notaUpdate
        titulo = myConst.labels.notasAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();

    const record = (id !== "undefined" && id !== null) ? (tool.getRecord() || {}) : {}

    const enmascarar = (valor) => (valor !== undefined && valor !== null && valor !== '') ? tool.encriptar(String(valor)) : ''

    const { control, register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            idasigcurs: enmascarar(record.idasigcurs),
            idcompetencia: enmascarar(record.idcompetencia),
            idperiodo: enmascarar(record.idperiodo),
            idmatricula: enmascarar(record.idmatricula),
            valor: record.valor ?? '',
            fecha: record.fecha || '',
            observacion: record.observacion || '',
        }
    });

    const elFade = {form:'elFormulario',response:'laRespuesta'}

    const [asignaciones, setAsignaciones] = useState([])
    const [competencias, setCompetencias] = useState([])
    const [periodos, setPeriodos] = useState([])
    const [matriculas, setMatriculas] = useState([])

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
                        navegar(privateRoutes.NOTAS_LIST, { replace: true })
                    }
                })
            });
            setWaiting(waiting => false)
        }
    }

    useEffect(() => {
        cargarOpciones(myConst.roots.listaAsignaciones, setAsignaciones, d => d.asignatura)
        cargarOpciones(myConst.roots.competenciaList, setCompetencias, d => d.descripcion)
        cargarOpciones(myConst.roots.listaAnolperi, setPeriodos, d => d.descripcion)
        cargarOpciones(myConst.roots.matriculaList, setMatriculas, d => d.estudiante)
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
                                                    <Link to={privateRoutes.NOTAS_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.notasList[0]}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idasigcurs">Asignación:</label>
                                                                <Controller name="idasigcurs" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { asignaciones.map((a,i) => <option key={i} value={a.value}>{a.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idcompetencia">Competencia:</label>
                                                                <Controller name="idcompetencia" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { competencias.map((c,i) => <option key={i} value={c.value}>{c.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idperiodo">Periodo:</label>
                                                                <Controller name="idperiodo" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { periodos.map((p,i) => <option key={i} value={p.value}>{p.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idmatricula">Matrícula:</label>
                                                                <Controller name="idmatricula" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { matriculas.map((m,i) => <option key={i} value={m.value}>{m.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='valor'>Valor:</label>
                                                                <input type="number" step="0.01" className="form-control"
                                                                {...register("valor", { required:true })} />
                                                                { errors.valor?.type === 'required' && <small className="form-text text-danger">Falta el valor de la nota</small> }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='fecha'>Fecha:</label>
                                                                <input type="date" className="form-control" {...register("fecha")} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor='observacion'>Observación:</label>
                                                        <textarea className="form-control" rows="3" {...register("observacion")} />
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
