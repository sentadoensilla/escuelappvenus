import { Fragment } from 'react';

function NoEncontrado() {
	return (
        <Fragment>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Elemento no encontrado...</h4>
                    </div>
                    <div className="card-body">
                        <ul className="nav nav-pills nav-secondary  nav-pills-no-bd nav-pills-icons justify-content-center" id="pills-tab-with-icon" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="pills-home-tab-icon" data-toggle="pill" href="#pills-home-icon" role="tab" aria-controls="pills-home-icon" aria-selected="true">
                                    <i className="la flaticon-chart-pie"></i>
                                    404
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content mt-2 mb-3" id="pills-with-icon-tabContent">
                            <div className="tab-pane fade show active" id="pills-home-icon" role="tabpanel" aria-labelledby="pills-home-tab-icon">
                                <p>El elemento que tratas de ver no está disponible en el momento.</p>
                                <p>Este incidente ha sido reportado!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export default NoEncontrado;
