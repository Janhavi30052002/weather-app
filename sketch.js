// sketch.js
const API_KEY = '3a7433e0df7ea5fed9b06e2fdbeaa241';

function setup() {
    noCanvas();
    initializeApp();
}

function initializeApp() {
    const searchInput = document.getElementById('citySearch');
    const addButton = document.querySelector('.add-button');

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeatherData(this.value);
        }
    });

    addButton.addEventListener('click', function() {
        const city = searchInput.value;
        if (city) {
            getWeatherData(city);
        }
    });

    // Initial weather data
    getWeatherData('Madrid');
    createHourlyForecast();
}

async function getWeatherData(city) {
    try {
        // Get coordinates
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            alert('City not found');
            return;
        }

        const { lat, lon } = geoData[0];

        // Get current weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Get hourly forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        updateWeatherDisplay(weatherData, forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data');
    }
}

function updateWeatherDisplay(current, forecast) {
    // Update current weather
    document.querySelector('.city-name').textContent = current.name;
    document.querySelector('.current-temp').textContent = `${Math.round(current.main.temp)}°`;
    document.querySelector('.min-temp').textContent = `${Math.round(current.main.temp_min)}°`;

    // Update weather details
    document.getElementById('wind').textContent = `${Math.round(current.wind.speed)} km/h`;
    document.getElementById('pressure').textContent = `${current.main.pressure} mb`;
    document.getElementById('feelsLike').textContent = `${Math.round(current.main.feels_like)}°`;
    document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;

    // Update hourly forecast
    updateHourlyForecast(forecast);
}

function createHourlyForecast() {
    const container = document.getElementById('hourlyForecast');
    const hours = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    const temps = [10, 11, 12, 12, 13, 14, 15, 16, 16, 16];

    hours.forEach((hour, index) => {
        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <div class="forecast-time">${hour}</div>
            <div class="forecast-temp">${temps[index]}°</div>
        `;
        container.appendChild(item);
    });
}

function updateHourlyForecast(forecast) {
    const container = document.getElementById('hourlyForecast');
    container.innerHTML = '';

    forecast.list.slice(0, 10).forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-time">${time}</div>
            <div class="forecast-temp">${Math.round(item.main.temp)}°</div>
        `;
        container.appendChild(forecastItem);
    });
}