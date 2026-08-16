import { Fragment, useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import swal from 'sweetalert2';
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

import * as myConst from '../../main/constants';
import { UserContext } from '../../services/context/UserContext';
// import UserContext from '../services/context/UserContext';
import { publicRoutes, privateRoutes } from '../../services/routes';
import { Foot } from '../components/foot'
import messenger from "../../services/messenger";
import tool from '../../services/tools';

import { Forbidden } from '../forbidden'
import UserHead from '../components/head'

export default function ExcusasViewResponse() {
    const miUsuario =  tool.getUser()
    const { reference } = useParams();
    const navegar = useNavigate();

    // reference = tool.decriptar(reference)
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);

    let  [listadoComentarios, setListadoComentarios] = useState([])

    // eslint-disable-next-line
    let  [defaultValues, setDefaultValues] = useState({
        comunicate: ''
    });

    const editorRef = useRef(null);

    // The sunEditor parameter will be set to the core suneditor instance when this function is called
    const getSunEditorInstance = (sunEditor) => {
        editorRef.current = sunEditor;
    };    

    const setDescription = (text) => {
        defaultValues.comunicate = text
    }

    const setVideoURL = (cosa) => {
        // eslint-disable-next-line
        console.log('la URL del video: ', cosa)        
    }
    // eslint-disable-next-line
	const { control, register, reset, formState: { errors } , handleSubmit } = useForm({});
	const elFade = {form:'elFormulario',response:'laRespuesta'}
    const errorMessage = {class:"text-success",message:""}
    
    const [aviso, setAviso] = useState("");
	const [excusa, setExcusa] = useState({
        idregistro:'No disponible',
        idinstitucion:'No disponible',
        idestudiante:'No disponible',
        idanolectivo:'No disponible',
        title:'No disponible',
        comunicate:'No disponible',
        date_init:'No disponible',
        date_finish:'No disponible',
        dateregistro:'No disponible',
        emisor:'No disponible',
        idestado:'No disponible',
        estado:'No disponible',
        file:'No disponible',
        group:'No disponible',
        asignatura:'No disponible',
        respuestascantidad:'No disponible',
        respuestas:'No disponible',
        telefonoexcusa:'No disponible',
        nombreinstitucion:'No disponible',
        calendario:'No disponible',
        direccion: 'No disponible',
        telefono: 'No disponible',
        mail: 'No disponible',
        escudo: 'No disponible',
        facebook: 'No disponible'        
    });

    // eslint-disable-next-line
    const [elTexto, setElTexto] = useState(defaultValues.comunicate||'Tengan todos un cordial saludo, en respuesta a su excusa ... ')

	const onRegister = async(data) => {
		if(data!==""){
			setWaiting(waiting => true)
            
            if(data.comunicate.length > 4){
                swal.fire({
                    title: '¿Está seguro de responder?',
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
                        data.reference = reference  
                        data.id_usuario = miUsuario.usuarioId
                        data.tipocomentario = 1

                        await messenger.poster({
                            method: 'POST',
                            value: data,
                            url: myConst.roots.engine + myConst.roots.excusaAnswer
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
                                    navegar(privateRoutes.EXCUSAS_LIST, { replace: true })
                                }
                            })
                            
                        });
                    }
                })
            }else{
                swal.fire({
                    icon: 'error',
                    title: 'Respuesta demasiado corta',
                    text: 'Debe ser más específico en la respuesta',
                });                
            }

			setWaiting(waiting => false)
		}
	}

	const MiComunicado = async() => {
        setWaiting(waiting => true)
        let preAnuncio = ""
        await messenger.poster({
            method: 'POST',
            value: {
                reference
            },
            url: myConst.roots.engine + myConst.roots.excusaList
        })
        .then((elMensaje) =>{
            setWaiting(waiting => false)
            
            if(elMensaje.rows.length > 0){
                let preObject = {}
                elMensaje.rows.forEach(element => {
                    preObject = {
                        idregistro:element.idregistro,
                        idinstitucion:element.idinstitucion,
                        idestudiante:element.idestudiante,
                        idanolectivo:element.idanolectivo,
                        title:element.tipoexcusa,
                        comunicate:element.mensaje,
                        date_init:element.desde,
                        date_finish:element.hasta,
                        dateregistro:element.fecharegistro,
                        emisor:element.estudiante,
                        idestado:element.idestado,
                        estado:element.estado,
                        file:element.adjunto,
                        group:element.grupo,
                        asignatura:element.asignatura.join(','),
                        respuestascantidad:element.respuestas,
                        respuestas:element.inter,
                        telefonoexcusa: element.contacto,
                        nombreinstitucion:element.nombreinstitucion,
                        calendario:element.calendario,
                        direccion:element.direccion,
                        telefono:element.telefono,
                        mail:element.mail,
                        escudo:element.escudo,
                        facebook:element.facebook 
                    }
                    setExcusa(miComunicado => preObject)
                    
                    setListadoComentarios(antes => element.inter)
                });

                preAnuncio = elMensaje.rows.map((element,i) => {
                    // const myRegex = /<iframe[^>]+(?<=src=").*?(?=[?"])/g;
                    // eslint-disable-next-line
                    const sanitized = element.mensaje.split('iframe').join('embed')
                    const fileExtension = (element.adjunto !== null)? element.adjunto.toLowerCase().slice(-3) : 'nopic'

                    return (
                        <div key={i} className='col'>
                            <h2 className='text-center'>{element.tipoexcusa}</h2>
                            {
                                (['png','jpg','jpeg','gif'].indexOf(fileExtension) >= 0 ) &&  
                                    <div className="col px-0 text-center">
                                        <img className="img-fluid center-block" src={element.adjunto} alt="joto comunicate preview" />
                                    </div>
                            }
                            <div className='col card-title'
                            dangerouslySetInnerHTML={{__html: sanitized }}>

                            </div>
                            <div className='row'>
                                <div className='col align-items-center'>
                                    <div className="col-icon">
                                        <div className="icon-big text-center icon-success bubble-shadow-small">
                                            <i className="fas fa-users text-warning h3"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ml-3 ml-sm-0 text-center">
                                        <p>Grupo: </p> <p>{ element.grupo.toString().replaceAll(',', ', ') }</p>
                                    </div>
                                </div>

                                <div className='col align-items-center'>
                                    <div className="col-icon">
                                        <div className="icon-big text-center icon-success bubble-shadow-small">
                                            <i className="fas fa-calendar-minus text-danger h3"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ml-3 ml-sm-0 text-center">
                                        <p> Excusa desde:</p> <p>{ element.desde }</p>
                                    </div>
                                </div>
                                <div className='col align-items-center'>
                                    <div className="col-icon">
                                        <div className="icon-big text-center bubble-shadow-small">
                                            <i className="fas fa-calendar-plus text-success h3"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ml-3 ml-sm-0 text-center">
                                        <p> Excusa hasta: </p> <p>{ element.hasta }</p>
                                    </div>
                                </div>
                                <div className='col align-items-center'>
                                    <div className="col-icon">
                                        <div className="icon-big text-center bubble-shadow-small">
                                            <i className="fas fa-envelope text-danger h3"></i>&nbsp;
                                            <i className="fab fa-whatsapp text-success h3"></i>

                                        </div>
                                    </div>
                                    <div className="col col-stats ml-3 ml-sm-0 text-center">
                                        <p> Contactos: </p> 
                                        <p>{ element.contacto }</p>
                                    </div>
                                </div>
                            </div>
                            <div className='row align-items-center'>
                                <div className="col-icon">
                                    <div className="icon-big text-center icon-success bubble-shadow-small">
                                        <i className="far fa-folder-open text-primary h3"></i>
                                    </div>
                                </div>
                                <div className="col col-stats ml-3 ml-sm-0">
                                    <p>Asignaturas: { element.asignatura.toString().replaceAll(',', ', ') }</p>
                                </div>
                            </div>

                            {
                                (miUsuario.usuarioEmpresaId === element.idinstitucion) &&
                                    <div className="row">
                                        <div className="col-md-12 my-5">
                                            <h4 className="card-title">Responder:</h4>
                                            <form id={elFade.form} onSubmit={handleSubmit(onRegister)} method='POST' className="">
                                                <div className="form-group text-left has-feedback">
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
                                                    
                                                    { errors.comunicate?.type === 'required' && <small className="form-text text-danger">¿Que va a responder?</small> }
                                                </div>

                                                <div className='card-action text-center'>
                                                    <button
                                                        type='submit'
                                                        className={waiting? 'btn is-loading btn-warning ml-1' : 'btn btn-primary ml-1'}
                                                        disabled={errorMessage.message||waiting}
                                                    >
                                                    Responder
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                            }
                        </div>
                    )
                });
                // MiPublicidadLog()
                
            }else{
                preAnuncio = elMensaje.rows.map((element,i) => {
                    return (
                        <div key={i} className='col'>
                            <h2 className='text-center text-error'>Excusa no disponible</h2>
                            <div className='col'>
                                <h3>La excusa que intentas ver no se encuentra disponible</h3>
                                <Link to={publicRoutes.INDEX}>
                                    <h4 className='text-center'>OK</h4>
                                </Link>
                            </div>
                        </div>
                    )
                });

            }
            setAviso(preAnuncio)
        })
        .catch(err =>{
            setWaiting(waiting => false)

            preAnuncio =  (
                    <div className='col'>
                        <h2 className='text-center text-error'>Dificultades técnicas</h2>
                        <div className='col'>
                            {err.toString()}
                            <Link to={publicRoutes.INDEX}>
                                <h4 className='text-center'>OK</h4>
                            </Link>
                        </div>
                    </div>
                )
            setAviso(preAnuncio)
        })
	};

    const Visto = async() =>{
        await messenger.poster({
            method: 'POST',
            value: {
                'reference': reference,
                'id_usuario': miUsuario.usuarioId,
                'tipocomentario': 2
            },
            url: myConst.roots.engine + myConst.roots.excusaAnswer
        })
        .then((resultado) =>{
            console.log('Visto: ', resultado)            
        });        
    };

    useEffect(() => {
		MiComunicado()
        Visto()        
    }, []);

    if(!miUsuario.isLogged){
		navegar(privateRoutes.EXCUSAS_VIEWOPEN+'/'+reference)
	}else{
        return (
            <Fragment>
                <div id='elgrapper' className='wrapper'>
                    <UserHead waiting={waiting} setWaiting={setWaiting} />

                    <div className='main-panel'>
                        <div className='content'>
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
                                    <div className="row mt--2">
                                        <div className="col-md-12">
                                            <div className="card full-height">
                                                <div className="card-body m-5">
                                                    <div className="card-title">Excusa de {excusa.emisor} </div>
                                                    <div className="d-flex flex-wrap justify-content-around pb-2 pt-4">
                                                        { aviso }
                                                        {
                                                            (excusa.file !== null && excusa.file.toLowerCase().includes(['pdf'])) &&  
                                                                <div className='m-2 text-center'>
                                                                    <embed src={excusa.file} width="600" height="600" alt="pdf" pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"></embed>
                                                                </div>                                                            
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {
                                    // SHOW COMMENTS
                                    (listadoComentarios.length > 0) && 
                                        <div className="row">
                                            
                                            <div className="page-inner w-100">
                                            <h4 className="page-title">{listadoComentarios.length} Respuestas:</h4>
                                                <div className="w-100">
                                                    <ul className="timeline">
                                                        {
                                                            listadoComentarios.map((coment,c) => {

                                                                return <li key={c} className={((c % 2) === 0)? "timeline-inverted" : "timeline"}>
                                                                    <div className={"timeline-badge "+coment.usuariorol}><i className="flaticon-chat-7"></i></div>
                                                                    <div className="timeline-panel">
                                                                        <div className="timeline-heading">
                                                                            <h4 className="timeline-title">{coment.usuarionombre}</h4>
                                                                            <p><small className="text-primary"><i className="flaticon-clock-1"></i>{coment.respuestafecha}</small></p>
                                                                        </div>
                                                                        <div className="timeline-body">
                                                                            <p dangerouslySetInnerHTML={{__html: coment.respuestadescripcion.split('iframe').join('embed') }}></p>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                }

                            
                                <div className='page-inner mt--2'>
                                    <div className='row row-card-no-pd mt--2'>
                                        <div className='col-sm-6 col-md-4'>
                                            <div className='card card-stats card-round'>
                                                <div className='card-body '>
                                                    <div className='row'>
                                                        <div className='col-5'>
                                                            <div className='icon-big text-center'>
                                                                <i className='flaticon-home text-primary'></i>
                                                            </div>
                                                        </div>
                                                        <div className='col-7 col-stats'>
                                                            <div className='numbers'>
                                                                <p className='card-category'>Calendario { excusa.calendario }</p>
                                                                <h4 className='card-title'>{ excusa.nombreinstitucion}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-6 col-md-4'>
                                            <div className='card card-stats card-round'>
                                                <div className='card-body'>
                                                    <div className='row'>
                                                        <div className='col-5'>
                                                        <div className='row'>
                                                            <div className='icon-big text-center'>
                                                                <i className='flaticon-placeholder-1 text-danger'></i>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='icon-big text-center'>
                                                                <i className='flaticon-whatsapp text-success'></i>
                                                            </div>
                                                        </div>

                                                        </div>
                                                        <div className='col-7 col-stats'>
                                                            <div className='numbers'>
                                                                <p className='card-category'>{ excusa.direccion }</p>
                                                                <h5 className='card-title'>{ excusa.telefono }</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-6 col-md-4'>
                                            <div className='card card-stats card-round'>
                                                <div className='card-body '>
                                                    <div className='row'>
                                                        <div className='col-5'>
                                                            <div className='row'>
                                                                <div className='icon-big text-center'>
                                                                    <i className='flaticon-envelope text-danger'></i><br/> 
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='icon-big text-center'>
                                                                    <a href={excusa.facebook} target="_blank" rel="noopener noreferrer">
                                                                        <i className='flaticon-facebook text-primary'></i>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-7 col-stats'>
                                                            <div className='numbers'>
                                                                <p className='card-title'>{ excusa.mail }</p>
                                                                <p className='card-category'>
                                                                    <a href={excusa.facebook} target="_blank" rel="noopener noreferrer">
                                                                        Síguenos en facebook
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
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
}
