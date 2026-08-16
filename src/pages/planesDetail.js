import { useEffect, useState } from 'react';
import * as myConst from '../main/constants';
import messenger from "../services/messenger";
// import tool from '../services/tools';

export default function MiPlan(props) {
    // eslint-disable-next-line
	const [waiting, setWaiting] = useState(false);
    // eslint-disable-next-line
	const [tipoCampana, setTipoCampana] = useState("");
	const [tipoCampanaCandidato, setTipoCampanaCandidato] = useState("");
	const [tipoCampanaGanador, setTipoCampanaGanador] = useState("");

	// const navegar = useNavigate();

	const MisPlanes = async() => {
        await messenger.poster({
            method: 'POST',
            value: null,
            url: myConst.roots.engine + myConst.roots.clientPlanes
        }).then((elMensaje) =>{

            if(elMensaje.message.rows.length > 0){
                const pretipoCampana = []
                const pretipoCampanaCandidato = []
                const pretipoCampanaGanador = []

                elMensaje.message.rows.forEach((element,i) => {
                    pretipoCampana.push(element.tipocampana)
                    pretipoCampanaCandidato.push(element.candidato)
                    pretipoCampanaGanador.push(element.ganador)
                });
                
                const pretipo = pretipoCampana.map((item,i) => {
                   return (<li key={'tipo'+i}><span className='name-specification growup'>{item}</span></li>)
                })
                setTipoCampana(pretipo)

                const precandidato = pretipoCampanaCandidato.map((item,i) => {
                    return (<li key={'candidato'+i} ><span className='name-specification growup'>{pretipoCampana[i]}</span><span className='status-specification growup'>$ {new Intl.NumberFormat().format(item)}</span></li>)
                })
                setTipoCampanaCandidato(precandidato)

                const preganador = pretipoCampanaGanador.map((item,i) => {
                    return (<li key={'ganador'+i} ><span className='name-specification growup'>{pretipoCampana[i]}</span><span className='status-specification growup'>$ {new Intl.NumberFormat().format(item)}</span></li>)
                })
                setTipoCampanaGanador(preganador)
            }
        })
	};

    useEffect(() => {
        setWaiting(waiting => true)
		MisPlanes()
        setWaiting(waiting => false)
    }, []);

    if(parseInt(props.miplan) === 0){
        return (
            <div className="col-md-12 pl-md-0">
                <div className="card-pricing2 card-primary">
                    <div className="pricing-header">
                        <h3 className="fw-bold">Plan Candidato</h3>
                        <span className="sub-title">Plan básico para campañas, con estadisticas</span>
                    </div>
                    <div className="price-value">
                        <div className="value">
                            <span className="currency"></span>
                            <span className="amount">Unico<span></span></span>
                            <span className="month">pago</span>
                        </div>
                    </div>
                    <ul className="pricing-content">
                        <li>Registro de votantes potenciales</li>
                        <li>Seguimiento de metas</li>
                        <li>Estadísticas por territorio</li>
                        <li className="disable">Estadísticas por género</li>
                        <li className="disable">Estadísticas por edad</li>
                        <li>Reportes en excel</li>
                        <li className="disable">Volantes por whatsapp</li>
                    </ul>
                    <div className="card-pricing card-light">
                        <div className="card-body">
                            <ul className="specification-list">{ tipoCampanaCandidato }</ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }else{
        return (
            <div className="col-md-12 pl-md-0 pr-md-0">
                <div className="card-pricing2 card-danger">
                    <div className="pricing-header">
                        <h3 className="fw-bold">Plan Ganador</h3>
                        <span className="sub-title">Plan con estadísticas y volanteo por whatsapp</span>
                    </div>
                    <div className="price-value">
                        <div className="value">
                            <span className="currency"></span>
                            <span className="amount">Unico<span></span></span>
                            <span className="month">pago</span>
                        </div>
                    </div>
                    <ul className="pricing-content">
                    <li>Registro de votantes potenciales</li>
                        <li>Seguimiento de metas</li>
                        <li>Estadísticas por territorio</li>
                        <li>Estadísticas por género</li>
                        <li>Estadísticas por edad</li>
                        <li>Reportes en excel</li>
                        <li>Volantes por whatsapp</li>
                    </ul>
                    <div className="card-pricing card-light">
                        <div className="card-body">
                            <ul className="specification-list">{ tipoCampanaGanador }</ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
