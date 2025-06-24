import "./index.css";

import {AppProvider} from "@/AppContext";
import {DataPlate} from "@/module/DataPlate";
import {useEffect, useState} from "react";
import {ApiResponseInterface, getLatestRoomData, getTodaysAllRoomsData} from "@/module/api";
import Spinner from 'react-bootstrap/Spinner';

import './App.css'
import {CustomGraph} from "@/module/CustomGraph";
import {ControllPlate} from "@/module/ControllPlate";
import {Button} from "react-bootstrap";

const token = localStorage.getItem('BACKEND_TOKEN');

export function App() {
    const rooms = ["wohnzimmer", "schlafzimmer", "badezimmer"]
    const [data, setData] = useState<ApiResponseInterface[]>();
    const [todaysData, setTodaysData] = useState<ApiResponseInterface[]>();

    async function fetchData() {
        const promises = rooms.map(room => getLatestRoomData(room));
        const results = await Promise.all(promises);
        if (results.every(result => result !== undefined)) {
            setData(results)
        }
    }

    async function fetchTodaysData() {
        const todaysResults = await getTodaysAllRoomsData();
        if (todaysResults) {
            setTodaysData(todaysResults);
        }
    }

    useEffect(() => {
        fetchData();
        fetchTodaysData();
    }, [])

    if (!token) {
        return (
            <div>
                <h1>Add backend Token to use Webside</h1>
                <Button onClick={() => {
                    const value = prompt("add token");
                    if (value) {
                        localStorage.setItem("BACKEND_TOKEN", value)
                    }
                }}>Add token</Button>
            </div>
        );
    }

    return (
        <AppProvider>
            <div className="app">
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
                <div>
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
            </div>
        </AppProvider>
    );
}

export default App;
