import { Fragment } from 'react';

import UserHeadOff from './components/headOff';
import { Foot } from './components/foot'


export const Forbidden = () => {
	return (
		<Fragment>
			<div id='elgrapper' className="wrapper">
				<UserHeadOff />

				<div className="main-panel">
					<div className="content">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title text-danger">No tienes permiso para ver eso...</h2>
                                </div>
                                <div className="card-body">
                                    <ul className="nav nav-pills nav-danger  nav-pills-no-bd nav-pills-icons justify-content-center" id="pills-tab-with-icon" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" id="pills-home-tab-icon" 
                                            data-toggle="pill" href="#pills-home-icon" 
                                            role="tab" aria-controls="pills-home-icon" 
                                            aria-selected="true"
                                            style={{fontSize:'48pt'}}>
                                                <i className="la flaticon-chart-pie"></i>
                                                505
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content mt-2 mb-3" id="pills-with-icon-tabContent">
                                        <div className="tab-pane fade show active" id="pills-home-icon" role="tabpanel" aria-labelledby="pills-home-tab-icon">
                                            <p>El elemento que tratas de ver no está disponible con tus credenciales.</p>
                                            <p>Este incidente ha sido reportado!</p>
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
