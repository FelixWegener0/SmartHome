import "./index.css";
import './App.css'

import {DataPlate} from "@/module/DataPlate/DataPlate";
import {useEffect, useState} from "react";
import {
    ApiResponseInterface,
    getLatestRoomData,
    getLast24HoureAllRoomsData,
    MonthDataAverageInterface,
    getLast30DaysAverage
} from "@/module/api";
import Spinner from 'react-bootstrap/Spinner';

import {CustomGraph} from "@/module/CustomGraph/CustomGraph";
import {ControllPlate} from "@/module/ControllPannel/ControllPlate";
import {Button} from "react-bootstrap";
import {MonthData} from "@/module/MonthData/MonthData";

const token = localStorage.getItem('BACKEND_TOKEN');

export function App() {
    const rooms = ["wohnzimmer", "schlafzimmer", "badezimmer"]
    const delayMinutes = 5;

    const [data, setData] = useState<ApiResponseInterface[]>();
    const [todaysData, setTodaysData] = useState<ApiResponseInterface[]>();
    const [monthAverageData, setMonthAverageData] = useState<MonthDataAverageInterface[] | undefined>(undefined);

    async function fetchData() {
        const promises = rooms.map(room => getLatestRoomData(room));
        const results = await Promise.all(promises);
        if (results.every(result => result !== undefined)) {
            setData(results)
        }
    }

    async function fetchMonthAverageData() {
        setMonthAverageData(await getLast30DaysAverage())
    }

    async function fetchTodaysData() {
        const todaysResults = await getLast24HoureAllRoomsData();
        if (todaysResults) {
            setTodaysData(todaysResults);
        }
    }

    useEffect(() => {
        fetchData();
        fetchTodaysData();
        fetchMonthAverageData();
    }, []);

    setTimeout(() => {
        fetchData();
        fetchTodaysData();
    }, delayMinutes * 60 * 1000);

    if (!token) {
        return (
            <div>
                <h1>Add backend Token to use Webside</h1>
                <Button onClick={() => {
                    const value = prompt("add token");
                    if (value) {
                        localStorage.setItem("BACKEND_TOKEN", value);
                    }
                }}>Add token</Button>
            </div>
        );
    }

    return (
        <div>
            <div className="room-list">
                {data && data.length > 0 ? (
                    data.map((data, index) => (
                        <div key={data.room + index} className="room">
                            <DataPlate
                                id={data.id}
                                room={data.room}
                                humidity={data.humidity}
                                temperature={data.temperature}
                                createdAt={data.createdAt}
                            />
                        </div>
                    ))
                ) : (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                )}
                <ControllPlate
                    reloadData={() => {
                        console.log('Reloading data');
                        fetchData();
                        fetchTodaysData();
                    }}
                />
            </div>
            <div className="container">
                <div className="box">
                    {todaysData ? (
                        rooms.map((room, index) => (
                            <CustomGraph
                                key={room + index }
                                data={todaysData.filter((value) => value.room === room)}
                            />
                        ))
                    ) : (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    )}
                </div>
                    {monthAverageData ? (
                        <div className="box">
                            <MonthData monthAverageData={monthAverageData} useHumidity={false} />
                            <MonthData monthAverageData={monthAverageData} useHumidity={true} />
                        </div>
                    ) : (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    )}
                </div>
            </div>

    );
}

export default App;
