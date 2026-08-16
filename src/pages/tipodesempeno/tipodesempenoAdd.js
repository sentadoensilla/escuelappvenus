import { Fragment, useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
// eslint-disable-next-line
import DatePicker, { registerLocale } from  "react-datepicker";

import swal from 'sweetalert2';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools'
import { privateRoutes } from '../../services/routes';

import UserHead from '../components/head'
import { Forbidden } from '../forbidden'
import { Foot } from '../components/foot'

export default function AddTipoDesempeno(){
    const limitFile = 3145728 // 3Mb

    const miUsuario =  tool.getUser()
    // eslint-disable-next-line
    const { waiting, setWaiting, elUsuario } = useContext(UserContext);   

    const params = useLocation();

    const ahora = tool.dateNow()


    let uRl = myConst.roots.engine + myConst.roots.tipoDesempenoNew
    let titulo = myConst.labels.tipoDesempenoAdd[0][0]

    
    const id = (params.state)? params.state.reference : null;
    
    if(id !== "undefined" && id !== null){
        uRl = myConst.roots.engine + myConst.roots.tipoDesempenoUpdate
        titulo = myConst.labels.tipoDesempenoAdd[1][0]
    }else{
        tool.removeStorage("record")
    }

    const navegar = useNavigate();

    // eslint-disable-next-line
	let [listado, setListado] = useState([]);


     // DEFAULT VALUES FORM
    let  [defaultValues, setDefaultValues] = useState({
        idregistro: id||0,
        student: listado[0]?.estudiante||'',
        group: listado[0]?.grupo||'',
        usuario: listado[0]?.usuarioid||'',
        aviso: listado[0]?.aviso||true,
        asignatura: listado[0]?.asignatura||'',
        descripcion: listado[0]?.descripcion||'',
        date_register: listado[0]?.fecha||ahora.timestamp,
        file: listado[0]?.adjunto||'',
        estado: listado[0]?.estado||'',
        idestado: listado[0]?.estadoid||0
    });

    const setDefaults = () => {
        defaultValues = {
            idregistro: id||0,
            student: listado[0]?.estudiante||'',
            group: listado[0]?.grupo||'',
            usuario: listado[0]?.usuarioid||'',
            aviso: listado[0]?.aviso||true,
            asignatura: listado[0]?.asignatura||'',
            descripcion: listado[0]?.descripcion||'',
            date_register: listado[0]?.fecha||ahora.timestamp,
            file: listado[0]?.adjunto||'',
            estado: listado[0]?.estado||'',
            idestado: listado[0]?.estadoid||0
        }

        setDefaultValues(defaultValues)
    }


    // eslint-disable-next-line
    const [elAviso, setElAviso] = useState(defaultValues.aviso||1)
    // eslint-disable-next-line
	const [listadoGrupos, setListadoGrupos] = useState([])
    // eslint-disable-next-line
	const [listadoMotivos, setListadoMotivos] = useState([])
    // eslint-disable-next-line
	const [listadoAsignaturas, setListadoAsignaturas] = useState([])
    // eslint-disable-next-line
    let [elGrupo, setElGrupo] = useState([])

    // eslint-disable-next-line
	const [listadoStudents, setListadoStudents] = useState([])
	const [haveStudents, setHaveStudents] = useState(false)
    // eslint-disable-next-line
    let [elStudents, setElStudents] = useState([])
    // eslint-disable-next-line
    let [elAsignatura, setElAsignatura] = useState([])
    // eslint-disable-next-line
    const [selectedFile, setSelectedFile] = useState("")
    const [preview, setPreview] = useState()

	const { control, register, reset, formState: { errors } , handleSubmit } = useForm({});
	const elFade = {form:'elFormulario',response:'laRespuesta'}

    // eslint-disable-next-line
    const [elNombre, setElNombre] = useState(listado[0]?.nombre)

	const errorMessage = {class:"text-success",message:""}

	const onRegister = async(data) => {
		if(data!==""){
			setWaiting(waiting => true)
            
            if(data.nombre === ''){
                swal.fire({
                    icon: 'error',
                    title: 'Se presentó un error',
                    text: 'Necesitamos saber el nombre del tipo de desempeño',
                });
            }
            else{            
                swal.fire({
                    title: '¿Está seguro de registrar el tipo de desempeño?',
                    text: (data.aviso==="1")? 'Se enviarán notificaciones, no se puede revertir' : 'No vamos a enviar notificacines',
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

                        formData.append('nombre', data.nombre)
                        

                        await messenger.posterFile({
                            method: 'POST',
                            value: formData,
                            url: uRl
                        }).then((resultado) =>{
                            swal.fire({
                                title: myConst.protocolMessages.status[resultado.statusCode],
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
                                    navegar(privateRoutes.TIPODESEMPENO_LIST, { replace: true })
                                }
                            })
                            
                        });
                    }
                })
            }

			setWaiting(waiting => false)
		}
	}


    //STORE STUDENT CHECKED
    const handleStudents = (p) =>{
        let preelStudents = []
        preelStudents = p.map(elegidos => {
            return elegidos.value
        })
        elStudents = preelStudents
        defaultValues.student = preelStudents
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


    useEffect(() => {
        recoverRecord()
        setWaiting(waiting => true)    

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
                                        { titulo } 
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
                                                    <Link to={privateRoutes.TIPODESEMPENO_LIST} className="btn btn-primary btn-round ml-auto">
                                                        <i className="fa fa-list">&nbsp;&nbsp;</i>
                                                        {myConst.labels.tipoDesempenoList[0]}
                                                    </Link>                                                    
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                    { (id !== "undefined" && id !== null) ? <input type="hidden" value={id} {...register("idregistro")} /> : "" }

                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="form-group text-left has-feedback">
                                                                <label htmlFor="group" className="placeholder">Nombre del tipo de desempeño: </label>                                                           
                                                                <input
                                                                    type='text'
                                                                    autoFocus
                                                                    className='form-control form-control'
                                                                    {...register("nombre", { required: true })}
                                                                    placeholder='Desempeño importante'
                                                                    onChange={(e) => setElNombre(e.target.value)}
                                                                    value={elNombre}
                                                                />                                                                  
                                                                { errors.nombre?.type === 'required' && <small className="form-text text-danger">¡Debe especificar un nombre para el tipo de desempeño!</small> }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='card-action text-center my-5'>
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