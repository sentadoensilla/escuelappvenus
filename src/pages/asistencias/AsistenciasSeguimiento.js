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

export default function ViewAttendanceByTeacher(){

    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const ahora = tool.dateNow()
    const antes = tool.addDays(ahora.date, -8)
    
    const dias = ['HORA','domingo','lunes','martes','miércoles','jueves','viernes','sábado']

    let uRl = myConst.roots.engine + myConst.roots.asistenciaSeguimiento
    let titulo = myConst.labels.asistenciaView[0][0]
    
    // eslint-disable-next-line
	const [listadoGrupos, setListadoGrupos] = useState([])
    // eslint-disable-next-line
    let [elGrupo, setElGrupo] = useState()

    // eslint-disable-next-line
	const [listadoAsistencias, setListadoAsistencias] = useState([])
	const [haveStudents, setHaveStudents] = useState(false)

	const { control, watch, formState: { errors } , handleSubmit } = useForm({});
	const elFade = {form:'elFormulario',response:'laRespuesta'}

	const errorMessage = {class:"text-success",message:""}

    const handleGroup = (event) =>{
        if(!event){
            event = {
                value: "",
                label: ""
            }
        }
        elGrupo = event.value
        console.log('event: ', event)
        getAttendance()
    }

    const getAttendance = async() =>{
        const fechainicio = watch("date_init")||""
        const fechafin = watch("date_finish")||""
        const group = elGrupo

        console.log('getAttendance: ', fechainicio, elGrupo, fechafin)
        if(group){
            setWaiting(waiting => true)

            await messenger.poster({
                method: 'POST',
                value: {fechainicio,group,fechafin},
                url: uRl
            })
            .then((elMensaje) =>{
                if(elMensaje.rows.length > 0){
                    console.log('rows: ', elMensaje.rows)

                    let linea = elMensaje.rows.map((horario,d) => {
                        let misDias = [
                            <td>{horario.data.hora} </td>,
                            <td></td>,
                            <td></td>,
                            <td></td>,
                            <td></td>,
                            <td></td>,
                            <td></td>,
                            <td></td>
                        ]
                        
                        horario.data.detalles.forEach((detail,d) =>{
                            console.log('detail: ', horario.data.detalles)

                            let asistieron = <span><i className="fas fa-exclamation-triangle text-warning">&nbsp;&nbsp;</i>&nbsp;Sin Registros</span>
                            if(detail.asistieron!==null){
                                asistieron = <span>
                                    &nbsp;&nbsp; <i className="fa fa-check-square text-success">&nbsp;&nbsp;</i>
                                    &nbsp;{detail.asistieron}
                                    &nbsp;&nbsp; <i className="fas fa-window-close text-danger">&nbsp;&nbsp;</i>
                                    &nbsp;{detail.faltaron}
                                </span>
                            }
                            
                            misDias[detail.dia] = <td title={detail.docente.toLocaleUpperCase()}>
                                <span><i className="fas fa-book-reader text-muted">&nbsp;&nbsp;</i>&nbsp;&nbsp;
                                    {detail.asignatura.toLocaleUpperCase()}</span><br/>
                                {asistieron}<br/>
                            </td>                                        
                        })                       

                        return(<tr key={'rou'+d}>{misDias}</tr>)
                    })


                    setListadoAsistencias(linea)
                    setHaveStudents(antes => true)

                }else{
                    setListadoAsistencias([])
                    setHaveStudents(antes => false)
                    swal.fire({
                        title: elMensaje.status,
                        text: elMensaje.message,
                        icon: elMensaje.status,
                        showConfirmButton: true,
                        showCancelButton: false,
                        customClass: {
                            confirmButton:'btn btn-primary'
                        }
                    }) 
                }                       
            })
            .catch(error =>{
                console.log('error: ', error)
                setWaiting(waiting => false)
            })

            setWaiting(waiting => false)
        }
        else{            
            swal.fire({
                icon: 'error',
                title: 'Faltan cosas!',
                text: 'Verificar las fechas y el grupo',
            });
            errorMessage.message = ""
            setWaiting(waiting => false)
            tool.scrollId('elgrapper')
        }
    }

    const getListaGrupos = async() => {
        setWaiting(waiting => true)

        await messenger.poster({
            method:'POST',
            url: myConst.roots.engine + myConst.roots.listaGrupos,
            value: {
                criterio: 0,
                id_institucion: miUsuario.academicoId, 
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

    useEffect(() => {
        setWaiting(waiting => true)
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
                                                <div className="d-flex align-items-right">
                                                    
                                                    <Link to={privateRoutes.EXCUSAS_TEACHER} className="btn btn-secondary btn-round">
                                                        <i className="far fa-envelope-open">&nbsp;&nbsp;</i>
                                                        {myConst.labels.excusasList[0]}
                                                    </Link> &nbsp;&nbsp;                                                   

                                                    <Link to={privateRoutes.ASISTENCIA_TEACHER} className="btn btn-danger btn-round">
                                                        <i className="far fa-check-circle">&nbsp;&nbsp;</i>
                                                        {myConst.labels.asistenciaAdd[0][0]}
                                                    </Link>  
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(getAttendance)} method='POST' className="">
                                                    <div className="row">
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group  text-left has-feedback">
                                                                <label htmlFor='date_init'>Fecha inicial:</label>
                                                                <Controller 
                                                                    control={control}
                                                                    name='date_init'
                                                                    defaultValue={antes}
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
                                                                { errors.date_init?.type === 'required' && <small className="form-text text-danger">Elija el inicio de una semana!</small> }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group  text-left has-feedback">
                                                                <label htmlFor='date_finish'>Fecha final:</label>
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
                                                                { errors.date_finish?.type === 'required' && <small className="form-text text-danger">Aquí seleccione el final de una semana</small> }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-4">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="group" className="placeholder">Grupo: </label>
                                                                <Controller
                                                                    name="group"                                                                    
                                                                    control={control}
                                                                    rules={{ required: true }}
                                                                    defaultValue={elGrupo} 
                                                                    render={({field: { 
                                                                        onChange, value, name, ref 
                                                                    }}) => (
                                                                        <Select
                                                                            inputRef={ref}
                                                                            name={name}
                                                                            register={name}
                                                                            defaultValue={elGrupo} 
                                                                            options={listadoGrupos}
                                                                            value={listadoGrupos.find(c => c.value === value)}
                                                                            onChange={miGrupo => {onChange(miGrupo.value);setElGrupo(miGrupo.value);handleGroup(miGrupo)}}
                                                                            />
                                                                    )}
                                                                    />                                                                    
                                                                    { errors.group?.type === 'required' && <small className="form-text text-danger">¿La asistencia es del grupo...?</small> }
                                                            </div>                                                                
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        {
                                                            (haveStudents) && (
                                                                <div className="table-responsive">
                                                                    <table className="table table-head-bg-info mt-4 table-head-bg-primary table-striped table-hover table-bordered table-sm ">
                                                                        <thead>
                                                                        <tr>
                                                                            {
                                                                                dias.map(dia => {
                                                                                    return (<th key={'tit'+dia} scope="col" className='text-center'>{dia.toLocaleUpperCase()}</th>)
                                                                                })
                                                                            }
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {listadoAsistencias}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )
                                                        }
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