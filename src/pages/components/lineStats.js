/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent,TooltipComponent,TitleComponent,DatasetComponent,LegendComponent,AxisPointerComponent } from 'echarts/components';
import { CanvasRenderer} from 'echarts/renderers';

export const ChartLine = ({props}) => {
    echarts.use(
        [TitleComponent, TooltipComponent, GridComponent, LegendComponent, DatasetComponent, LineChart, CanvasRenderer, AxisPointerComponent]
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
        type: 'value'
    },
    xAxis: {
        type: 'category',
        data: props.categories
    },
    label: {
        show: true,
        position: 'inside'
    },
    series:[
        {
            data: props.series,
            type: 'line'
        }
    ]
};

return (
    <div key={props.id} className="card">
        <div className="card-body">
            <div className="card-title">{props.title||''}</div>
            <div className="card-category">{props.caption||''}</div>
            <div className="d-flex flex-wrap justify-content-around">
                <ReactEChartsCore
                    echarts={echarts}
                    option={option}
                    style={{ height: '300px', width: '100%',}}
                    notMerge={true}
                    lazyUpdate={true}
                    theme={"vintage"}
                />
            </div>
        </div>
        {
            (props.link)?
                <div className="text-right">
                    <Link className='btn btn-success'>Mas...</Link>
                </div>
            :
            ""
        }
    </div>
)

};