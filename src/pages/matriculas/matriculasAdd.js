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
 * Alta/edición de una matrícula (SAE - public.tabmatr).
 * Referencia de estilo: pages/observaciones/observacionesAdd.js
 */
export default function AddMatricula(){
    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.matriculaNew
    let titulo = myConst.labels.matriculasAdd[0][0]

    const id = (params.state)? params.state.reference : null;

    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.matriculaUpdate
        titulo = myConst.labels.matriculasAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();

    const record = (id !== "undefined" && id !== null) ? (tool.getRecord() || {}) : {}

    const enmascarar = (valor) => (valor !== undefined && valor !== null && valor !== '') ? tool.encriptar(String(valor)) : ''

    const { control, register, handleSubmit } = useForm({
        defaultValues: {
            idestudiante: enmascarar(record.idestudiante),
            idcurso: enmascarar(record.idcurso),
            idinstitucion: enmascarar(record.idinstitucion),
            nuevo: (record.nuevo === true) ? 'true' : 'false',
            repitente: (record.repitente === true) ? 'true' : 'false',
            valorinscripcion: record.valorinscripcion ?? '',
            valorpension: record.valorpension ?? '',
            descuento: record.descuento ?? '',
        }
    });

    const elFade = {form:'elFormulario',response:'laRespuesta'}

    const [estudiantes, setEstudiantes] = useState([])
    const [cursos, setCursos] = useState([])
    const [instituciones, setInstituciones] = useState([])

    // Carga opciones desde un endpoint; getLabel define la etiqueta visible.
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
            // Los radios llegan como string 'true'/'false'; se convierten a booleano.
            data.nuevo = (data.nuevo === 'true')
            data.repitente = (data.repitente === 'true')

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
                        navegar(privateRoutes.MATRICULAS_LIST, { replace: true })
                    }
                })
            });
            setWaiting(waiting => false)
        }
    }

    useEffect(() => {
        cargarOpciones(myConst.roots.estudianteList, setEstudiantes, d => ((d.apellido1||'') + ' ' + (d.nombre1||'')).trim())
        cargarOpciones(myConst.roots.cursoList, setCursos, d => ((d.nombre||'') + (d.grado ? ' (' + d.grado + ')' : '')).trim())
        cargarOpciones(myConst.roots.institucionList, setInstituciones, d => d.nombre)
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
                                                    <Link to={privateRoutes.MATRICULAS_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.matriculasList[0]}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }

                                                    <div className="row">
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idestudiante">Estudiante:</label>
                                                                <Controller name="idestudiante" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { estudiantes.map((e,i) => <option key={i} value={e.value}>{e.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="idcurso">Curso:</label>
                                                                <Controller name="idcurso" control={control}
                                                                    render={({ field }) => (
                                                                        <select className="form-control" {...field}>
                                                                            <option value="">Seleccione</option>
                                                                            { cursos.map((c,i) => <option key={i} value={c.value}>{c.label}</option>) }
                                                                        </select>
                                                                    )} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
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
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group">
                                                                <label className="form-label">¿Estudiante nuevo?</label>
                                                                <div className="selectgroup w-100">
                                                                    <label className="selectgroup-item">
                                                                        <input type="radio" name="nuevo" id="nuevo0" className='selectgroup-input' {...register("nuevo")} value="false" checked />
                                                                        <span className="selectgroup-button">No</span>
                                                                    </label>
                                                                    <label className="selectgroup-item">
                                                                        <input type="radio" name="nuevo" id="nuevo1" className='selectgroup-input' {...register("nuevo")} value="true" />
                                                                        <span className="selectgroup-button">Si</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group">
                                                                <label className="form-label">¿Repitente?</label>
                                                                <div className="selectgroup w-100">
                                                                    <label className="selectgroup-item">
                                                                        <input type="radio" name="repitente" id="repitente0" className='selectgroup-input' {...register("repitente")} value="false" checked />
                                                                        <span className="selectgroup-button">No</span>
                                                                    </label>
                                                                    <label className="selectgroup-item">
                                                                        <input type="radio" name="repitente" id="repitente1" className='selectgroup-input' {...register("repitente")} value="true" />
                                                                        <span className="selectgroup-button">Si</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='valorinscripcion'>Valor inscripción:</label>
                                                                <input type="number" className="form-control" {...register("valorinscripcion")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='valorpension'>Valor pensión:</label>
                                                                <input type="number" className="form-control" {...register("valorpension")} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor='descuento'>Descuento:</label>
                                                                <input type="number" className="form-control" {...register("descuento")} />
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
