/* eslint-disable react/prop-types */
import ReactEChartsCore from 'echarts-for-react/lib/core';
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TitleComponent,GridComponent,TooltipComponent,DatasetComponent,LegendComponent,AxisPointerComponent } from 'echarts/components';
import { CanvasRenderer} from 'echarts/renderers';

export const ChartPie = ({ops}) => {
    echarts.use(
        [TitleComponent, TooltipComponent, GridComponent, LegendComponent, DatasetComponent, PieChart, CanvasRenderer, AxisPointerComponent]
    );

    const option = {
    trigger:{
        trigger: 'item'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
    legend:{
        orient: 'vertical',
        left: 'left'
    },
    series:[
        {
            name: ops.name,
            type: 'pie',
            radius: ['35%', '65%'],
            center: ['60%', '50%'],
            data: ops.data,
            label: {
                show: true,
                position: 'inside',
                formatter: "{c}"
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }			
    ]
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