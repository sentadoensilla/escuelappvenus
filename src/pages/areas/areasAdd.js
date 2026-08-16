import { Fragment, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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
 * Alta/edición de un área del saber (SAE - public.tabarea).
 * Referencia de estilo: pages/observaciones/observacionesAdd.js
 */
export default function AddArea(){
    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const params = useLocation();

    let uRl = myConst.roots.engine + myConst.roots.areaNew
    let titulo = myConst.labels.areasAdd[0][0]

    const id = (params.state)? params.state.reference : null;

    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.areaUpdate
        titulo = myConst.labels.areasAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();

    const record = (id !== "undefined" && id !== null) ? (tool.getRecord() || {}) : {}

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            descripcion: record.descripcion || '',
            comentario: record.comentario || '',
        }
    });

    const elFade = {form:'elFormulario',response:'laRespuesta'}

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
                        navegar(privateRoutes.AREAS_LIST, { replace: true })
                    }
                })
            });
            setWaiting(waiting => false)
        }
    }

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
                                                    <Link to={privateRoutes.AREAS_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.areasList[0]}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor='descripcion'>Descripción del área:</label>
                                                        <input type="text" className="form-control" placeholder='Matemáticas'
                                                        {...register("descripcion", { required:true })} />
                                                        { errors.descripcion?.type === 'required' && <small className="form-text text-danger">¿Cómo se llama el área?</small> }
                                                    </div>

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor='comentario'>Comentario:</label>
                                                        <textarea className="form-control" rows="3" {...register("comentario")} />
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
