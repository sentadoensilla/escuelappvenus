import { Fragment, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
// eslint-disable-next-line
import DatePicker, { registerLocale, setDefaultLocale } from  "react-datepicker";

import swal from 'sweetalert2';
import Select from 'react-select'

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'
import { privateRoutes } from '../../services/routes';

import UserHead from '../components/head'
import { Forbidden } from '../forbidden'
import { Foot } from '../components/foot'

import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es)

export default function SendAttendance(){

    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const ahora = tool.dateNow()


    let uRl = myConst.roots.engine + myConst.roots.asistenciaNew
    let uRlDelete = myConst.roots.engine + myConst.roots.asistenciaDelete
    let titulo = myConst.labels.asistenciaAdd[0][0]
    let tituloDelete = myConst.labels.asistenciaDelete[0][0]

    // eslint-disable-next-line
	let [listado, setListado] = useState([]);

    
    // eslint-disable-next-line
	const [listaTipos, setListaTipos] = useState([])

    // eslint-disable-next-line
	const [listadoGrupos, setListadoGrupos] = useState([])
    // eslint-disable-next-line
    let [elGrupo, setElGrupo] = useState()

    // eslint-disable-next-line
	const [listadoExcusas, setListadoExcusas] = useState([])

    // eslint-disable-next-line
	const [listadoAsignaturas, setListadoAsignaturas] = useState([])
    // eslint-disable-next-line
    let [laAsignatura, setLaAsignatura] = useState([])

    // eslint-disable-next-line
	const [listadoStudents, setListadoStudents] = useState([])
	const [haveStudents, setHaveStudents] = useState(false)


    // eslint-disable-next-line
    const [elStudents, setElStudents] = useState([])



	const { control, watch, trigger, formState: { errors } , handleSubmit } = useForm({});
	const elFade = {form:'elFormulario',response:'laRespuesta'}

	const errorMessage = {class:"text-success",message:""}

    const onRegister = async(data) => {
        if(data!==""){
			setWaiting(waiting => true)
            
            if(data.date_finish === "" || data.date_finish.length < 10){
                swal.fire({
                    icon: 'error',
                    title: 'Faltan cosas!',
                    text: 'Verificar la fecha, la asignatura y el grupo',
                });
                data.date_finish = '';
            }
            else{            
                swal.fire({
                    title: '¿Está seguro?',
                    text: 'Se enviarán notificaciones, no se puede revertir',
                    icon: 'warning' ,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText:'Si',
                    cancelButtonText:'No',
                    customClass: {
                        confirmButton:'btn btn-success',
                        cancelButton:'btn btn-danger'
                    }
                }).then(async answer =>{
                    if(answer.isConfirmed){

                        let formData  = {};
                        const muchacho = [], novedad = []                    
                        
                        formData.fecha = data.date_finish
                        formData.grupo = data.group
                        formData.asignatura = data.asignatura
                        formData.estudiantes = muchacho
                        formData.novedades = novedad

                        const selects = document.querySelectorAll('[name^="estudiante-"]')
                        selects.forEach((item,s) =>{
                            muchacho.push(item.name.replace('estudiante-',''))
                            novedad.push(item.value)
                        })

                        await messenger.poster({
                            method: 'POST',
                            value: formData,
                            url: uRl
                        }).then((resultado) =>{
                            swal.fire({
                                title: resultado.status,
                                text: resultado.message,
                                icon: resultado.status,
                                showConfirmButton: true,
                                showCancelButton: true,
                                customClass: {
                                    confirmButton:'btn btn-primary',
                                    cancelButton:'btn btn-error'
                                }
                            }).then(answer =>{
                                if(answer.isConfirmed){
                                    console.log('Hecho')
                                    // navegar(privateRoutes.COMUNICACION_LIST, { replace: true })
                                }
                            })
                            
                        });
                        
                    }
                })
            }

			setWaiting(waiting => false)
		}
	}

    const deleteAttendance = async() =>{
        

        const formFull  = await trigger() || false

        const fecha = watch("date_finish")||""
        const asignatura = watch("asignatura")||"{}"
        const grupo = watch("group")||""


        if(
            (fecha === "" || fecha.length < 10) ||
            !formFull
        ){
            swal.fire({
                icon: 'error',
                title: 'Faltan cosas!',
                text: 'Verificar la fecha, la asignatura y el grupo',
            });
            tool.scrollId('elgrapper')
        }
        else{            
            swal.fire({
                title: '¿Está seguro?',
                text: 'No se puede revertir',
                icon: 'warning' ,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText:'Si',
                cancelButtonText:'No',
                customClass: {
                    confirmButton:'btn btn-success',
                    cancelButton:'btn btn-danger'
                }
            }).then(async answer =>{
                if(answer.isConfirmed){
                    setWaiting(waiting => true)

                    await messenger.poster({
                        method: 'POST',
                        value: {fecha,grupo,asignatura},
                        url: uRlDelete
                    }).then((resultado) =>{
                        swal.fire({
                            title: resultado.status,
                            text: resultado.message,
                            icon: resultado.status,
                            showConfirmButton: true,
                            showCancelButton: true,
                            customClass: {
                                confirmButton:'btn btn-primary',
                                cancelButton:'btn btn-error'
                            }
                        })                        
                    });

                    setWaiting(waiting => false)
                    
                }
            })
        }

        
    }
    
    // LOAD STUDENTS FROM SERVER
    const handleGroups = (e) => {       
        if(e.value !== null && e.value !== ""){
            getListaStudents(e.value)
            elGrupo = e.value
        }
    }

    const handleNovedad = (m) =>{
        const newElStudents = elStudents.map(obj => {
            if(obj.studend === m.muchacho){
                return {...obj, event: m.value}
            }
            return obj
        })
        setElStudents(antes => newElStudents);
    }

    const getListaExcusas = async(grupillo) => {
        if(grupillo !== null){
            setWaiting(waiting => true)

            await messenger.poster({
                method:'POST',
                url: myConst.roots.engine + myConst.roots.listaExcusas,
                value: {
                    criterio: 0,
                    fecha: watch("date_finish"), 
                    group: grupillo,
                    rol: miUsuario.usuarioRollId
                }
            }) 
            .then((elMensaje) =>{
                if(elMensaje.rows.length>0){
                    setListadoExcusas(antes => elMensaje.rows)
                }
                console.log('listadoExcusas.rows: ', listadoExcusas)
                setWaiting(waiting => false)
            });
            setWaiting(waiting => false)
        }
    }

    const getListaGrupos = async() => {
        setWaiting(waiting => true)

        await messenger.poster({
            method:'POST',
            url: myConst.roots.engine + myConst.roots.listaGrupos,
            value: {
                criterio: 0,
                id_institucion: miUsuario.usuarioEmpresaId, 
                ano_lectivo: miUsuario.usuarioAnoId,
                rol: miUsuario.usuarioRollId
            }
        }) 
        .then((elMensaje) =>{
            if(elMensaje.rows.length>0){
                let preGrupos = []                
                elMensaje.rows.forEach((misGrupos) =>{
                    preGrupos.push({value: misGrupos.code, label: misGrupos.grupo })                     
                })				
                setListadoGrupos(antes => preGrupos)
            }
            setWaiting(waiting => false)
		});
        setWaiting(waiting => false)
    }

    const getListaTipoNovedad = async() => {
        setWaiting(waiting => true)

        await messenger.poster({
            method:'POST',
            url: myConst.roots.engine + myConst.roots.asistenciaTipoNovedad,
            value: {
                criterio: 0,
                rol: miUsuario.usuarioRollId
            }
        }) 
        .then((elMensaje) =>{
            if(elMensaje.rows.length>0){
                let preTipos = []                
                elMensaje.rows.forEach((misTipos) =>{
                    preTipos.push({value: misTipos.idtiponovedad, label: misTipos.tiponovedaddescripcion })                     
                })				
                setListaTipos(antes => preTipos)
            }
            setWaiting(waiting => false)
		});
        setWaiting(waiting => false)
    }

    const getListaAsignaturas = async() => {
        setWaiting(waiting => true)

        await messenger.poster({
            method:'POST',
            url: myConst.roots.engine + myConst.roots.listaAsignaturas,
            value: {
                criterio: 0,
                rol: miUsuario.usuarioRollId
            }
        }) 
        .then((elMensaje) =>{
            if(elMensaje.rows.length>0){
                let preData = []                
                elMensaje.rows.forEach((misMaterias) =>{
                    preData.push({value: misMaterias.asignatura, label: misMaterias.asignatura })                     
                })				
                setListadoAsignaturas(antes => preData)
            }
            setWaiting(waiting => false)
		});
        setWaiting(waiting => false)
    }

    const getListaStudents = async(miGrupo) => {
        setWaiting(waiting => true)

        getListaExcusas(miGrupo);

        await messenger.poster({
            method:'POST',
            url: myConst.roots.engine + myConst.roots.asistenciaListGroup,
            value: {
                header: false,
                group: miGrupo, 
            }
        }) 
        .then((elMensaje) =>{
            if(elMensaje.rows.length>0){
                let preEstudiantes = []                
                elMensaje.rows.forEach((elNino,n) => {
                    if(n>0){
                        preEstudiantes.push({value: elNino.idestudiante, label: elNino.nombreestudiante })
                    }
                })				
                setListadoStudents(antes => preEstudiantes)
                setElStudents(antes => [])
                setHaveStudents(antes => (preEstudiantes.length > 0))
            }
            setWaiting(waiting => false)
		});
        setWaiting(waiting => false)
    }

    useEffect(() => {
        setWaiting(waiting => true)     
        
        getListaAsignaturas()
        getListaTipoNovedad()
        getListaGrupos()

        setWaiting(waiting => false)
       
// eslint-disable-next-line
    }, []);

    
    useEffect(() => {
        if(errors){
            tool.scrollId('elgrapper')
        }
    }, [errors])
      
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
                        <div className="">
                            <div className="page-inner">
                                <div className="page-inner mt--5">
                                    <h1 className="text-center">
                                        <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                                        { titulo } 
                                    </h1>
                                </div>
                            </div>

                            <div className="page-inner mt--1">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center text-right">
                                                    
                                                    <Link to={privateRoutes.EXCUSAS_TEACHER} className="btn btn-secondary btn-round">
                                                        <i className="far fa-envelope-open">&nbsp;&nbsp;</i>
                                                        {myConst.labels.excusasList[0]}
                                                    </Link> &nbsp;&nbsp;                                                   

                                                    <Link to={privateRoutes.ASISTENCIA_TEACHERREPORTE} className="btn btn-primary btn-round">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.asistenciaList[0][0]}
                                                    </Link>  
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group  text-left has-feedback">
                                                                <label htmlFor='date_init'>Asignatura:</label>

                                                                <Controller
                                                                    name="asignatura"
                                                                    control={control}
                                                                    defaultValue={laAsignatura}                                                                    
                                                                    rules={{ required: true }}
                                                                    render={({field: { 
                                                                        onChange, value, name, ref 
                                                                    }}) => (
                                                                        <Select
                                                                            inputRef={ref} 
                                                                            isClearable
                                                                            name={name}
                                                                            defaultValue={laAsignatura} 
                                                                            options={listadoAsignaturas}
                                                                            onChange={miMateria => {onChange(miMateria.value);setLaAsignatura(antes => miMateria.value)}} 
                                                                            />
                                                                    )}
                                                                    />
                                                                    
                                                                    { errors.asignatura?.type === 'required' && <small className="form-text text-danger">¿A qué asignatura apuntamos el registro?</small> }

                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group  text-left has-feedback">
                                                                <label htmlFor='date_finish'>Fecha:</label>
                                                                <Controller 
                                                                    control={control}
                                                                    name='date_finish'
                                                                    defaultValue={ahora.timestamp}
                                                                    render={({ field }) => (
                                                                        <DatePicker locale="es"
                                                                            dateFormat={"yyyy-MM-dd"}
                                                                            className="form-control" placeholderText='AAAA-MM-DD'
                                                                            onChange={(date) => field.onChange(date)}
                                                                            selected={field.value}
                                                                        />
                                                                    )}
                                                                    rules={{ required: true }}
                                                                />
                                                                { errors.date_finish?.type === 'required' && <small className="form-text text-danger">¿Hasta qué fecha pueden ver tu comunicado?</small> }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="group" className="placeholder">Grupo: </label>
                                                           
                                                                <Controller
                                                                    name="group"
                                                                    control={control}                                                                    
                                                                    rules={{ required: true }}
                                                                    defaultValue={elGrupo} 
                                                                    render={({field: { 
                                                                        onChange, value, name, ref 
                                                                        // onChange(value.map(c => c.value)); handleGroups(value)
                                                                    }}) => (
                                                                        <Select
                                                                            inputRef={ref}  
                                                                            isClearable
                                                                            name={name}
                                                                            defaultValue={elGrupo} 
                                                                            options={listadoGrupos}
                                                                            onChange={miGrupo => {onChange(miGrupo.value);handleGroups(miGrupo)}} 
                                                                            />
                                                                    )}
                                                                    />
                                                                    
                                                                    { errors.group?.type === 'required' && <small className="form-text text-danger">¿A qué grupos quieres enviar el comunicado?</small> }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        {
                                                            (haveStudents) && (
                                                            <table className='table table-striped'>
                                                                <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>ESTUDIANTE</th>
                                                                    <th>¿ASISTIO?</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {                                                                        
                                                                        listadoStudents.map((studend,s) => {
                                                                            let miExcusa = ""
                                                                            // eslint-disable-next-line
                                                                            miExcusa = listadoExcusas.map((laExcusa,e) => {
                                                                                if(studend.value.toString() === laExcusa.idestudiante.toString()){
                                                                                    return <Link to={privateRoutes.EXCUSAS_VIEW+'/'+laExcusa.idexcusa} className="btn btn-success btn-round ml-auto"
                                                                                        target="_blank" rel="noopener noreferrer">  
                                                                                                    <i className="far fa-envelope-open">&nbsp;&nbsp;</i>
                                                                                                     Excusa ({laExcusa.tipoexcusa})
                                                                                                </Link>
                                                                                }
                                                                            })

                                                                            elStudents.push({student:studend.value, event: listaTipos[0].value})

                                                                            return (
                                                                                <tr key={studend.value} className='toggle'>
                                                                                    <td>{ (s+1) }</td>
                                                                                    <td className='h3 text-left'>
                                                                                        {studend.label+'    '}
                                                                                        {miExcusa}
                                                                                    </td>
                                                                                    <td className='align-bottom text-right'>
                                                                                        <Select
                                                                                            key={s}
                                                                                            name={'estudiante-'+studend.value}
                                                                                            defaultValue={listaTipos[0]}
                                                                                            options={listaTipos}
                                                                                            onChange={miNovedad => {handleNovedad({node:s,value:miNovedad.value,muchacho:studend.value})}}
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            )
                                                        }
                                                    </div>

                                                    <div className='card-action text-center'>
                                                        <button
                                                            type='submit'
                                                            className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-success ml-1'}
                                                            disabled={errorMessage.message||waiting}
                                                        >
                                                            { titulo }
                                                        </button>&nbsp;&nbsp;
                                                        <button
                                                            className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-danger ml-1'}
                                                            type='button'
                                                            disabled={errorMessage.message||waiting}
                                                            onClick={deleteAttendance}
                                                        >
                                                            { tituloDelete }
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