import { Fragment, useState, useEffect, useContext } from 'react';

import { UserContext } from '../../services/context/UserContext';
import * as myConst from '../../main/constants';
import messenger from '../../services/messenger';
import tool from '../../services/tools';
import Waiting from '../parts/waiting';

export const WidgetMetaCampana = () => {
    // eslint-disable-next-line
	const { waiting, setWaiting, elUsuario } = useContext(UserContext);
    const miUsuario = tool.getUser()
    // eslint-disable-next-line
    let [myStats, setMyStats] = useState([])
    const [myChart, setMyChart] = useState("")
    // eslint-disable-next-line
	const [isFetching, setIsFetching] = useState(false);

    const showStats = () => {
        const otherStat = myStats.map((laStat,s) => {
            return (
                <div key={laStat.idcampana+s} className={(miUsuario.usuarioCampanaId.length>1)? "col-md-6" : "col-md-6"}>
                    <div className="card full-height">
                        <div className="card-body">
                            <div className="card-title text-center">Logro en {laStat.campana} ({laStat.partidopolitico})</div>
                            <div className="card-category  text-center">
                                {laStat.slogan}<br/>
                                {laStat.tipocamapana}                            
                            </div>
                            <div className="d-flex flex-wrap justify-content-around pb-2 pt-4">
                                <div className="px-4 pb-4 pb-md-0">
                                    <div>
                                        <h6 className="fw-bold text-uppercase text-success op-8">Votantes registrados</h6>
                                        <h3 className="fw-bold" id={"votos-"+laStat.idcampana}>{parseInt(laStat.reclutados||0)}</h3>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold text-uppercase text-danger op-8">Meta de votantes</h6>
                                        <h3 className="fw-bold" id={"meta-"+laStat.idcampana}>{parseInt(laStat.meta||1)}</h3>
                                    </div>
                                </div>
                                <div className="px-2 pb-2 pb-md-0 text-center">
                                    <div id={"logro-"+laStat.idcampana}></div>
                                    <h6 className="fw-bold mt-3 mb-0">Logro</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })        
        setMyChart(myChart => otherStat)
        setTimeout(() => {
            animateStats()
        }, 1);
    }

    const animateStats = () => {
        myStats.forEach((laStat,s) => {
            let performance = parseFloat(parseInt(laStat.reclutados)/(parseInt(laStat.meta)||1))
            const charColor = tool.statsColor('hex', performance)
            performance = (performance<1)? ((performance.toFixed(4))*100).toFixed(1) : ((performance.toFixed(4))*100).toFixed(0)

            window.Circles.create({
                id:'logro-'+laStat.idcampana,
                radius:65,
                value:performance,
                maxValue:100,
                width:13,
                text: performance+'%',
                colors:[charColor.text, charColor.background],
                duration:400,
                wrpClass:'circles-wrp',
                textClass:'circles-text',
                styleWrapper:true,
                styleText:true
            });
        })       
    }

    const getStats = async() =>{
        setWaiting(waiting => true)
        await messenger.poster({
            method: 'POST',
            value: {
                'campana': miUsuario.usuarioCampanaId,
                t: miUsuario.usuarioRollId,
                lider: miUsuario.usuarioId
            },
            url: myConst.roots.engine + myConst.roots.statsMetaCampana
        })
        .then((elMensaje) =>{
            setWaiting(waiting => false)
            if(elMensaje.message.length > 0){
                myStats =elMensaje.message;
                showStats()                
            }            
        })
        .catch(error =>{
            setWaiting(waiting => false)
            // eslint-disable-next-line
            console.log('catch: ', error.toString())
        });
        
    }
    
    useEffect(() => {
        getStats()
    }, [myStats]);

    if(isFetching){
        return <Waiting /> 
    }   
        
    return ( 
        <Fragment>
        { 
            myChart
        }
        </Fragment>
    );
};
