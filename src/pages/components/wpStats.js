import { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WidgetWP = ({props}) => {

    let enviosh = 0, enviosm = 0, enviost = 0
    // eslint-disable-next-line
    let [myStats, setMyStats] = useState(props.data||[])
    const [myChart, setMyChart] = useState("")

    const animateStats = () => {
        props.data.forEach((myItem,s) => {
        })       
    }    

    const showStats = () => {
        let preComponent = ""
        if(myStats.length > 0){
            preComponent = 
            <div key={props.id} className={(props.idestado===6)? "card card-primary bg-primary-gradient" : "card card-danger bg-danger-gradient"}>
                <div className="card-body">
                    <h4 className="mt-3 b-b1 pb-2 mb-4 fw-bold text-center">
                        {props.title} 
                        {'  '+props.estado+'  '}
                    </h4>
                    <h3 className="mb-4 fw-bold text-center"><i className="bi bi-whatsapp"></i> {'  '+props.emisor+'  '} </h3>

                    <div className="pb-3 mb-0 text-center">{props.caption}</div>
                    <div className="table-responsive table-hover">
					    <table className="table table-short text-white">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th className="text-end">HOY</th>
                                    <th className="text-end">MES</th>
                                    <th className="text-end">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                props.data.map(stats =>{
                                    enviosh = enviosh+parseInt(stats.enviadoshoy)
                                    enviosm = enviosm+parseInt(stats.enviadosmes)
                                    enviost = enviost+parseInt(stats.enviadostotal)

                                    return (
                                        <tr key={stats.tipo}>
                                            <td><i className="bi bi-whatsapp"></i> {stats.descripcion}</td>
                                            <td className="text-end">{stats.enviadoshoy}</td>
                                            <td className="text-end">{stats.enviadosmes}</td>
                                            <td className="text-end">{stats.enviadostotal}</td>
                                        </tr>
                                    )
                                })
                            }                              
                                <tr>
                                    <td><i className="bi bi-whatsapp"></i> TOTAL NOTIFICACIONES</td>
                                    <td className="text-end">{enviosh}</td>
                                    <td className="text-end">{enviosm}</td>
                                    <td className="text-end">{enviost}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>                    
                </div>
                {
                    (props.link)?
                        <Link className='btn btn-white' to={props.link}><i className="bi bi-gear"></i> Configuracion</Link>
                    :
                    ""
                } 
            </div>
        }

        setMyChart(myChart => preComponent)
        setTimeout(() => {
            animateStats()
        }, 1);
    }

    useEffect(() => {
        showStats()
    }, []);

    return ( 
        <Fragment>
        { 
            myChart
        }
        </Fragment>
    );
};

export default WidgetWP;
