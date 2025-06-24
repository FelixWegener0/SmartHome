import {ApiResponseInterface} from "@/module/api";
import {Card} from "react-bootstrap";

import './DataPlate.css';
import {formatDate} from "@/module/utils";

export function DataPlate(data: ApiResponseInterface) {

    return (
        <Card className="data-plate">
            <Card.Body>
                <Card.Title>{`Room: ${data?.room}`}</Card.Title>
                <Card.Text>{`temperature: ${data?.temperature}°C`}</Card.Text>
                <Card.Text>{`humidity: ${data?.humidity}%`}</Card.Text>
                <Card.Text>{`created at: ${formatDate(data?.createdAt)}`}</Card.Text>
            </Card.Body>
        </Card>
    )
}

