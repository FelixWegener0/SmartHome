const token = localStorage.getItem('BACKEND_TOKEN') || '';

export interface ApiResponseInterface  {
    id: string;
    room: string;
    humidity: number;
    temperature: number;
    createdAt: string;
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

export async function getTodaysAllRoomsData() {
    try {
        const response = await fetch('https://felixwegener.dev/api/temp/today', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token,
            },
            method: 'GET',
        });
        return await response.json() as ApiResponseInterface[];
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
