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

export default function ShowAttendanceAdmin(){

    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    const ahora = tool.dateNow()
    
    const meses = [
        {value:'01',label:'ENERO'},
        {value:'02',label:'FEBRERO'},
        {value:'03',label:'MARZO'},
        {value:'04',label:'ABRIL'},
        {value:'05',label:'MAYO'},
        {value:'06',label:'JUNIO'},
        {value:'07',label:'JULIO'},
        {value:'08',label:'AGOSTO'},
        {value:'09',label:'SEPTIEMBRE'},
        {value:'10',label:'OCTUBRE'},
        {value:'11',label:'NOVIEMBRE'},
        {value:'12',label:'DICIEMBRE'}]
    const dias = [' 01',
    ' 02',
    ' 03',
    ' 04',
    ' 05',
    ' 06',
    ' 07',
    ' 08',
    ' 09',
    ' 10',
    ' 11',
    ' 12',
    ' 13',
    ' 14',
    ' 15',
    ' 16',
    ' 17',
    ' 18',
    ' 19',
    ' 20',
    ' 21',
    ' 22',
    ' 23',
    ' 24',
    ' 25',
    ' 26',
    ' 27',
    ' 28',
    ' 29',
    ' 30',
    ' 31']

    let uRl = myConst.roots.engine + myConst.roots.asistenciaListView
    let uRlExport = myConst.roots.engine + myConst.roots.asistenciaListExport
    let titulo = myConst.labels.asistenciaList[0][0]
    
    // eslint-disable-next-line
	const [listaTipos, setListaTipos] = useState([])

    // eslint-disable-next-line
	const [listadoGrupos, setListadoGrupos] = useState([])
    // eslint-disable-next-line
    let [elGrupo, setElGrupo] = useState()
    let [elMes, setElMes] = useState(meses[(ahora.month-1)].value)

    // eslint-disable-next-line
	const [listadoExcusas, setListadoExcusas] = useState([])

    // eslint-disable-next-line
	const [listadoAsignaturas, setListadoAsignaturas] = useState([])
    // eslint-disable-next-line
    let [laAsignatura, setLaAsignatura] = useState()

    // eslint-disable-next-line
	const [listadoStudents, setListadoStudents] = useState([])
	const [haveStudents, setHaveStudents] = useState(false)

	const { control, watch, formState: { errors } , handleSubmit } = useForm({});
	const elFade = {form:'elFormulario',response:'laRespuesta'}

	const errorMessage = {class:"text-success",message:""}

    const handleAsignatura = (event) =>{
        if(!event){
            event = {
                value: "",
                label: ""
            }
        }
        setLaAsignatura(antes => event.value)
    }

    const getAttendance = async() =>{
        const mes = elMes
        const grupo = elGrupo
        const asignatura = laAsignatura||null
        console.log('getAttendance: ', elMes, elGrupo, laAsignatura)
        if(mes && grupo){
            setWaiting(waiting => true)

            await messenger.poster({
                method: 'POST',
                value: {mes,grupo,asignatura},
                url: uRl
            })
            .then((elMensaje) =>{
                if(elMensaje.rows.length > 0){
                    setListadoStudents(elMensaje.rows)
                    setHaveStudents(antes => true)
                    console.log('rows: ', listadoStudents)

                }else{
                    setListadoStudents([])
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
                text: 'Verificar la fecha, la asignatura y el grupo',
            });
            errorMessage.message = ""
            setWaiting(waiting => false)
            tool.scrollId('elgrapper')
        }
    }

    const downloadAttendance = async() => {
        const mes = elMes
        const grupo = elGrupo
        const asignatura = laAsignatura||null
        console.log(mes,grupo)
        if(mes && grupo){
			setWaiting(waiting => true)
			await messenger.getFile({
				method: 'POST',
				value: {
                    mes,grupo,asignatura,
                    filename:`Asistencia_${asignatura||'Grupal'}_${grupo}.xlsx`
                },
				url: uRlExport
			})
			.then((elMensaje) =>{
                console.log('Llegando: ', elMensaje)
				setWaiting(waiting => false)
				// waiting = false
			})
			.catch(error =>{
				setWaiting(waiting => false)
				// waiting = false
				// eslint-disable-next-line
				console.log('catch: ', error)
			});        
        }
        /*
        if(!haveStudents || listadoStudents.length <= 0){
            getAttendance()
        }
        if(haveStudents && listadoStudents.length > 0){
            const worksheet = XLSX.utils.json_to_sheet(listadoStudents);
            const workbook = XLSX.utils.book_new();
            const sheetName = (laAsignatura)? `Asistencia_${elMes}_${elGrupo}_${laAsignatura}.xlsx` : `Asistencia_${elMes}_${elGrupo}.xlsx`;
            XLSX.utils.book_append_sheet(workbook, worksheet, `Asistencias ${elMes}`);
            //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
            //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
            XLSX.writeFile(workbook, sheetName);
        }
        */
    }

    /*
    const downloadAttendanceOLD = async() =>{       

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
                        url: uRlExport
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
    */
    
// eslint-disable-next-line    
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

    useEffect(() => {
        setWaiting(waiting => true)     
        
        getListaAsignaturas()
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
                                                    </Link> &nbsp;&nbsp;   

                                                    <Link to={privateRoutes.ASISTENCIA_SEGUIMIENTO} className="btn btn-secondary btn-round">
                                                        <i className="far fa-eye">&nbsp;&nbsp;</i>
                                                        {myConst.labels.asistenciaView[0][0]}
                                                    </Link> 
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(getAttendance)} method='POST' className="">
                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group  text-left has-feedback">
                                                                <label htmlFor='date_init'>Asignatura: (Dejar libre para ver la asistencia global de un grupo)</label>
                                                                <Controller
                                                                    name="asignatura"                                                                    
                                                                    control={control}
                                                                    defaultValue={laAsignatura}
                                                                    rules={{ required: false }}
                                                                    render={({field: { 
                                                                        onChange, value, name, ref 
                                                                    }}) => (
                                                                        <Select
                                                                            inputRef={ref}
                                                                            isClearable
                                                                            name={name}
                                                                            register={name}
                                                                            defaultValue={laAsignatura} 
                                                                            options={listadoAsignaturas}
                                                                            onChange={handleAsignatura}
                                                                            // onChange={miMateria => {(!miMateria)? setLaAsignatura() : onChange(miMateria.value);setLaAsignatura(antes => miMateria.value)}} 
                                                                            />
                                                                    )}
                                                                    />                                                                    
                                                                    { errors.asignatura?.type === 'required' && <small className="form-text text-danger">¿A qué asignatura apuntamos el registro?</small> }

                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group  text-left has-feedback">
                                                                <label htmlFor='mes'>Mes:</label>
                                                                <Controller
                                                                    name="mes"
                                                                    control={control}
                                                                    rules={{ required: true }}
                                                                    defaultValue={elMes} 
                                                                    render={({field: { 
                                                                        onChange, value, name, ref
                                                                    }}) => (
                                                                        <Select
                                                                            inputRef={ref}
                                                                            name={name}
                                                                            register={name}
                                                                            defaultValue={meses[(ahora.month-1)]} 
                                                                            options={meses}
                                                                            onChange={miMes => {onChange(miMes.value);setElMes(antes => miMes.value)}} 
                                                                            />
                                                                    )}
                                                                    />                                                                    
                                                                    { errors.mes?.type === 'required' && <small className="form-text text-danger">Debes definir un més específico!</small> }
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
                                                                    }}) => (
                                                                        <Select
                                                                            inputRef={ref}
                                                                            name={name}
                                                                            register={name}
                                                                            defaultValue={elGrupo} 
                                                                            options={listadoGrupos}
                                                                            value={listadoGrupos.find(c => c.value === value)}
                                                                            onChange={miGrupo => {onChange(miGrupo.value);setElGrupo(antes => miGrupo.value)}}
                                                                            />
                                                                    )}
                                                                    />                                                                    
                                                                    { errors.group?.type === 'required' && <small className="form-text text-danger">¿La asistencia es del grupo...?</small> }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6 text-center">
                                                            <div className="form-group text-right">

                                                                <button
                                                                    type='submit'
                                                                    className={waiting? 'btn is-loading btn-warning' : 'btn btn-success'}
                                                                    disabled={errorMessage.message||waiting}
                                                                    onClick={getAttendance}
                                                                >
                                                                    <i className="fas fa-glasses">&nbsp;&nbsp;</i>
                                                                    Ver reporte
                                                                </button>&nbsp;&nbsp;
                                                                <button
                                                                    className={waiting? 'btn is-loading btn-warning' : 'btn btn-warning'}
                                                                    type='button'
                                                                    disabled={errorMessage.message||waiting}
                                                                    onClick={downloadAttendance}
                                                                >
                                                                    <i className="fas fa-cloud-download-alt">&nbsp;&nbsp;</i>
                                                                    Descargar reporte
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        {
                                                            (haveStudents) && (
                                                                <div className="table-responsive">
                                                                    <table className="table table-compact table-head-bg-success table-striped table-hover table-bordered table-sm ">
                                                                        <thead>
                                                                        <tr>
                                                                            <th  scope="col text-center">#</th>
                                                                            <th scope="col text-center">CODIGO</th>
                                                                            <th scope="col text-center">ESTUDIANTE</th>
                                                                            {
                                                                                dias.map(dia => {
                                                                                    return (<th key={'tit'+dia} scope="col">{dia}</th>)
                                                                                })
                                                                            }
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {                                                                        
                                                                                listadoStudents.map((estudiante,s) => {
                                                                                    return (
                                                                                        <tr key={'rou'+s}>
                                                                                            <td>{ (s+1) }</td>
                                                                                            <td>{estudiante.codigo}</td>
                                                                                            <td>{estudiante.estudiante}</td>
                                                                                            {
                                                                                                dias.map(dia => {
                                                                                                    return (
                                                                                                        <td>{estudiante[dia]}</td>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                            }
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