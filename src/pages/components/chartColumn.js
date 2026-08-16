/* eslint-disable react/prop-types */
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent,TooltipComponent,TitleComponent,DatasetComponent,LegendComponent,AxisPointerComponent } from 'echarts/components';
import { CanvasRenderer} from 'echarts/renderers';


export const ChartColumn = (props) => {
    echarts.use(
        [TitleComponent, TooltipComponent, GridComponent, LegendComponent, DatasetComponent, BarChart, CanvasRenderer, AxisPointerComponent]
    );
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
    yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    xAxis: {
        type: 'category',
        data: props.ops.categories,
        references: props.ops.references
    },
    label: {
        show: true,
        position: 'inside'
    },
    series:props.ops.series
};

return (
    <div className="row m5" style={{height:'400px',width: '100%'}}>
        <ReactEChartsCore
            option={option}
            echarts={echarts}
            style={{ height: '100%', width: '100%',}}
            notMerge={true}
            lazyUpdate={true}
            theme={"vintage"}
        />
    </div>
)

};

/**
 * 
import { Fragment } from 'react';
import ReactECharts from 'echarts-for-react';
export const ChartColumn = (props) => {
    // eslint-disable-next-line
    // console.log('Las props: ', props)
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
    yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    xAxis: {
        type: 'category',
        data: props.ops.categories,
        references: props.ops.references
    },
    label: {
        show: true,
        position: 'inside'
    },
    series:props.ops.series
};

return (
    <Fragment>
        <div className="row m5" style={{height:'400px',width: '100%'}}>
            <ReactECharts
                option={option}
                style={{ height: '100%', width: '100%',}}
                notMerge={true}
                lazyUpdate={true}
                theme={"vintage"}
            />
        </div>
    </Fragment>
)

};
 */