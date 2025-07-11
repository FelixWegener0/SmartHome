import {MonthDataAverageInterface} from "@/module/api";
import {BarChart} from "@mui/x-charts";

import './MonthData.css'

export function MonthData({ monthAverageData, useHumidity }: { monthAverageData: MonthDataAverageInterface[], useHumidity: boolean }) {

    const chartData = transformToBarChartDataPerDay(monthAverageData, useHumidity);


    return (
        <div className="monthData-graph-container">
            <h2 className="titleText">{message(useHumidity)}</h2>
            <BarChart
                xAxis={chartData.xAxis}
                // @ts-ignore
                series={chartData.series}
                height={300}
            />
        </div>
    )
}

function message(useHumidity: boolean) {
    return useHumidity ? 'average Humidity for the last month' : 'average Temperature for the last month';
}

function transformToBarChartDataPerDay(
    data: MonthDataAverageInterface[],
    useHumidity: boolean = false
) {
    const dates = Array.from(new Set(data.map(d => d.date))).sort();
    const rooms = Array.from(new Set(data.map(d => d.room)));

    const series = rooms.map(room => {
        const valuesByDate = new Map(
            data
                .filter(d => d.room === room)
                .map(d => [d.date, useHumidity ? d.averageHumidity : d.averageTemperature])
        );

        const dataPoints = dates.map(date => valuesByDate.get(date) ?? 0);

        return {
            label: room,
            data: dataPoints,
            valueFormatter: (value: number) =>
                useHumidity ? `${value} %` : `${value} °C`
        };
    });

    return {
        xAxis: [{ data: dates }],
        series
    };
}