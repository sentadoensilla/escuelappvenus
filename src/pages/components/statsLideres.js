import { Fragment, useState, useEffect } from 'react';

import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';
import Waiting from '../parts/waiting';

export const CircularStats = () => {
    const miUsuario = tool.getUser()

    let [myStats, setMyStats] = useState([])
    const [myChart, setMyChart] = useState("")

    // eslint-disable-next-line
	const [waiting, setWaiting] = useState(false);
	const [isFetching, setIsFetching] = useState(false);

    const showStats = () => {
        const otherStat = myStats.map((laStat,s) => {
            let performance = parseFloat(parseInt(laStat.reclutados)/(parseInt(laStat.meta)||1))
            const pendientes = parseInt(laStat.reclutados)-(parseInt(laStat.meta)||0)
            
            let pendientesText = ' No tiene meta '
            if(parseInt(laStat.meta) > 0){
                pendientesText = (pendientes>=0)? 'Votos adicionales: ' : 'Le faltan: ' ;
            }
            
            performance = ((performance.toFixed(4))*100).toFixed(1)

            const charColor = tool.statsColor('boots',(parseInt(laStat.reclutados)/parseInt(laStat.meta||1)))

            return (
                <div key={"lider-"+laStat.idreferencia+s}>
                    <div className="d-flex">
                        <div className="avatar avatar-online">
                            <span className={'avatar-title rounded-circle border border-'+charColor.text+' bg-'+charColor.background}>
                                {laStat.nombres.substring(0,1)}
                            </span>
                        </div>
                        <div className="flex-1 ml-3 pt-1">
                            <h6 className="text-uppercase fw-bold mb-1">
                                {laStat.nombres}
                            </h6>
                            <span className="text-muted">{'Meta: '+(laStat.meta||'No tiene')+', Registrados: '+laStat.reclutados}</span><br/>
                            <span className={'text-'+charColor.background+' pl-1'}>{pendientesText+''+Math.abs(pendientes)}</span>
                        </div>
                        <div className="float-right pt-3 text-right">
                            <small className={'text-'+charColor.background}>Logro</small><br/>
                            <small className={'text-'+charColor.background}>{performance}%</small><br/>
                            <small className="text-muted">{laStat.campana}</small>
                        </div>
                    </div>
                    <div className="separator-dashed"></div>
                </div>
            )
        })        
        setMyChart(myChart => otherStat)
    }
    
    const getStats = async() =>{
        setWaiting(waiting => !waiting)
        await messenger.poster({
            method: 'POST',
            value: {'campana': miUsuario.usuarioCampanaId},
            url: myConst.roots.engine + myConst.roots.statsMetaLideres
        })
        .then((elMensaje) =>{
            setMyStats(elMensaje => [])
            setWaiting(waiting => !waiting)
            // eslint-disable-next-line
            console.log('then elMensaje: ', elMensaje)
            myStats = (elMensaje.message.length > 0)? elMensaje.message : [] ;
            showStats()
            // eslint-disable-next-line
            console.log('then myStats: ', myStats)
        })
        .catch(error =>{
            setWaiting(waiting => !waiting)
            // eslint-disable-next-line
            console.log('catch: ', error)
        });       
    }

    
    useEffect(() => {
        setIsFetching(waiting => !waiting)
        getStats()
        setIsFetching(waiting => !waiting)
    }, []);

    if(isFetching){
        return <Waiting /> 
    }   
        
    return ( 
        <Fragment>
            <div className="col-md-6">
                <div className="card full-height">
                    <div className="card-header">
                        <div className="card-head-row">
                            <div className="card-title">Estadísdicas por líderes</div>
                        </div>
                        <div className="card-body">
                            { myChart }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
