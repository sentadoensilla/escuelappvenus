import { Fragment, useContext  } from 'react';
import { Link } from "react-router-dom";
import { publicRoutes } from '../../services/routes';
import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';


export default function HeadRibbon() {
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
    return (
        <Fragment>
            <div className='panel-header bg-primary-gradient'>
                <div className='page-inner py-5'>
                    <div className='d-flex align-items-left align-items-md-center flex-column flex-md-row'>
                        <div>
                            <h2 className='text-white pb-2 fw-bold'>{myConst.essentials.name}</h2>
                            <h5 className='text-white op-7 mb-2'>
                                { myConst.essentials.slogan }
                            </h5>
                        </div>
                        <div className='ml-md-auto py-2 py-md-0'>
                            <Link to={publicRoutes.REGISTER} className='btn btn-primary btn-round mr-2'>
                                <span className="btn-label">
									<i className="fas fa-user-plus"></i>
								</span>
                                 Crear cuenta
                            </Link>
                            <Link to={publicRoutes.LOGIN} className='btn btn-success btn-round mr-2'>
                                <span className="btn-label">
									<i className="fas fa-door-open"></i>
								</span>
                                 Ingresar
                            </Link>
                            <Link
                                to={publicRoutes.RESET_PASSWORD}
                                className='btn btn-white btn-border btn-round mr-2'
                            >
                                <span className="btn-label">
									<i className="fas fa-grin-beam-sweat"></i>
								</span>
                                 Olvidé mi clave
                            </Link>                            
                        </div>
                    </div>
                </div>
            </div>
            <div className='page-inner mt--5'>
                <div className='row row-card-no-pd mt--2'>
                    <div className='col-sm-4 col-md-3'>
                        <div className='card card-stats card-round'>
                            <div className='card-body '>
                                <div className='row'>
                                    <div className='col-5'>
                                        <div className='icon-big text-center'>
                                            <i className='flaticon-list text-danger'></i>
                                        </div>
                                    </div>
                                    <div className='col-7 col-stats'>
                                        <div className='numbers'>
                                            <p className='card-category'>Asistencias</p>
                                            <h4 className='card-title'>45</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4 col-md-3'>
                        <div className='card card-stats card-round'>
                            <div className='card-body'>
                                <div className='row'>
                                    <div className='col-5'>
                                        <div className='icon-big text-center'>
                                            <i className='flaticon-envelope text-primary'></i>
                                        </div>
                                    </div>
                                    <div className='col-7 col-stats'>
                                        <div className='numbers'>
                                            <p className='card-category'>Excusas</p>
                                            <h4 className='card-title'>23</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4 col-md-3'>
                        <div className='card card-stats card-round'>
                            <div className='card-body'>
                                <div className='row'>
                                    <div className='col-5'>
                                        <div className='icon-big text-center'>
                                            <i className='flaticon-envelope-1 text-warning'></i>
                                        </div>
                                    </div>
                                    <div className='col-7 col-stats'>
                                        <div className='numbers'>
                                            <p className='card-category'>Correos</p>
                                            <h4 className='card-title'>+2.3K</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4 col-md-3'>
                        <div className='card card-stats card-round'>
                            <div className='card-body '>
                                <div className='row'>
                                    <div className='col-5'>
                                        <div className='icon-big text-center'>
                                            <i className='flaticon-whatsapp text-success'></i>
                                        </div>
                                    </div>
                                    <div className='col-7 col-stats'>
                                        <div className='numbers'>
                                            <p className='card-category'>Whatsapp</p>
                                            <h4 className='card-title'>+26K</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        </Fragment>
    );
};
