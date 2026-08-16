import { Link } from "react-router-dom";
import { publicRoutes } from '../services/routes';
import * as myConst from '../main/constants';

export default function Desc(props) {
	let tamDesc = "col-sm-12 col-md-12"
	let tamButtons = ""
	if(typeof props.showButtons === "undefined" || !props?.showButtons){
		tamDesc = "col-sm-9 col-md-9"
		tamButtons = "col-sm-3 col-md-3"		
	}
	return (
		<div className="row">
			<div className={tamDesc}>
				<div className="row align-items-center my-5">
					<div className="col text-right">
						<img src={myConst.essentials.logogrande} width={250} height={250} alt="escuelapp" />
					</div>
					<div className="col text-left">
						<h2 className="text-left">Escuelapp es la agenda escolar digital para las institiciones educativas y sus acudientes</h2>
					</div>
				</div>
				<div className='separator-dashed'></div>			
			</div>

			{
				(typeof props.showButtons === "undefined" || !props?.showButtons)? 
					<div className="row">
						<div class="col-md-3">
							<div class="card card-primary card-annoucement card-round card-stats">
								<div class="card-body text-center">
									<div className="icon-big text-center">
										<i className="flaticon-whatsapp"></i>
									</div>
									<div class="card-opening">Comunicados</div>
									<div class="card-desc">
										Comunicación instantánea con los acudientes del colegio, a un solo clic de distancia.
									</div>
									<div class="card-detail">
										<div class="btn btn-light btn-rounded">Ver más detalles</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-3">
							<div class="card card-danger card-annoucement card-round card-stats">
								<div class="card-body text-center">
									<div className="icon-big text-center">
										<i className="flaticon-envelope"></i>
									</div>
									<div class="card-opening">Consulta a docentes</div>
									<div class="card-desc">
										Centralice la atención al cliente en su colegio, todos los maestros en un solo sitio.
									</div>
									<div class="card-detail">
										<div class="btn btn-light btn-rounded">Ver más detalles</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-3">
							<div class="card card-info card-annoucement card-round card-stats">
								<div class="card-body text-center">
									<div className="icon-big text-center">
										<i className="flaticon-envelope-2"></i>
									</div>
									<div class="card-opening">Excusas</div>
									<div class="card-desc">
										El acudiente envia excusas al colegio desde su smartphone, cómodamente y al instante.
									</div>
									<div class="card-detail">
										<div class="btn btn-light btn-rounded">Ver más detalles</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-3">
							<div class="card card-warning card-annoucement card-round card-stats">
								<div class="card-body text-center">
									<div className="icon-big text-center">
										<i className="flaticon-envelope-2"></i>
									</div>
									<div class="card-opening">Observaciones</div>
									<div class="card-desc">
										El acudiente recibe notificación automática cuando ocurren situaciones que ameritan su atención.
									</div>
									<div class="card-detail">
										<div class="btn btn-light btn-rounded">Ver más detalles</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				:
					""
			}

		</div>
	);
}
