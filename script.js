// OpenWeatherMap API
const apiKey = "be9d44225d06a40d2e0d8ace85305e91"; // Replace with your API key
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

// DOM Elements
const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const alertMessage = document.getElementById("alertMessage");
const forecastContainer = document.getElementById("forecastContainer");

// Fetch Current Weather
function fetchCurrentWeather(city) {
    fetch(`${currentWeatherUrl}?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            cityName.textContent = `City: ${data.name}`;
            temperature.textContent = `Temperature: ${data.main.temp}°C`;
            condition.textContent = `Condition: ${data.weather[0].main}`;
            displayAlerts(data);
        })
        .catch(error => console.error("Error fetching current weather:", error));
}

// Fetch 20-Day Forecast
function fetchForecast(city) {
    forecastContainer.innerHTML = "";
    fetch(`${forecastUrl}?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            data.list.forEach((item, index) => {
                if (index % 8 === 0) { // Show one forecast per day
                    const forecastItem = document.createElement("div");
                    forecastItem.classList.add("forecast-item");
                    forecastItem.innerHTML = `
                        <h4>${new Date(item.dt_txt).toLocaleDateString()}</h4>
                        <p>Temp: ${item.main.temp}°C</p>
                        <p>${item.weather[0].main}</p>
                    `;
                    forecastContainer.appendChild(forecastItem);
                }
            });
        })
        .catch(error => console.error("Error fetching forecast:", error));
}

// Display Alerts
function displayAlerts(weatherData) {
    const condition = weatherData.weather[0].main.toLowerCase();
    if (condition.includes("rain")) {
        alertMessage.textContent = "⚠️ Heavy Rain Alert! Stay indoors.";
        alertMessage.style.color = "red";
    } else if (weatherData.main.temp > 35) {
        alertMessage.textContent = "⚠️ Heat Wave Alert! Stay hydrated.";
        alertMessage.style.color = "orange";
    } else {
        alertMessage.textContent = "No alerts. Weather is clear.";
        alertMessage.style.color = "green";
    }
}

// Initialize Weather Map
const map = L.map("mapContainer").setView([20, 78], 4); // Default location: India
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

function changeLayer(layerType) {
    map.eachLayer((layer) => {
        if (layer.options && layer.options.layer) {
            map.removeLayer(layer);
        }
    });

    L.tileLayer(`https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${apiKey}`, {
        layer: layerType,
        attribution: "© OpenWeatherMap contributors",
    }).addTo(map);
}

// Search Button Event Listener
searchButton.addEventListener("click", () => {
    const city = locationInput.value.trim();
    if (city) {
        fetchCurrentWeather(city);
        fetchForecast(city);
    } else {
        alert("Please enter a city name.");
    }
});
