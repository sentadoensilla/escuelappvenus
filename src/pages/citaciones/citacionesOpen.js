import { Fragment, useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';

import * as myConst from '../../main/constants';
import { UserContext } from '../../services/context/UserContext';
// import UserContext from '../services/context/UserContext';
import { publicRoutes } from '../../services/routes';
import { Foot } from '../components/foot'
import messenger from "../../services/messenger";
import tool from '../../services/tools';

import { Forbidden } from '../forbidden'
import HeadPublic from '../parts/headPublic'

export default function CitacionesView() {
    const miUsuario =  tool.getUser()
    const { reference } = useParams();
    // const navegar = useNavigate();
	// const navegar = useNavigate();

    // reference = tool.decriptar(reference)
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
   
    const [aviso, setAviso] = useState("");
	const [comunicado, setComunicado] = useState({
        idregistro:'No disponible',
        grupo:'No disponible',
        docente: 'No disponible',
        estudiante:'No disponible',
        estado:'No disponible',
        descripcion:'No disponible',
        fechacitacion:'No disponible',
        fecharegistro:'No disponible',
        lugar:'No disponible',
        motivocitacion:'No disponible',
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

    // eslint-disable-next-line
	const MiCitacion = async() => {
        setWaiting(waiting => true)
        let preAnuncio = ""
        await messenger.poster({
            method: 'POST',
            value: { reference },
            url: myConst.roots.engine + myConst.roots.citacionesListOne
        })
        .then((elMensaje) =>{
            setWaiting(waiting => false)
            
            if(elMensaje.rows.length > 0){

                elMensaje.rows.forEach(element => {
                    setComunicado(miComunicado => ({
                        idregistro:element.idregistro,
                        grupo:element.grupo,
                        docente: element.docente,
                        estudiante:element.estudiante.join(", "),
                        estado:element.estado,
                        descripcion:element.descripcion,
                        fechacitacion:element.fechacitacion,
                        fecharegistro: element.fecharegistro,
                        lugar:element.lugar,
                        motivocitacion:element.motivocitacion,
                        file:element.adjunto||'',
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
                    const sanitized = element.descripcion.split('iframe').join('embed')
                    const fileExtension = element.adjunto.toLowerCase().slice(-4)||''
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
                            <p className='card-category'>
                                <span className="stamp stamp-md bg-danger mr-3">
									<i className="fa fa-users"></i>
								</span>
                                Grupo: { element.grupo.toString().replaceAll(',', ', ') }
                            </p>
                            <p className='card-category'>
                                <span className="stamp stamp-md bg-primary mr-3">
									<i className="fa fa-user-edit"></i>
								</span>
                                Estudiantes: { element.estudiante }
                            </p>
                            <p className='card-category'>
                                <span className="stamp stamp-md bg-warning mr-3">
									<i className="fa fa-question-circle"></i>
								</span>
                                Motivo: { element.motivocitacion }
                            </p>
                            <p className='card-category'>
                                <span className="stamp stamp-md bg-primary mr-3">
									<i className="far fa-calendar-alt"></i>
								</span>                                
                                Fecha de la citación: { element.fechacitacion }
                            </p>
                            <p className='card-category'>
                                <span className="stamp stamp-md bg-danger mr-3">
									<i className="fas fa-map-pin"></i>
								</span>                                
                                Lugar de la citación: { element.lugar }
                            </p>
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

    useEffect(() => {
		// eslint-disable-next-line
        MiCitacion() 
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
            <div id='elgrapper' className='wrapper overlay-sidebar'>
                <HeadPublic />

                <div className='main-panel'>
                    <div className='content'>
                        <div className="panel-header bg-primary-gradient">                          
                            <div className="page-inner py-5">
                                <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                                    <div>
                                        <h2 className='text-white pb-2 fw-bold'>{myConst.essentials.name}</h2>
                                        <h5 className='text-white op-7 mb-2'>
                                            { myConst.essentials.slogan }
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center align-items-center mb-5">

                            <div className="page-inner mt--5">
                                <div className="row mt--2">
                                    <div className="col-md-12">
                                        <div className="card full-height">
                                            <div className="card-body">
                                                <div className="card-title">Citación</div>
                                                <div className="d-flex flex-wrap justify-content-around pb-2 pt-4">
                                                    { aviso }
                                                    {
                                                        comunicado.file.toLowerCase().includes(['pdf']) &&  
                                                            <div className='m-2 text-center'>
                                                                <embed src={myConst.roots.engine + '/'+comunicado.file} width="600" height="600" alt="pdf" pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"></embed>
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
                    <Foot />
                </div>
            </div>
        </Fragment>
	);
}
