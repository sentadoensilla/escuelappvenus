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
 * Alta/edición de una asignatura (SAE - public.tabasig).
 * Referencia de estilo: pages/observaciones/observacionesAdd.js
 */
export default function AddAsignatura(){
    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.asignaturaNew
    let titulo = myConst.labels.asignaturasAdd[0][0]

    const id = (params.state)? params.state.reference : null;

    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.asignaturaUpdate
        titulo = myConst.labels.asignaturasAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();

    const record = (id !== "undefined" && id !== null) ? (tool.getRecord() || {}) : {}

    const enmascarar = (valor) => (valor !== undefined && valor !== null && valor !== '') ? tool.encriptar(String(valor)) : ''

    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            descripcion: record.descripcion || '',
            idarea: enmascarar(record.idarea),
            abreviatura: record.abreviatura || '',
            evaluable: (record.evaluable === true) ? 'true' : 'false',
        }
    });

    const elFade = {form:'elFormulario',response:'laRespuesta'}

    const [areas, setAreas] = useState([])

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
            data.evaluable = (data.evaluable === 'true')
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
                        navegar(privateRoutes.ASIGNATURAS_LIST, { replace: true })
                    }
                })
            });
            setWaiting(waiting => false)
        }
    }

    useEffect(() => {
        cargarOpciones(myConst.roots.areaList, setAreas, d => d.descripcion)
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
                                                    <Link to={privateRoutes.ASIGNATURAS_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.asignaturasList[0]}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor='descripcion'>Descripción de la asignatura:</label>
                                                        <input type="text" className="form-control" placeholder='Álgebra'
                                                        {...register("descripcion", { required:true })} />
                                                        { errors.descripcion?.type === 'required' && <small className="form-text text-danger">¿Cómo se llama la asignatura?</small> }
                                                    </div>

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
                                                            <div className={errors.abreviatura ? 'form-group text-left has-error has-feedback' : 'form-group text-left has-feedback'}>
                                                                <label htmlFor='abreviatura'>Abreviatura:</label>
                                                                <input
                                                                    id="abreviatura"
                                                                    type="text"
                                                                    className="form-control text-uppercase"
                                                                    placeholder='Ej: MAT'
                                                                    maxLength={5}
                                                                    autoComplete="off"
                                                                    autoCapitalize="characters"
                                                                    title="Máximo 5 caracteres y en mayúsculas"
                                                                    {...register("abreviatura", {
                                                                        maxLength: 5,
                                                                        pattern: /^[A-Z0-9]{0,5}$/,
                                                                        onChange: (e) => {
                                                                            const laAbreviatura = String(e.target.value || '')
                                                                                .toUpperCase()
                                                                                .replace(/[^A-Z0-9]/g, '')
                                                                                .slice(0, 5)
                                                                            if (e.target.value !== laAbreviatura) {
                                                                                e.target.value = laAbreviatura
                                                                            }
                                                                            setValue('abreviatura', laAbreviatura, { shouldValidate: true })
                                                                            return laAbreviatura
                                                                        },
                                                                    })}
                                                                />
                                                                { errors.abreviatura?.type === 'maxLength' && <small className="form-text text-danger">La abreviatura admite máximo 5 caracteres</small> }
                                                                { errors.abreviatura?.type === 'pattern' && <small className="form-text text-danger">Sólo letras y números, máximo 5 y en mayúsculas</small> }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="form-label">¿Evaluable?</label>
                                                        <div className="selectgroup w-100">
                                                            <label className="selectgroup-item">
                                                                <input type="radio" name="evaluable" id="eval0" className='selectgroup-input' {...register("evaluable")} value="false" checked />
                                                                <span className="selectgroup-button">No</span>
                                                            </label>
                                                            <label className="selectgroup-item">
                                                                <input type="radio" name="evaluable" id="eval1" className='selectgroup-input' {...register("evaluable")} value="true" />
                                                                <span className="selectgroup-button">Si</span>
                                                            </label>
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
