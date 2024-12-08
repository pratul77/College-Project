// Fetch weather data and display it
const apiKey = 'fd1dbc6811dc445d72dfeee48b5a2ce7'; // Use a weather API key from OpenWeatherMap or any other source
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/';

// Function to fetch and display weather
function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    // Fetch current weather
    fetch(`${apiBaseUrl}weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cityName').textContent = data.name;
            document.getElementById('temperature').textContent = `${data.main.temp}°C`;
            document.getElementById('condition').textContent = data.weather[0].main;
            document.getElementById('description').textContent = data.weather[0].description;

            // Display alerts based on conditions (heavy rain, heat wave, etc.)
            displayAlerts(data);
        })
        .catch(error => console.error('Error:', error));

    // Fetch 20-day forecast (example, OpenWeatherMap only offers 7 or 16 days in free API)
    fetch(`${apiBaseUrl}forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.getElementById('forecastContainer');
            forecastContainer.innerHTML = ''; // Clear previous forecast
            data.list.forEach((forecast, index) => {
                if (index % 8 === 0) { // 3-hour interval, every 8th is a new day
                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('forecast-item');
                    forecastItem.innerHTML = `
                        <h4>${new Date(forecast.dt_txt).toLocaleDateString()}</h4>
                        <p>${forecast.main.temp}°C</p>
                        <p>${forecast.weather[0].main}</p>
                    `;
                    forecastContainer.appendChild(forecastItem);
                }
            });
        });
}

// Function to display alerts (e.g., heavy rain, heatwave)
function displayAlerts(weatherData) {
    const alertMessage = document.getElementById('alertMessage');
    const condition = weatherData.weather[0].main.toLowerCase();
    if (condition.includes('rain')) {
        alertMessage.textContent = 'Heavy Rain Alert! Stay indoors.';
        alertMessage.style.color = 'red';
    } else if (condition.includes('clear') && weatherData.main.temp > 35) {
        alertMessage.textContent = 'Heat Wave Alert! Stay hydrated.';
        alertMessage.style.color = 'orange';
    } else {
        alertMessage.textContent = 'No alerts at the moment.';
        alertMessage.style.color = 'green';
    }
}

// Map initialization (Example with Leaflet.js)
function initMap() {
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);
}

document.addEventListener('DOMContentLoaded', initMap);
