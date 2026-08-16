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
 * Alta/edición de un indicador de desempeño / competencia (SAE - public.tabcomp).
 * Referencia de estilo: pages/observaciones/observacionesAdd.js
 */
export default function AddCompetencia(){
    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.competenciaNew
    let titulo = myConst.labels.competenciasAdd[0][0]

    const id = (params.state)? params.state.reference : null;

    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.competenciaUpdate
        titulo = myConst.labels.competenciasAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();

    const record = (id !== "undefined" && id !== null) ? (tool.getRecord() || {}) : {}

    const enmascarar = (valor) => (valor !== undefined && valor !== null && valor !== '') ? tool.encriptar(String(valor)) : ''

    const { control, register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            idarea: enmascarar(record.idarea),
            idgrado: record.idgrado || '',   // texto crudo (cgradid es text); se enmascara al enviar
            codigo: record.codigo || '',
            descripcion: record.descripcion || '',
            idasignatura: enmascarar(record.idasignatura),
            observacion: record.observacion || '',
        }
    });

    const elFade = {form:'elFormulario',response:'laRespuesta'}

    const [areas, setAreas] = useState([])
    const [asignaturas, setAsignaturas] = useState([])

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
            // cgradid es un texto; el backend lo decripta, por eso se enmascara aquí.
            data.idgrado = (data.idgrado !== '') ? tool.encriptar(String(data.idgrado)) : ''
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
                        navegar(privateRoutes.COMPETENCIAS_LIST, { replace: true })
                    }
                })
            });
            setWaiting(waiting => false)
        }
    }

    useEffect(() => {
        cargarOpciones(myConst.roots.areaList, setAreas, d => d.descripcion)
        cargarOpciones(myConst.roots.asignaturaList, setAsignaturas, d => d.descripcion)
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
                                                    <Link to={privateRoutes.COMPETENCIAS_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.competenciasList[0]}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idarea">Área:</label>
                                                                <Controller name="idarea" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { areas.map((a,i) => <option key={i} value={a.value}>{a.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='idgrado'>Grado:</label>
                                                                <input type="text" className="form-control" {...register("idgrado")} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='codigo'>Código:</label>
                                                                <input type="text" className="form-control" {...register("codigo")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idasignatura">Asignatura:</label>
                                                                <Controller name="idasignatura" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { asignaturas.map((a,i) => <option key={i} value={a.value}>{a.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor='descripcion'>Descripción de la competencia:</label>
                                                        <input type="text" className="form-control"
                                                        {...register("descripcion", { required:true })} />
                                                        { errors.descripcion?.type === 'required' && <small className="form-text text-danger">Falta la descripción de la competencia</small> }
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
