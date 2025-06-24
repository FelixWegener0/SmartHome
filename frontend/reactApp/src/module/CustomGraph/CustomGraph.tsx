import {ApiResponseInterface} from "@/module/api";
import {LineChart} from "@mui/x-charts";

import './CustomGraph.css';

function reduceData<T>(data: T[], maxPoints: number): T[] {
    if (data.length <= maxPoints) return data;
    const step = Math.floor(data.length / maxPoints);
    return data.filter((_, idx) => idx % step === 0).slice(0, maxPoints);
}

export function CustomGraph({ data }: { data: ApiResponseInterface[]}) {
    const maxPoints = 25;
    const reducedData = reduceData(data, maxPoints);

    const temperatureData = reducedData.map(item => item.temperature);
    const humidityData = reducedData.map(item => item.humidity);
    const xAxisLabels = reducedData.map(item =>
        new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

    return (
        <div className="custom-graph-container">
            <h2 className="titleText">{`${data[0]?.room ?? ""}`}</h2>
            <LineChart
                xAxis={[{ data: xAxisLabels.reverse(), scaleType: "point", label: "Zeit" }]}
                series={[
                    {
                        data: temperatureData.reverse(),
                        label: "Temperatur",
                    },
                    {
                        data: humidityData.reverse(),
                        label: "Luftfeuchtigkeit",
                        color: "red",
                    },
                ]}
                height={300}
            />
        </div>
    );
}