/* eslint-disable react/prop-types */
import ReactEChartsCore from 'echarts-for-react/lib/core';
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent,GridComponent,ToolboxComponent,TooltipComponent,DatasetComponent,LegendComponent,AxisPointerComponent } from 'echarts/components';
import { CanvasRenderer} from 'echarts/renderers';

export const ChartLine = (props) => {
  echarts.use(
      [TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, DatasetComponent, LineChart, CanvasRenderer, AxisPointerComponent]
  );

  // eslint-disable-next-line
    const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: props.ops.categories
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: props.ops.data
        },
        yAxis: {
          type: 'value'
        },
        color: props.ops.color,
        series: props.ops.series
      };

    return (
      <div className="row m5" style={{height:'500px',width: '100%'}}>
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