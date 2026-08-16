import { Fragment, useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';

import * as myConst from '../../main/constants';
import { UserContext } from '../../services/context/UserContext';
// import UserContext from '../services/context/UserContext';
import { publicRoutes } from '../../services/routes';
import { Foot } from '../components/foot'
import HeadPublic from '../parts/headPublic'
import messenger from "../../services/messenger";
// eslint-disable-next-line
import tool from '../../services/tools';

export default function ObservacionViewOpen() {
    const { reference } = useParams();
    // reference = tool.decriptar(reference)
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
	const [aviso, setAviso] = useState("");
    const [avisoDetalles, setAvisoDetalles] = useState("");
	const [observacion, setObservacion] = useState({
        idregistro:'No disponible',
        grupo:'No disponible',
        docente: 'No disponible',
        estudiantes:'No disponible',
        estado:'No disponible',
        descripcion:'No disponible',
        fechaobservacion:'No disponible',
        asignatura:'No disponible',
        aviso:'No disponible',
        file:'',
        idinstitucion:'No disponible',
        nombreinstitucion:'No disponible',
        calendario:'No disponible',
        direccion: 'No disponible',
        telefono: 'No disponible',
        mail: 'No disponible',
        escudo: 'No disponible',
        facebook: 'No disponible'
    });

    // const deviceinfo = tool.deviceInfo()
	// const navegar = useNavigate();

    /*
    const MiComunicadoLog = async() => {
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

	const MiObservacion = async() => {
        setWaiting(waiting => true)
        let preAnuncio = ""
        await messenger.poster({
            method: 'POST',
            value: { reference },
            url: myConst.roots.engine + myConst.roots.observacionesListOne
        })
        .then((elMensaje) =>{
            setWaiting(waiting => false)
            
            if(elMensaje.rows.length > 0){

                elMensaje.rows.forEach(element => {
                    setObservacion(miObservacion => ({
                        idregistro:element.idregistro,
                        grupo:element.grupo,
                        docente: element.usuarioregistrador,
                        estudiantes:element.nombresestudiantes,
                        estado:element.estado,
                        descripcion:element.descripcion,
                        fechaobservacion:element.fechaobservacion,
                        asignatura:element.asignatura,
                        aviso:element.aviso,
                        file:element.adjunto,
                        anolectivo:element.anolectivo,
                        idinstitucion:element.idinstitucion,
                        nombreinstitucion:element.nombreinstitucion,
                        calendario:element.calendario,
                        direccion:element.direccion,
                        telefono:element.telefono,
                        mail:element.mail,
                        escudo:element.escudo,
                        facebook:element.facebook
                    }))                    
                });

                preAnuncio = elMensaje.rows.map((element,i) => {
                    // const myRegex = /<iframe[^>]+(?<=src=").*?(?=[?"])/g;

                    const sanitized = element.descripcion.split('iframe').join('embed')
                    const fileExtension = (element.adjunto)? (element.adjunto).toLowerCase().slice(-4) : ''

                    let preDetalles = (
                        <div>
                            <div class="row">
                                <div class="col">
                                    <div class="card card-stats card-round">
                                        <div class="card-body ">
                                            <div class="row align-items-center">
                                                <div class="col-icon">
                                                    <div class="icon-big text-center icon-primary bubble-shadow-small">
                                                        <i class="flaticon-users"></i>
                                                    </div>
                                                </div>
                                                <div class="col col-stats ml-3 ml-sm-0">
                                                    <div class="numbers">
                                                        <p class="card-category">Estudiantes</p>
                                                        <h4 class="card-title">{ element.nombresestudiantes.toString().replaceAll(',', ', ') }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 col-md-4">
                                    <div class="card card-stats card-round">
                                        <div class="card-body ">
                                            <div class="row align-items-center">
                                                <div class="col-icon">
                                                    <div class="icon-big text-center icon-secondary bubble-shadow-small">
                                                        <i class="flaticon-users"></i>
                                                    </div>
                                                </div>
                                                <div class="col col-stats ml-3 ml-sm-0">
                                                    <div class="numbers">
                                                        <p class="card-category">Grupo</p>
                                                        <h4 class="card-title">{ element.grupo.toString().replaceAll(',', ', ') }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-4">
                                    <div class="card card-stats card-round">
                                        <div class="card-body">
                                            <div class="row align-items-center">
                                                <div class="col-icon">
                                                    <div class="icon-big text-center icon-info bubble-shadow-small">
                                                        <i class="flaticon-agenda-1"></i>
                                                    </div>
                                                </div>
                                                <div class="col col-stats ml-3 ml-sm-0">
                                                    <div class="numbers">
                                                        <p class="card-category">Asignatura</p>
                                                        <h4 class="card-title">{ element.asignatura }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-4">
                                    <div class="card card-stats card-round">
                                        <div class="card-body">
                                            <div class="row align-items-center">
                                                <div class="col-icon">
                                                    <div class="icon-big text-center icon-danger bubble-shadow-small">
                                                        <i class="flaticon-pen"></i>
                                                    </div>
                                                </div>
                                                <div class="col col-stats ml-3 ml-sm-0">
                                                    <div class="numbers">
                                                        <p class="card-category">Docente</p>
                                                        <h4 class="card-title">{ element.usuarioregistrador }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 col-md-4">
                                    <div class="card card-stats card-round">
                                        <div class="card-body">
                                            <div class="row align-items-center">
                                                <div class="col-icon">
                                                    <div class="icon-big text-center icon-danger bubble-shadow-small">
                                                        <i class="flaticon-alarm-1"></i>
                                                    </div>
                                                </div>
                                                <div class="col col-stats ml-3 ml-sm-0">
                                                    <div class="numbers">
                                                        <p class="card-category">Aviso</p>
                                                        <h4 class="card-title">{ (element.aviso)? 'SI' : 'No' }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-4">
                                    <div class="card card-stats card-round">
                                        <div class="card-body">
                                            <div class="row align-items-center">
                                                <div class="col-icon">
                                                    <div class="icon-big text-center icon-warning bubble-shadow-small">
                                                        <i class="flaticon-folder"></i>
                                                    </div>
                                                </div>
                                                <div class="col col-stats ml-3 ml-sm-0">
                                                    <div class="numbers">
                                                        <p class="card-category">Año lectivo</p>
                                                        <h4 class="card-title">{ element.anolectivo }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-4">
                                    <div class="card card-stats card-round">
                                        <div class="card-body">
                                            <div class="row align-items-center">
                                                <div class="col-icon">
                                                    <div class="icon-big text-center icon-secondary bubble-shadow-small">
                                                        <i class="flaticon-calendar"></i>
                                                    </div>
                                                </div>
                                                <div class="col col-stats ml-3 ml-sm-0">
                                                    <div class="numbers">
                                                        <p class="card-category">Fecha de la observación:</p>
                                                        <h4 class="card-title">{ element.fechaobservacion }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    setAvisoDetalles(preDetalles);

                    return (
                        <div key={i} className='col'>
                            <h2 className='text-center text-danger'>{element.motivocitacion}</h2>
                            {
                                (fileExtension !== '' && ['.png','.jpg','jpeg','.gif'].indexOf(fileExtension) > -1)  &&  
                                    <div className="col px-0 text-center">
                                        <img className="img-fluid center-block" src={myConst.roots.engine + '/'+element.adjunto} alt="joto comunicate preview" />
                                    </div>
                            }
                            <div className='col h1 my-5'
                            dangerouslySetInnerHTML={{__html: sanitized }}></div>
                        </div>
                    )
                });
                // MiPublicidadLog()
                
            }else{
                preAnuncio = elMensaje.rows.map((element,i) => {
                    return (
                        <div key={i} className='col'>
                            <h2 className='text-center text-error'>Observación no disponible</h2>
                            <div className='col'>
                                <h3>La observación que intentas ver no se encuentra disponible</h3>
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

    useEffect(() => {
		MiObservacion()
        // eslint-disable-next-line
    }, []);

	return (
        <Fragment>
            <div id='elgrapper' className='wrapper overlay-sidebar'>
                <HeadPublic />

                <div className='main-panel'>
                    <div className='content'>
                        <div className='panel-header bg-primary-gradient'>
                            <div className='page-inner py-5'>
                                <div className='d-flex align-items-left align-items-md-center flex-column flex-md-row'>
                                    <div>
                                        <h2 className='text-white pb-2 fw-bold'>{myConst.essentials.name}</h2>
                                        <h5 className='text-white op-7 mb-2'>
                                            { myConst.essentials.slogan }
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="m-5 row justify-content-center align-items-center mb-5">
                            
                            <div className="page-inner mt--5">
                                <div className="row mt--2">
                                    <div className="col-md-12">
                                        <div className="card full-height">
                                            <div className="card-body m-5">
                                                <div className="card-title">Observación</div>
                                                <div className="d-flex flex-wrap justify-content-around pb-2 pt-4">
                                                    { aviso }
                                                    {
                                                        (observacion.file) && observacion.file.toLowerCase().includes(['pdf']) &&  
                                                        <div className='m-2 text-center'>
                                                            <embed src={myConst.roots.engine + '/'+observacion.file} width="600" height="600" alt="pdf" pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"></embed>
                                                        </div>                                                           
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {avisoDetalles}
                                </div>
                            </div>

                        </div>
                        <div className='page-inner mt--5'>
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
                                                        <p className='card-category'>Calendario { observacion.calendario }</p>
                                                        <h4 className='card-title'>{ observacion.nombreinstitucion}</h4>
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
                                                        <p className='card-category'>Dirección: { observacion.direccion }</p>
                                                        <h5 className='card-title'>{ observacion.telefono }</h5>
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
                                                            <a href={observacion.facebook} target="_blank" rel="noopener noreferrer">
                                                                <i className='flaticon-facebook text-primary'></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-7 col-stats'>
                                                    <div className='numbers'>
                                                        <p className='card-title'>{ observacion.mail }</p>
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
