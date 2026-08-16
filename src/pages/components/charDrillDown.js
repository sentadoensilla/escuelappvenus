import { Fragment, useRef } from 'react';
/* eslint-disable react/prop-types */
import ReactECharts from 'echarts-for-react';

export const ChartDrillDown = ({ops}) => {
  const chart = useRef(null);
  const option = {
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]      
    },
    yAxis: {
      type: 'category',
      data: ops.data
    },
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
    dataGroupId: '',
    animationDurationUpdate: ops.animationDurationUpdate,
    series: {
      type: ops.series.type,
      id: ops.series.id,
      data: ops.series.data,
      universalTransition: {
        enabled: true,
        divideShape: 'clone'
      }
    }
  };
  const drilldownData = ops.series.drillDownData;


   const onEvents = {
    'click': function (event) {
      // eslint-disable-next-line
      console.log('El evento fue: ', chart)
      if (event.data) {
        const subData = drilldownData.find(function (data) {
          return data.dataGroupId === event.data.groupId;
        });
        if (!subData) {
          return;
        }
        chart.current.getEchartsInstance.setOption({
          xAxis: {
            data: subData.data.map(function (item) {
              return item[0];
            })
          },
          series: {
            type: ops.series.type,
            id: ops.series.id,
            dataGroupId: subData.dataGroupId,
            data: subData.data.map(function (item) {
              return item[1];
            }),
            universalTransition: {
              enabled: true,
              divideShape: 'clone'
            }
          },
          graphic: [
            {
              type: 'text',
              left: 50,
              top: 20,
              style: {
                text: 'Atras',
                fontSize: 18
              },
              onclick: function () {
                chart.current?.getEchartsInstance.setOption(option);
              }
            }
          ]
        });
      }
    },
  }

return (
    <Fragment>
        <div className="row m5" style={{height:'400px',width: '100%'}}>
            <ReactECharts
              ref={chart}
              option={option}
              style={{ height: '100%', width: '100%',}}
              notMerge={false}
              lazyUpdate={true}
              onEvents={onEvents}
            />
        </div>
    </Fragment>
)

};