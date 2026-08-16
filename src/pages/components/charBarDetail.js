import { Fragment } from 'react';
/* eslint-disable react/prop-types */
import ReactECharts from 'echarts-for-react';
export const ChartBarDetail = (props) => {
    const xAxis = {
        type: 'value',
        boundaryGap: [0, 0.01]
    }

    const yAxis = {
        type: 'category',
        data: props.ops.categories,
        references: props.ops.references
    }

    const label = {
        normal: {
            show: true,
            position: 'top'
        }
    }

  const option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    legend:{},
    xAxis: props.ops.xAxis||xAxis,
    yAxis: props.ops.yAxis||yAxis,
    label: props.ops.label||label,
    series:props.ops.series
};

const onEvents = {
    'click': function (event) {
        if (event.data) {

            const elObjeto = {campana:props.ops.idcampana,mupio:event.name,punto:event.name,plan:props.ops.plan}
            if(typeof event.data.owner !== "undefined"){
                elObjeto.owner=event.data.owner
            }
            props.changeChosen(elObjeto)
        }
    }
};

return (
    <Fragment>
        <div className="row m5" style={{height:( ((props.ops.categories.length>3)? props.ops.categories.length*45 : 225  ))+'px',width: '100%'}}>
            <ReactECharts
                option={option}
                style={{ height: '100%', width: '100%',}}
                notMerge={true}
                lazyUpdate={true}
                theme={"vintage"}
                onEvents={onEvents}
            />
        </div>
    </Fragment>
)

};