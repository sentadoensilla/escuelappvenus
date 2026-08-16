import { Fragment, useRef } from 'react';
/* eslint-disable react/prop-types */
import ReactECharts from 'echarts-for-react';
export const ChartBarEvent = ({ops}) => {
    const chart = useRef(null);
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
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ops.categories
    },
    series:ops.series
};

const callOtherChart = (parametros) =>{
    // eslint-disable-next-line
    console.log('Chart clicked', params);
}

const onEvents = {
    'click': function (event) {
      if (event.data) {
        callOtherChart(event)
      }
    }
};

return (
    <Fragment>
        <div className="row m5" style={{height:'400px',width: '100%'}}>
            <ReactECharts
                ref={chart}
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