const temperatureBathroom = document.getElementById('TemperatureBadezimmer');
const humidityBathroom = document.getElementById('HumidityBadezimmer');
const themperatureSchlafzimmer = document.getElementById('TemperatureSchlafzimmer');
const humiditySchlafzimmer = document.getElementById('HumiditySchlafzimmer');
const temperatureWohnzimmer = document.getElementById('TemperatureWohnzimmer');
const humidityWohnzimmer = document.getElementById('HumidityWohnzimmer');
const timeBadezimmer = document.getElementById('timeBadezimmer');
const timeSchlafzimmer = document.getElementById('timeSchlafzimmer');
const timeWohnzimmer = document.getElementById('timeWohnzimmer');
const totalServerEntrys = document.getElementById('totalServerEntrys');
const lastDataPull = document.getElementById('lastDataPull');

const addBackendToken = document.getElementById('addBackendToken');
const getDataButton = document.getElementById('getDataButton');

const minuteTimer = 1;
let count = 0;
let token = localStorage.getItem('token') || '';

async function getAllRoomsData() {
    const response = await fetch('https://felixwegener.dev/api/temp/today', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': token,
        },
        method: 'GET',
    });
    return await response.json();
}

async function getLatestRoomData(room) {
    const response = await fetch('https://felixwegener.dev/api/temp/findByRoomLatest', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': token,
        },
        method: 'POST',
        body: JSON.stringify({ "room": room })
    });
    return await response.json();
}

async function getTotalAmountOfDbEntrys() {
    const response = await fetch('https://felixwegener.dev/api/temp/amount', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': token,
        },
        method: 'GET',
    });
    return await response.json();
}

async function updateCharts() {
    const rooms = ["wohnzimmer", "schlafzimmer", "badezimmer"];

    try {
        const data = await getAllRoomsData();

        rooms.forEach(room => {
            const roomData = data
                .filter(d => d.room === room)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            if (roomData.length === 0) return;

            const sampled = roomData.filter((_, index) => index % 10 === 0);

            const temps = sampled.map(d => d.temperature);
            const hums = sampled.map(d => d.humidity);
            const labels = sampled.map(d => new Date(d.createdAt).toLocaleTimeString());

            drawChart(`chart-${room}`, labels, temps, hums);
        });
    } catch (err) {
        console.error("Fehler beim Abrufen der Raumdaten:", err);
    }
}

function setInnerHtml(tempElement, humidelement, timeElement, data) {
    tempElement.innerHTML = `Temperature: ${data.temperature}°C`;
    humidelement.innerHTML = `Humidity: ${data.humidity}%`;
    timeElement.innerHTML = `created: ${formatDate(data.createdAt)}`;
}

async function setData() {
    setInnerHtml(temperatureBathroom, humidityBathroom, timeBadezimmer, await getLatestRoomData("badezimmer"));
    setInnerHtml(themperatureSchlafzimmer, humiditySchlafzimmer, timeSchlafzimmer, await getLatestRoomData("schlafzimmer"));
    setInnerHtml(temperatureWohnzimmer, humidityWohnzimmer, timeWohnzimmer, await getLatestRoomData("wohnzimmer"));

    totalServerEntrys.innerHTML = `BD entry's: ${await getTotalAmountOfDbEntrys()}`;
    lastDataPull.innerHTML = `last data pull: ${formatDate(new Date())}`
}

function addNewBackendToken() {
    const value = prompt("token");

    token = value;
    setData();
    localStorage.setItem('token', value);
}

function format(value) {
    if (value < 10) {
        return `0${value}`;
    } else {
        return value;
    }
}

function formatDate(valueString) {
    let date = new Date(valueString);

    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return `${format(hour)}:${format(minutes)}:${format(seconds)}`;
}

function drawChart(canvasId, labels, temps, hums) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    const padding = 50;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxVal = Math.max(...temps, ...hums);
    const minVal = Math.min(...temps, ...hums);

    const stepCount = 5; // Anzahl Y-Achsen-Schritte
    const stepSize = (maxVal - minVal) / stepCount;

    function getY(value) {
        return canvas.height - padding - ((value - minVal) / (maxVal - minVal)) * chartHeight;
    }

    function getX(index) {
        return padding + (index / (labels.length - 1)) * chartWidth;
    }

    // Achsen zeichnen
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Y-Achse Beschriftung
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= stepCount; i++) {
        const val = minVal + i * stepSize;
        const y = getY(val);
        ctx.fillText(val.toFixed(1), padding - 10, y);
        
        // Optionale Hilfslinie
        ctx.strokeStyle = "#ddd";
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    // Temperatur zeichnen
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(getX(0), getY(temps[0]));
    for (let i = 1; i < temps.length; i++) {
        ctx.lineTo(getX(i), getY(temps[i]));
    }
    ctx.stroke();

    // Luftfeuchtigkeit zeichnen
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(getX(0), getY(hums[0]));
    for (let i = 1; i < hums.length; i++) {
        ctx.lineTo(getX(i), getY(hums[i]));
    }
    ctx.stroke();

    // Legende
    ctx.fillStyle = "red";
    ctx.fillRect(padding, padding - 30, 10, 10);
    ctx.fillStyle = "black";
    ctx.fillText("Temperatur (°C)", padding + 15, padding - 20);

    ctx.fillStyle = "blue";
    ctx.fillRect(padding + 150, padding - 30, 10, 10);
    ctx.fillStyle = "black";
    ctx.fillText("Luftfeuchtigkeit (%)", padding + 165, padding - 20);

    // X-Achse Beschriftung (jeden 5. Punkt oder letzten)
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    labels.forEach((label, i) => {
        if (i % 5 === 0 || i === labels.length - 1) {
            const x = getX(i);
            ctx.fillText(label, x, canvas.height - padding + 10);
        }
    });
}

setData();
updateCharts();

setInterval(updateCharts, 300000);
setInterval(() => {
    setData();
}, minuteTimer * 60 * 1000)

getDataButton.addEventListener('click', () => setData());
addBackendToken.addEventListener('click', () => addNewBackendToken());
