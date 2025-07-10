const token = localStorage.getItem('BACKEND_TOKEN') || '';

export interface ApiResponseInterface  {
    id: string;
    room: string;
    humidity: number;
    temperature: number;
    createdAt: string;
}

export interface MonthDataAverageInterface {
    room: string;
    date: string;
    averageTemperature: number;
    averageHumidity: number;
}

export async function getLatestRoomData(room: string) {
    try {
        const response = await fetch('https://felixwegener.dev/api/temp/findByRoomLatest', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token,
            },
            method: 'POST',
            body: JSON.stringify({ "room": room })
        });
        return await response.json() as ApiResponseInterface;
    } catch (e) {
        console.log('Error fetching data:', e);
    }
}

export async function getLast24HoureAllRoomsData() {
    try {
        const response = await fetch('https://felixwegener.dev/api/temp/last24Hour', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token,
            },
            method: 'GET',
        });
        return filterArray(await response.json() as ApiResponseInterface[]);
    } catch (e) {
        console.log('Error fetching data:', e);
    }
}

export async function getTotalAmountOfDbEntrys() {
    try {
        const response = await fetch('https://felixwegener.dev/api/temp/amount', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token,
            },
            method: 'GET',
        });
        return await response.json() as number;
    } catch (e) {
        console.log('Error fetching data:', e);
    }
}

export async function getLast30DaysAverage() {
    try {
        const response = await fetch('https://felixwegener.dev/api/temp/avgLastMonth', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token,
            }
        });
        return await response.json() as MonthDataAverageInterface[];
    } catch (e) {
        console.log('Error fetching data:', e);
    }
}

function filterArray(array: ApiResponseInterface[]): ApiResponseInterface[] {
    return array.filter((value) => value.humidity != 0 && value.temperature != 0);
}
