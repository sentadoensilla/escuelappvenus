/* eslint-disable react/prop-types */
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

/**
 * SparklineCard — widget compacto estilo Atlantis (demo1/widgets.html):
 * número grande + delta + etiqueta + mini-gráfico (70px, sin ejes).
 * Altura acotada (no crece como los charts de 200/300px).
 */
export const SparklineCard = ({ value, label, delta, series = [], color = '#1572e8' }) => {
    echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

    const option = {
        grid: { left: 0, right: 0, top: 2, bottom: 0, containLabel: false },
        xAxis: { type: 'category', show: false, boundaryGap: false, data: series.map((_, i) => i) },
        yAxis: { type: 'value', show: false },
        tooltip: { show: false },
        series: [{
            type: 'line',
            data: series,
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2, color },
            areaStyle: { opacity: 0.12, color },
        }],
    };

    return (
        <div className="card">
            <div className="card-body pb-0">
                <div className="h1 fw-bold float-right text-primary">{delta}</div>
                <h2 className="mb-2">{value}</h2>
                <p className="text-muted">{label}</p>
                <div className="pull-in sparkline-fix">
                    <ReactEChartsCore
                        echarts={echarts}
                        option={option}
                        style={{ height: '70px', width: '100%' }}
                        notMerge={true}
                        lazyUpdate={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default SparklineCard;
