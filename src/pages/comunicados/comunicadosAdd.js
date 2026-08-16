import { Fragment, useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
// eslint-disable-next-line
import DatePicker, { registerLocale, setDefaultLocale } from  "react-datepicker";

import swal from 'sweetalert2';
import Select from 'react-select'
// eslint-disable-next-line
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import {
    align,
    font,
    fontColor,
    fontSize,
    formatBlock,
    hiliteColor,
    horizontalRule,
    lineHeight,
    list,
    paragraphStyle,
    table,
    template,
    textStyle,
    image,
    video,
    link
  } from "suneditor/src/plugins";

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

export default function AddAlert(){
    const limitFile = 3145728 // 3Mb
    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);   

    const params = useLocation();

    const ahora = tool.dateNow()


    let uRl = myConst.roots.engine + myConst.roots.alertNew
    let titulo = myConst.labels.alertAdd[0][0]
    
    const editorRef = useRef(null);
    // eslint-disable-next-line
    const log = () => {
      if (editorRef.current) {
        // eslint-disable-next-line
        console.log(editorRef.current.getContent());
      }
    };

    // The sunEditor parameter will be set to the core suneditor instance when this function is called
    const getSunEditorInstance = (sunEditor) => {
        editorRef.current = sunEditor;
    };
    
    const id = (params.state)? params.state.id : null;
    
    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.alertUpdate
        titulo = myConst.labels.alertAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();

    // eslint-disable-next-line
	let [listado, setListado] = useState([]);


     // DEFAULT VALUES FORM
    let  [defaultValues, setDefaultValues] = useState({
        idregistro: id||0,
        title: listado[0]?.titulo||'',
        alcance: listado[0]?.alcance||0,
        date_init: listado[0]?.fechainicio||ahora.timestamp,
        date_finish: listado[0]?.fechafin||ahora.timestamp,
        respuestas: listado[0]?.respuestas||0,
        file: listado[0]?.archivos||'',
        comunicate: listado[0]?.descripcion||'',
        group: listado[0]?.grupos||[],
        student: listado[0]?.estudiantes||[],
        idestado: listado[0]?.idestado||0
    });

    const setDefaults = () => {
        defaultValues = {
            idregistro: id||0,
            title: listado[0]?.titulo||'',
            alcance: listado[0]?.alcance||1,
            date_init: listado[0]?.fechainicio||ahora.timestamp,
            date_finish: listado[0]?.fechafin||ahora.timestamp,
            respuestas: listado[0]?.respuestas||1,
            file: listado[0]?.archivos||'',
            comunicate: listado[0]?.descripcion||'',
            group: listado[0]?.grupos||[],
            student: listado[0]?.estudiantes||[],
            idestado: listado[0]?.idestado||0
        }

        setDefaultValues(defaultValues)
    }

    const setDescription = (text) => {
        defaultValues.comunicate = text
    }

    const setVideoURL = (cosa) => {
        // eslint-disable-next-line
        console.log('la URL del video: ', cosa)        
    }
    
    // eslint-disable-next-line
	const [listaEstados, setListaEstados] = useState([])
    // eslint-disable-next-line
	const [listaAlcances, setListaAlcances] = useState([
        {id:1,text:'Docentes y estudiantes'},
        {id:0,text:'Docentes Unicamente'}
    ])
    // eslint-disable-next-line
	const [listaRespuestas, setListaRespuestas] = useState([
        {id:1,text:'Se aceptan respuestas'},
        {id:0,text:'No deseo respuestas'}
    ])

    // eslint-disable-next-line
    const [elAlcances, setElAlcances] = useState(defaultValues.alcance||1)
    // eslint-disable-next-line
    const [elRespuestas, setElRespuestas] = useState(defaultValues.respuestas||1)
    // eslint-disable-next-line
	const [listadoGrupos, setListadoGrupos] = useState([])
    // eslint-disable-next-line
    let [elGrupo, setElGrupo] = useState([])

    // eslint-disable-next-line
	const [listadoStudents, setListadoStudents] = useState([])
	const [haveStudents, setHaveStudents] = useState(false)
    // eslint-disable-next-line
    let [elStudents, setElStudents] = useState([])
    // eslint-disable-next-line
    const [selectedFile, setSelectedFile] = useState("")
    const [preview, setPreview] = useState()

	const { control, register, reset, formState: { errors } , handleSubmit } = useForm({});
	const elFade = {form:'elFormulario',response:'laRespuesta'}

    // eslint-disable-next-line
    const [elTexto, setElTexto] = useState(listado[0]?.descripcion||'Tengan todos un cordial saludo, les cuento que... ')

	const errorMessage = {class:"text-success",message:""}

	const onRegister = async(data) => {
		if(data!==""){
			setWaiting(waiting => true)
            console.log('data Los grupos y los estudiantes son: ', data, elGrupo, elStudents)
            
            if(new Date(data.fechainicio).getTime() > new Date(data.fechafin).getTime()){
                swal.fire({
                    icon: 'error',
                    title: 'Se presento un error',
                    text: 'La fecha de inicio no puede ser mayor a la fecha final',
                });

                data.fechainicio = '';
                data.fechafin = '';
            }
            else{            
                swal.fire({
                    title: '¿Está seguro de enviar el comunicado?',
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

                        const formData  = new FormData();

                        formData.append('ano_lectivo', miUsuario.usuarioAnoId)
                        formData.append('id_institucion', miUsuario.usuarioEmpresaId)
                        formData.append('id_usuario', miUsuario.usuarioId)
                        formData.append('id_academico', miUsuario.academicoId)
                        formData.append('nombre_institucion', miUsuario.usuarioInstitucionNombre)
                        formData.append('escudo', miUsuario.empresaEscudo)
                        formData.append('rol', miUsuario.usuarioRollId)
                        formData.append('title', data.title)
                        formData.append('date_init', data.date_init)
                        formData.append('date_finish', data.date_finish)
                        formData.append('group', data.group)
                        formData.append('student', data.student)
                        formData.append('alcance', data.alcance)
                        formData.append('respuestas', data.respuestas)
                        formData.append('comunicate', data.comunicate)

                        if(data.file.length > 0 && data.file !== ""){
                            formData.append('file', data.file[0])
                        }
                        

                        await messenger.posterFile({
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
                                    navegar(privateRoutes.COMUNICACION_LIST, { replace: true })
                                }
                            })
                            
                        });
                    }
                })
            }

			setWaiting(waiting => false)
		}
	}

    const handleUpload = (e) => {

        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            e.target.value = '';
            return
        }

        if (e.target.files[0].size > limitFile) {
            setSelectedFile(undefined)
            e.target.value = '';
            swal.fire({
                title: 'El archivo es muy grande',
                text: `El archivo no debe tener mas de ${limitFile/(1024*1024)} Mb`,
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText:'Ok',
                customClass: {
                    confirmButton:'btn btn-warning'
                }
            })
            
        }
        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    };

    // IF CHECK INCLUDE VALUE, ELSE REMOVE IT
    const handleGroups = (e) => {
        // elGrupo= preElegidos
        console.log('PRE la e, elGrupo ', e, elGrupo)
        // f(e.length > 0){
            let preelGrupo = []
            preelGrupo = e.map(elegidos => {
                return elegidos.value
            })
            // defaultValues.group = elGrupo
            // setElGrupo(antes => preelGrupo)
            elGrupo = preelGrupo

            // ONLY ONE GROUP CALLBACK LIST OF STUDENTS AND FILL STATE
            if(e.length === 1){
                getListaStudents(elGrupo[0])
            }else{
                setListadoStudents(antes => [])
                setHaveStudents(antes => false)
            }
        // }
        // elGrupo= preElegidos
        console.log('POS la e, elGrupo ', e, elGrupo)
    }

    //STORE STUDENT CHECKED
    const handleStudents = (p) =>{
        let preelStudents = []
        preelStudents = p.map(elegidos => {
            return elegidos.value
        })
        elStudents = preelStudents

        defaultValues.student = preelStudents

        console.log('preelStudents, elStudents: ', preelStudents, elStudents)
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
                elMensaje.rows.map((misGrupos) =>{
                    preGrupos.push({value: misGrupos.code, label: misGrupos.grupo })                     
                })				
                setListadoGrupos(antes => preGrupos)
                // setElGrupo(defaultValues.grupos)
            }
            setWaiting(waiting => false)
		});
        setWaiting(waiting => false)
    }

    const getListaStudents = async(miGrupo) => {
        setWaiting(waiting => true)

        await messenger.poster({
            method:'POST',
            url: myConst.roots.engine + myConst.roots.listaEstudiantes,
            value: {
                header: true,
                ano_lectivo: miUsuario.usuarioAnoId,
                id_institucion: miUsuario.usuarioEmpresaId,
                group: miGrupo, 
                rol: miUsuario.usuarioRollId
            }
        }) 
        .then((elMensaje) =>{
            if(elMensaje.rows.length>0){
                let preEstudiantes = []                
                elMensaje.rows.map((elNino) => {
                    preEstudiantes.push({value: elNino.idestudiante, label: elNino.nombreestudiante })                     
                })				
                setListadoStudents(antes => preEstudiantes)
                setHaveStudents(antes => (preEstudiantes.length > 0))
            }
            setWaiting(waiting => false)
		});
        setWaiting(waiting => false)
    }

    const recoverRecord = () => {
        const partialListado = [tool.getRecord()]
        listado = partialListado 
        setDefaults()
    };


    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile]) 

    useEffect(() => {
        recoverRecord()
        setWaiting(waiting => true)     

        getListaGrupos()

        setWaiting(waiting => false)
        setDefaults();
        
        reset({...defaultValues});
// eslint-disable-next-line
    }, []);


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
                        <div className="page-inner">
                            <div className="page-inner">
                                <div className="page-inner mt--5">
                                    <h1 className="text-center">
                                        <img src={myConst.essentials.logo} alt="navbar brand" className="navbar-brand" />
                                        { miUsuario.usuarioInstitucionNombre } 
                                    </h1>
                                </div>
                            </div>

                            <div className="page-inner mt--2">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="d-flex align-items-center">
                                                    <h4 className="card-title">{titulo}</h4>
                                                    <Link to={privateRoutes.COMUNICACION_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.alertList[0]}
                                                    </Link>                                                    
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }
                                                    <div className="form-group  text-left has-feedback">
                                                        <label htmlFor='title'>Título comunicado:</label>
                                                        <input type="text" className="form-control" placeholder='Aviso importante para todos...'
                                                        {...register("title", {
                                                            required:true,
                                                            minLength: 5
                                                        })} />
                                                        { errors.title?.type === 'required' && <small className="form-text text-danger">¿De qué trata el comunicado?</small> }
                                                        { errors.title?.type === 'minLength' && <small className="form-text text-danger">El título está corto</small> }													
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group  text-left has-feedback">
                                                                <label htmlFor='date_init'>Visible desde la fecha:</label>
                                                                <Controller 
                                                                    control={control}
                                                                    name='date_init'
                                                                    defaultValue={defaultValues.date_init}
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
                                                                { errors.date_init?.type === 'required' && <small className="form-text text-danger">Desde cuando será visible tu comunicado?</small> }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group  text-left has-feedback">
                                                                <label htmlFor='date_finish'>Visible hasta la fecha:</label>
                                                                <Controller 
                                                                    control={control}
                                                                    name='date_finish'
                                                                    defaultValue={defaultValues.date_finish}
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
                                                                <label htmlFor="group" className="placeholder">Grupos: </label>
                                                           
                                                                <Controller
                                                                    name="group"
                                                                    control={control}
                                                                    defaultValue={defaultValues.group}
                                                                    
                                                                    rules={{ required: true }}
                                                                    render={({field: { 
                                                                        onChange, value, name, ref 
                                                                    }}) => (
                                                                        <Select
                                                                            inputRef={ref} 
                                                                            isMulti 
                                                                            isClearable
                                                                            defaultValue={elGrupo} 
                                                                            options={listadoGrupos}
                                                                            onChange={value => {onChange(value.map(c => c.value)); handleGroups(value)}} 
                                                                            />
                                                                    )}
                                                                    />
                                                                    
                                                                    { errors.group?.type === 'required' && <small className="form-text text-danger">¿A qué grupos quieres enviar el comunicado?</small> }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="file" className="placeholder">Cargar archivo: </label>
                                                                <Controller
                                                                    name="file"
                                                                    control={control}
                                                                    render={({ field: { value, onChange, ...field } }) => (
                                                                        <input type="file" 
                                                                        className="form-control-file" 
                                                                        placeholder='Cargar pdf o imagen'
                                                                        accept="image/png, image/jpg, image/jpeg, image/gif, application/pdf"
                                                                        
                                                                        {...register("file", {
                                                                            required:false,
                                                                            onChange: (e) => {handleUpload(e)},
                                                                            lessThan10MB: (files) => files[0]?.size < limitFile || `Tamaño maximo del volante: ${limitFile/(1024*1024)}`
                                                                        })} />
                                                                    )}
                                                                    rules={{ required: false }}
                                                                />
                                                            </div>
                                                            {selectedFile.type?.includes('image/') &&  
                                                                <div className="col-md-4 px-0 text-center">
                                                                    <img className="img-thumbnail rounded center-block" width="400" src={preview} alt="Img preview" />
                                                                </div>
                                                            }
                                                            {
                                                                selectedFile.type?.includes('/pdf') &&  
                                                                    <div className="card card-stats card-round">
                                                                        <div className="card-body">
                                                                            <div className="row align-items-center">
                                                                                <div className="col-icon">
                                                                                    <div className="icon-big text-center icon-danger bubble-shadow-small">
                                                                                        <i className="fas fa-file-pdf"></i>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col col-stats ml-3 ml-sm-0">
                                                                                    <div className="numbers">
                                                                                        <h4 className="card-title">{ selectedFile.name }</h4>
                                                                                        <p className="card-category">{ (selectedFile.size / (1024*1024)).toFixed(1) } Mb</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            }

                                                        </div>
                                                    </div>

                                                    <div className="form-group text-left has-feedback">
                                                        {
                                                            haveStudents && (
                                                                <div className="form-group text-left has-feedback">
                                                                    <label htmlFor="student" className="placeholder">Estudiantes: </label>
                                                            
                                                                    <Controller
                                                                        name="student"
                                                                        control={control}
                                                                        defaultValue={defaultValues.student}
                                                                        render={({field: { 
                                                                            onChange, value, ref 
                                                                        }}) => (
                                                                            <Select 
                                                                                inputRef={ref}
                                                                                isMulti
                                                                                isClearable
                                                                                defaultValue={elStudents}
                                                                                options={listadoStudents}
                                                                                onChange={value => {onChange(value.map(c => c.value)); handleStudents(value)}} 
                                                                                />
                                                                        )}
                                                                        />
                                                                </div>
                                                            )
                                                        }
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group form-floating-label text-left has-feedback">
                                                                <Controller
                                                                    name="alcance"
                                                                    control={control}
                                                                    defaultValue={elAlcances}
                                                                    render={({ onChange, value, ref }) => (
                                                                            <select value={elAlcances} className="form-control input-border-bottom" 
                                                                            {...register("alcance", {
                                                                                onChange: (e) => {setElAlcances(e.target.value)},
                                                                                required:true
                                                                            })}>
                                                                                <option key="" value="">Seleccione un alcance</option>
                                                                                { 
                                                                                    listaAlcances.map(alcances => {
                                                                                        return <option key={alcances.id} value={alcances.id}>{alcances.text}</option>
                                                                                    })
                                                                                }
                                                                            </select>
                                                                        )}
                                                                        rules={{ required: true }}
                                                                    />
                                                                    <label htmlFor="estado" className="placeholder">Alcance del comunicado</label>
                                                                    { errors.estado?.type === 'required' && <small className="form-text text-danger">¿Activo, eliminado, zombie...?</small> }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group form-floating-label text-left has-feedback">
                                                                <Controller
                                                                    name="respuestas"
                                                                    control={control}
                                                                    defaultValue={elRespuestas}
                                                                    render={({ onChange, value, ref }) => (
                                                                            <select value={elRespuestas} className="form-control input-border-bottom" 
                                                                            {...register("respuestas", {
                                                                                onChange: (e) => {setElRespuestas(e.target.value)},
                                                                                required:true
                                                                            })}>
                                                                                <option key="" value="">¿Se aceptan repuestas?</option>
                                                                                { 
                                                                                    listaRespuestas.map(respuestas => {
                                                                                        return <option key={respuestas.id} value={respuestas.id}>{respuestas.text}</option>
                                                                                    })
                                                                                }
                                                                            </select>
                                                                        )}
                                                                        rules={{ required: true }}
                                                                    />
                                                                    <label htmlFor="respuestas" className="placeholder">¿Se aceptan repuestas?</label>
                                                                    { errors.respuestas?.type === 'required' && <small className="form-text text-danger">¿Quieres respuestas por parte de quienes vean este comunicado?</small> }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group text-left has-feedback">
                                                        <label htmlFor="comunicate" className="placeholder">Descripción del comunicado</label>
                                                        <Controller
                                                            name="comunicate"
                                                            control={control}
                                                            defaultValue={elTexto}
                                                            render={({ field }) => (
                                                                <SunEditor 
                                                                    lang="es"
                                                                    height="380px"
                                                                    {...field}
                                                                    placeholder={elTexto}
                                                                    autoFocus={true}
                                                                    setOptions={{
                                                                        buttonList: [
                                                                            ["undo", "redo"],
                                                                            ["font", "fontSize", "formatBlock"],
                                                                            ["paragraphStyle"],
                                                                            [
                                                                            "bold",
                                                                            "underline",
                                                                            "italic",
                                                                            "strike",
                                                                            "subscript",
                                                                            "superscript"
                                                                            ],
                                                                            ["fontColor", "hiliteColor"],
                                                                            ["removeFormat"],
                                                                            ["outdent", "indent"],
                                                                            ["align", "horizontalRule", "list", "lineHeight"],
                                                                            ["table", "link", "image", "video"]
                                                                        ],
                                                                        formats: ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
                                                                        font: [
                                                                            "Arial",
                                                                            "Calibri",
                                                                            "Comic Sans",
                                                                            "Courier",
                                                                            "Garamond",
                                                                            "Georgia",
                                                                            "Impact",
                                                                            "Lucida Console",
                                                                            "Palatino Linotype",
                                                                            "Segoe UI",
                                                                            "Tahoma",
                                                                            "Times New Roman",
                                                                            "Trebuchet MS"
                                                                        ],
                                                                        plugins: [align,font,fontColor,fontSize,
                                                                            formatBlock,hiliteColor,horizontalRule,
                                                                            lineHeight,list,paragraphStyle,
                                                                            table,template,textStyle,
                                                                            image,video,link
                                                                        ]
                                                                    }}
                                                                    getSunEditorInstance={getSunEditorInstance}
                                                                    onVideoUpload={(tal) => {setVideoURL(tal)}}
                                                                    onChange={(text) => {
                                                                        field.onChange(text)
                                                                        setDescription(text)
                                                                    }}
                                                                />
                                                            )}
                                                            rules={{ required: true }}
                                                        />
                                                        
                                                        { errors.comunicate?.type === 'required' && <small className="form-text text-danger">¿Que va a comunicar?</small> }
                                                    </div>

                                                    <div className='card-action text-center'>
                                                        <button
                                                            type='submit'
                                                            className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
                                                            disabled={errorMessage.message||waiting}
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