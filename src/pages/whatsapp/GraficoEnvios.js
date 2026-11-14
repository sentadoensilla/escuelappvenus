import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * Gráfico de uso en el tiempo (ECharts) para la cola de WhatsApp.
 * datos: [{ dia: 'YYYY-MM-DD', enviados, fallidos }] — serie completa del historial.
 */
export default function GraficoEnvios({ datos = [], total = 0, delta = '0%' }) {
    const option = useMemo(() => {
        const fechas = datos.map((d) => d.dia);
        const enviados = datos.map((d) => parseInt(d.enviados) || 0);
        const fallidos = datos.map((d) => parseInt(d.fallidos) || 0);

        const etiqueta = (iso) => {
            if (!iso) return '';
            const [, mes, dia] = String(iso).split('-');
            return `${dia}/${mes}`;
        };

        return {
            color: ['#198754', '#dc3545'],
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(33,37,41,.92)',
                borderWidth: 0,
                textStyle: { color: '#fff' },
                valueFormatter: (v) => `${v} mensaje(s)`,
            },
            legend: {
                data: ['Enviados', 'Fallidos'],
                bottom: 0,
                icon: 'circle',
                textStyle: { color: '#6c757d' },
            },
            grid: { left: 46, right: 20, top: 20, bottom: 56 },
            xAxis: {
                type: 'category',
                data: fechas,
                boundaryGap: false,
                axisLabel: { color: '#6c757d', formatter: etiqueta },
                axisLine: { lineStyle: { color: '#dee2e6' } },
                axisTick: { show: false },
            },
            yAxis: {
                type: 'value',
                minInterval: 1,
                axisLabel: { color: '#6c757d' },
                splitLine: { lineStyle: { color: '#f1f3f5' } },
            },
            series: [
                {
                    name: 'Enviados',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    data: enviados,
                    lineStyle: { width: 3 },
                    areaStyle: { color: 'rgba(25,135,84,.15)' },
                    emphasis: { focus: 'series' },
                },
                {
                    name: 'Fallidos',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    data: fallidos,
                    lineStyle: { width: 2 },
                    areaStyle: { color: 'rgba(220,53,69,.10)' },
                    emphasis: { focus: 'series' },
                },
            ],
        };
    }, [datos]);

    const positivo = !String(delta).startsWith('-');

    return (
        <div className="card card-round">
            <div className="card-header">
                <div className="card-title">Uso en el tiempo</div>
                <div className="card-tools d-flex align-items-center gap-2">
                    <span className="text-muted small">Mensajes enviados</span>
                    <h3 className="mb-0">{total}</h3>
                    <span className={`badge ${positivo ? 'text-bg-success' : 'text-bg-danger'}`}>
                        {positivo ? '▲' : '▼'} {delta}
                    </span>
                </div>
            </div>
            <div className="card-body">
                {datos.length === 0 ? (
                    <div className="text-center text-muted py-5">Sin datos</div>
                ) : (
                    <ReactECharts option={option} style={{ height: 320 }} notMerge lazyUpdate />
                )}
            </div>
        </div>
    );
}
