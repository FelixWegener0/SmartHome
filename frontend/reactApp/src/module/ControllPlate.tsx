import {Card} from "react-bootstrap";
import {Button} from "react-bootstrap";

import './ControllPannel.css'
import {useEffect, useState} from "react";
import {getTotalAmountOfDbEntrys} from "@/module/api";
import {formatDate} from "@/module/utils";

export function ControllPlate({ reloadData }: { reloadData: () => void }) {

    const [dataBaseEntyrs, setDataBaseEntries] = useState<number | undefined>(undefined);
    const [lastDataReload, setLastDataReload] = useState<string | undefined>(undefined);

    async function fetchDataBaseEntries() {
        setDataBaseEntries(await getTotalAmountOfDbEntrys());
        setLastDataReload(formatDate(new Date()));
    }

    useEffect(() => {
        fetchDataBaseEntries();
    }, []);

    return (
        <Card className="data-plate">
            <Card.Body>
                <Card.Title>{`Controll Pannel`}</Card.Title>
                <Card.Text>{`DB entry's: ${dataBaseEntyrs}`}</Card.Text>
                <Card.Text>{`last data reload: ${lastDataReload}`}</Card.Text>
                <div className="button-row">
                    <Button className="button" variant="outline-light" onClick={() => {
                        reloadData();
                        fetchDataBaseEntries();
                    }}>Reload Data</Button>
                    <Button className="button" variant="outline-light" onClick={() => {
                        const value = prompt("BackendToken");
                        if (value) {
                            localStorage.setItem('BACKEND_TOKEN', value);
                        }
                    }}>Add Backend Token</Button>
                </div>
            </Card.Body>
        </Card>
    );
}
