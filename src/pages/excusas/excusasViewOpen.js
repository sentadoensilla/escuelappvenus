import { Fragment, useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';

import * as myConst from '../../main/constants';
import { UserContext } from '../../services/context/UserContext';
// import UserContext from '../services/context/UserContext';
import { publicRoutes } from '../../services/routes';
import { Foot } from '../components/foot'
import HeadPublic from '../parts/headPublic'
import messenger from "../../services/messenger";
import tool from '../../services/tools';

export default function ExcusaViewOpen() {
    const { reference } = useParams();
    // reference = tool.decriptar(reference)
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
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

	const MiComunicado = async() => {
        setWaiting(waiting => true)
        let preAnuncio = ""
        await messenger.poster({
            method: 'POST',
            value: {
                reference
            },
            url: myConst.roots.engine + myConst.roots.excusaListOpen
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
                        </div>
                    )
                });               
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

    useEffect(() => {
		MiComunicado()
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
                        </div>
                        <div className="m-5 row justify-content-center align-items-center mb-5">
                            
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
                                                        <p className='card-category'>Dirección: { excusa.direccion }</p>
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
