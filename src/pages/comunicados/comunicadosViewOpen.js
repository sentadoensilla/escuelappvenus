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

export default function PublicidadView() {
    const { reference } = useParams();
    // reference = tool.decriptar(reference)
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
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
                    const fileExtension = comunicado.file.toLowerCase().slice(-3)
                    return (
                        <div key={i} className='col'>
                            <h2 className='text-center'>{element.title}</h2>
                            {
                                ['png','jpg','jpeg','gif'].indexOf(fileExtension)  &&  
                                    <div className="col px-0 text-center">
                                        <img className="img-fluid center-block" src={comunicado.file} alt="joto comunicate preview" />
                                    </div>
                            }
                            <div className='col'
                            dangerouslySetInnerHTML={{__html: sanitized }}></div>
                        </div>
                    )
                });
                // MiComunicadoLog()
                
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

    useEffect(() => {
		MiComunicado()
        // eslint-disable-next-line
    }, [aviso]);

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
                                                        <p className='card-category'>Dirección: { comunicado.direccion }</p>
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
