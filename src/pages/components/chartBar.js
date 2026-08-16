/* eslint-disable react/prop-types */
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent,TooltipComponent,TitleComponent,DatasetComponent,LegendComponent,AxisPointerComponent } from 'echarts/components';
import { CanvasRenderer} from 'echarts/renderers';

export const ChartBar = (props) => {
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
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
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
            echarts={echarts}
            option={option}
            style={{ height: '100%', width: '100%',}}
            notMerge={true}
            lazyUpdate={true}
            theme={"vintage"}
        />
    </div>
)

};