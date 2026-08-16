import { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WidgetCirciular = ({props}) => {
    // eslint-disable-next-line
    let [myStats, setMyStats] = useState(props.data||[])
    const [myChart, setMyChart] = useState("")

    const animateStats = () => {
        props.data.forEach((myItem,s) => {
            window.Circles.create({
                id:props.id+'-'+s,
                radius:props.radius||47,
                value:myItem.value,
                maxValue:100,
                width:props.width||9,
                text: myItem.value+(myItem.aditional||''),
                colors:[myItem.colorText||'#222222', myItem.colorBackground||'#ea4d56'],
                duration:props.duration||400,
                wrpClass:'circles-wrp',
                textClass:'circles-text',
                styleWrapper:true,
                styleText:true
            });
        })       
    }    

    const showStats = () => {
        let preComponent = ""
        if(myStats.length > 0){
            preComponent = <div key={props.id} className="card">
                <div className="card-body">
                    <div className="card-title">{props.title||''}</div>
                    <div className="card-category">{props.caption||''}</div>
                    <div className="d-flex flex-wrap justify-content-around pb-2 pt-4">
                        { 
                            myStats.map((myItem,s) => {
                                return (
                                    <div key={'circulito'+s} className="px-2 pb-2 pb-md-0 text-center">
                                        <div id={props.id+'-'+s}></div>
                                        <h6 className="fw-bold mt-3 mb-0">{myItem.caption||''}</h6>
                                    </div>
                                )
                            })
                        }
                        
                    </div>
                    {
                        (props.link)?
                            <div className="text-right">
                                <Link className='btn btn-success' to={props.link}>Más...</Link>
                            </div>
                        :
                        ""
                    }
                </div>
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

export default WidgetCirciular;
