import { Fragment, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../../services/context/UserContext';
import { privateRoutes } from '../../services/routes';
// eslint-disable-next-line
import * as myConst from '../../main/constants';
// eslint-disable-next-line
import messenger from '../../services/messenger';
import tool from '../../services/tools';

export const WidgetWhatsappStatus = (props) => {
    const miUsuario = tool.getUser()

    const [listaContactos, setListaContactos] = useState([])
    // eslint-disable-next-line
	const { waiting, setWaiting } = useContext(UserContext);

    const listWP =  async() =>{        
        setWaiting(waiting => true)

        await messenger.poster({
            method: 'POST',
            value: {
                'campana': miUsuario.usuarioCampanaId
            },
            url: myConst.roots.engine + myConst.roots.wplistStatus
        }).then((elMensaje) =>{
            setListaContactos(listaContactos => elMensaje.message.rows)
        });
        setWaiting(waiting => false)
    }


    useEffect(() => {
        listWP()

    }, [])

    
        return ( 
            <Fragment>
                    <div className="row">
                    <div className="col-md-12">
                        <div className="card full-height">
                            <div className="card-body">
                                {
                                    (miUsuario.picProfile==="") ?
                                        <div key="checkflyer" className="d-flex">
                                            <div className="avatar avatar-offline">
                                                <span className="avatar-title rounded-circle border border-white bg-danger"><i className="fas fa-user-edit"> </i> </span>
                                            </div>
                                            <div className="flex-1 ml-3 pt-1">
                                                <span className="text-uppercase text-danger fw-bold mb-1">Lo primero es cargar el volante del tarjetón<span className="text-success pl-3"></span></span>
                                                <span className="text-muted">Ir a Configuración -&gt; Configuración de usuarios, se hace una sola vez</span>
                                                <span className="float-right pt-1">
                                                    <small className="text-muted">
                                                        <Link
                                                            type='button'
                                                            className='btn btn-danger btn-sm'
                                                            to={privateRoutes.USUARIO_PROFILE}
                                                        ><i className="fas fa-user-edit"></i> Cargar Volante
                                                        </Link>
                                                    </small>
                                                </span>

                                            </div>
                                        </div>
                                    :
                                        ""

                                }
                                <div key="checknamba" className="d-flex">
                                    <div className="avatar avatar-offline">
                                        <span className="avatar-title rounded-circle border border-white bg-danger"><i className="fab fa-whatsapp"> </i> </span>
                                    </div>
                                    <div className="flex-1 ml-3 pt-1">
                                        <span className="text-uppercase text-danger fw-bold mb-1">Diariamente debes tener al menos 1 whatsapp cargado<span className="text-success pl-3"></span></span>
                                        <span className="text-muted">Ir a Configuración -&gt; Whatsapp, debe hacerlo una vez al dia</span>
                                        <span className="float-right pt-1">
                                            <small className="text-muted">
                                                <Link
                                                    type='button'
                                                    className='btn btn-danger btn-sm'
                                                    to={privateRoutes.EMISORES}
                                                ><i className="fab fa-whatsapp"></i> Cargar QR
                                                </Link>
                                            </small>
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    {
                        (listaContactos.length > 0)?
                        
                            listaContactos.map(item => {
                                if(parseInt(item.estado) === 6){
                                    return (
                                        <div key={item.emisor} className="col-12 col-sm-6 col-md-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h5 className="text-success">{item.emisor} <small><span><b> Conectado</b></span></small></h5>
                                                            <p className="text-info">
                                                                <i className="fas fa-user-plus"></i> {item.newvoters} Votantes registrados hoy
                                                            </p>
                                                        </div>
                                                        <h3 className="text-success fw-bold">
                                                            <span>
                                                                <i className="flaticon-whatsapp"></i>
                                                            </span>
                                                        </h3>
                                                    </div>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-success w-75" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-2">
                                                        <p className="text-muted mb-0">
                                                            <small className="text-muted">
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-info btn-sm'
                                                                ><i className="fas fa-bullhorn"></i> {item.publicidadenviados} Publicidades</button>                                                                                    
                                                            </small>
                                                        </p>
                                                        <p className="text-muted mb-0">
                                                            <small className="text-muted">
                                                                <button
                                                                type='button'
                                                                className='btn btn-success btn-sm'
                                                            ><i className="fas fa-paper-plane"></i> {item.volantesenviados} Volantes</button>
                                                            </small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }else{
                                    return (
                                        <div key={item.emisor} className="col-12 col-sm-6 col-md-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h5 className="text-danger">{item.emisor} <small><span><b> Debe cargar QR</b></span></small></h5>
                                                            <p className="text-danger">
                                                                <i className="fas fa-user-plus"></i> {item.newvoters} Votantes registrados hoy,  
                                                                
                                                            </p>  
                                                        </div>
                                                        <h3 className="text-danger fw-bold">
                                                            <span>
                                                                <i className="flaticon-whatsapp"></i>
                                                            </span>
                                                        </h3>
                                                    </div>
                                                    <div className="progress progress-sm">
                                                        <div className="progress-bar bg-danger w-25" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-2">
                                                        <p className="text-muted mb-0">
                                                            <small className="text-muted">
                                                                <Link
                                                                    type='button'
                                                                    className='btn btn-danger btn-sm'
                                                                    to={privateRoutes.EMISORES}
                                                                ><i className="fab fa-whatsapp"></i> Cargar QR
                                                                </Link>                                                                                    
                                                            </small>
                                                        </p>
                                                        <p className="text-muted mb-0">
                                                            <small className="text-muted">
                                                                <Link
                                                                type='button'
                                                                className='btn btn-danger btn-sm'
                                                                to={privateRoutes.EMISORES}
                                                            ><i className="fab fa-whatsapp"></i> Cargar QR
                                                            </Link>
                                                            </small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                            })
                        :
                        <div className="col-md-12">
                            <div className="card full-height">
                                <div className="card-body">
                                    <div key="nonamba" className="d-flex">
                                        <div className="avatar avatar-offline">
                                            <span className="avatar-title rounded-circle border border-white bg-danger"><i className="fab fa-whatsapp"> </i> </span>
                                        </div>
                                        <div className="flex-1 ml-3 pt-1">
                                            <h6 className="text-uppercase fw-bold mb-1">No hay Whatsapp registrados <span className="text-success pl-3"></span></h6>
                                            <span className="text-muted">Ir a Configuración -&gt; Whatsapp, debe hacerlo una vez al dia</span>
                                        </div>
                                        <div className="float-right pt-1">
                                            <small className="text-muted">
                                                <Link
                                                    type='button'
                                                    className='btn btn-danger btn-sm'
                                                    to={privateRoutes.EMISORES}
                                                ><i className="fab fa-whatsapp"></i> Cargar QR
                                                </Link>
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    }
                </div>
            </Fragment>
        );
   
};
