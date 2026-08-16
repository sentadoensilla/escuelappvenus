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

export default function ComunicadoViewResponse() {
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
	const [comunicado, setComunicado] = useState({
        idregistro:'No disponible',
        idusuario:'No disponible',
        title:'No disponible',
        comunicate:'No disponible',
        date_init:'No disponible',
        date_finish:'No disponible',
        dateregistro:'No disponible',
        emisor:'No disponible',
        estado:'No disponible',
        file:'No disponible',
        group:'No disponible',
        idestado:'No disponible',
        respuestas:'No disponible',
        student:'No disponible',
        alcance:'No disponible',
        comentarios:'No disponible',
        idinstitucion:'No disponible',
        nombreinstitucion:'No disponible',
        calendario:'No disponible',
        direccion: 'No disponible',
        telefono: 'No disponible',
        mail: 'No disponible',
        escudo: 'No disponible',
        facebook: 'No disponible'
    });

    const deviceinfo = tool.deviceInfo()

    // eslint-disable-next-line
    const [elTexto, setElTexto] = useState(defaultValues.comunicate||'Tengan todos un cordial saludo, en respuesta a su comunicado ... ')

	// const navegar = useNavigate();

    /*
    const MiPublicidadLog = async() => {
        await messenger.poster({
            method: 'POST',
            value: {
                reference,
                deviceinfo
            },
            url: myConst.roots.engine + myConst.roots.publicidadViewLog
        })
        .then((elMensaje) =>{
            // eslint-disable-next-line
            console.log(elMensaje.message)
        })      
    }
    */

	const onRegister = async(data) => {
		if(data!==""){
			setWaiting(waiting => true)
            
            if(data.comunicate.length > 4){
                swal.fire({
                    title: '¿Está seguro de responder el comunicado?',
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
                        data.ano_lectivo = miUsuario.usuarioAnoId
                        data.id_institucion = miUsuario.usuarioEmpresaId
                        data.id_usuario = miUsuario.usuarioId
                        data.id_academico = miUsuario.academicoId
                        data.reference = reference
                        data.rol = miUsuario.usuarioRollId
                        data.grupo = miUsuario.usuarioGrupo
                        data.grado = miUsuario.usuarioGrado
                        

                        await messenger.poster({
                            method: 'POST',
                            value: data,
                            url: myConst.roots.engine + myConst.roots.alertAnswer
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
            url: myConst.roots.engine + myConst.roots.alertListOne
        })
        .then((elMensaje) =>{
            // eslint-disable-next-line
            console.log('elMensaje: ', elMensaje)
            setWaiting(waiting => false)
            
            if(elMensaje.rows.length > 0){

                elMensaje.rows.forEach(element => {
                    setComunicado(miComunicado => ({
                        idregistro:element.idregistro,
                        idusuario:element.idusuario,
                        title:element.title,
                        comunicate:element.comunicate,
                        date_init:element.date_init,
                        date_finish:element.date_finish,
                        dateregistro:element.dateregistro,
                        emisor:element.emisor,
                        estado:element.estado,
                        file:element.file,
                        group:element.group,
                        idestado:element.idestado,
                        respuestas:element.respuestas,
                        student:element.student,
                        alcance:element.alcance,
                        comentarios:element.comentarios,
                        idinstitucion:element.idinstitucion,
                        nombreinstitucion:element.nombreinstitucion,
                        calendario:element.calendario,
                        direccion: element.direccion,
                        telefono: element.telefono,
                        mail: element.mail,
                        escudo: element.escudo,
                        facebook: element.facebook
                    }))                    
                });

                preAnuncio = elMensaje.rows.map((element,i) => {
                    // const myRegex = /<iframe[^>]+(?<=src=").*?(?=[?"])/g;
                    // eslint-disable-next-line
                    // console.log('la iframe url: ', myRegex.exec(element.descripcion ))
                    const sanitized = element.comunicate.split('iframe').join('embed')
                    const fileExtension = (comunicado.file||'').toLowerCase().slice(-4)
                    return (
                        <div key={i} className='col'>
                            <h2 className='text-center'>{element.title}</h2>
                            {
                                (fileExtension !== "" && ['.png','.jpg','jpeg','.gif'].indexOf(fileExtension) > -1)  &&  
                                    <div className="col px-0 text-center">
                                        <img className="img-fluid center-block" src={myConst.roots.engine + '/' +comunicado.file} alt="joto comunicate preview" />
                                    </div>
                            }
                            <p className='card-category'>
                                <span className="stamp stamp-md bg-danger mr-3">
									<i className="fa fa-users"></i>
								</span>
                                Grupos: { comunicado.group.toString().replaceAll(',', ', ') }
                            </p>
                            <p className='card-category'>
                                <span className="stamp stamp-md bg-success mr-3">
									<i className="far fa-calendar-alt"></i>
								</span>                            
                                Disponible desde: { comunicado.date_init }
                            </p>
                            <p className='card-category'>
                                <span className="stamp stamp-md bg-error mr-3">
									<i className="far fa-calendar-alt"></i>
								</span>
                                Disponible hasta: { comunicado.date_finish }
                            </p>
                            <div className='col'
                            dangerouslySetInnerHTML={{__html: sanitized }}></div>
                            {
                                (comunicado.respuestas) &&
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
                            <h2 className='text-center text-error'>Comunicado no disponible</h2>
                            <div className='col'>
                                <h3>El anuncio que intentas ver no se encuentra disponible</h3>
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

    const MisComentarios = async () =>{
        const formDataAnswer = {}
        formDataAnswer.reference = reference
        formDataAnswer.rol = miUsuario.usuarioRollId
        formDataAnswer.id_academico = miUsuario.academicoId
        formDataAnswer.ano_lectivo = miUsuario.usuarioAnoId
        formDataAnswer.id_institucion = miUsuario.usuarioEmpresaId
        formDataAnswer.id_usuario = miUsuario.usuarioId

        await messenger.poster({
            method: 'POST',
            value: formDataAnswer,
            url: myConst.roots.engine + myConst.roots.alertCommentsList
        }).then((resultado) =>{
            if(resultado.rows.length > 0){
                setListadoComentarios(antes => resultado.rows)
            }
        });
    }

    useEffect(() => {
        MisComentarios()
		MiComunicado()        
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
                                                <div className="card-title">Comunicado</div>
                                                <div className="d-flex flex-wrap justify-content-around pb-2 pt-4">
                                                    { aviso }
                                                    {
                                                        comunicado.file.toLowerCase().includes(['pdf']) &&  
                                                            <div className='m-2 text-center'>
                                                                <embed src={comunicado.file} width="600" height="600" alt="pdf" pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"></embed>
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
                                    <div class="row">
                                        
                                        <div class="page-inner w-100">
                                        <h4 class="page-title">Respuestas:</h4>
                                            <div class="w-100">
                                                <ul class="timeline">
                                                    {
                                                        listadoComentarios.map((coment,c) => {

                                                            return <li class={((c % 2) === 0)? "timeline-inverted" : "timeline"}>
                                                                <div class={"timeline-badge "+coment.rol}><i class="flaticon-chat-7"></i></div>
                                                                <div class="timeline-panel">
                                                                    <div class="timeline-heading">
                                                                        <h4 class="timeline-title">{coment.usuario}</h4>
                                                                        <p><small class="text-primary"><i class="flaticon-clock-1"></i>{coment.fecha}</small></p>
                                                                    </div>
                                                                    <div class="timeline-body">
                                                                        <p dangerouslySetInnerHTML={{__html: coment.descripcion.split('iframe').join('embed') }}></p>
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
                                                            <p className='card-category'>Calendario { comunicado.calendario }</p>
                                                            <h4 className='card-title'>{ comunicado.nombreinstitucion}</h4>
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
                                                            <p className='card-category'>{ comunicado.direccion }</p>
                                                            <h5 className='card-title'>{ comunicado.telefono }</h5>
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
                                                                <a href={comunicado.facebook} target="_blank" rel="noopener noreferrer">
                                                                    <i className='flaticon-facebook text-primary'></i>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-7 col-stats'>
                                                        <div className='numbers'>
                                                            <p className='card-title'>{ comunicado.mail }</p>
                                                            <p className='card-category'>
                                                                <a href={comunicado.facebook} target="_blank" rel="noopener noreferrer">
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
