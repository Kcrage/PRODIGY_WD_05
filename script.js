const API_KEY = '8f997e914723f083c79f3af8d525a625';
const weatherContainer = document.getElementById('weatherDisplay');
const form = document.getElementById('locationForm');
const input = document.getElementById('locationInput');
const locationBtn = document.getElementById('getLocationBtn');

function showWeather(data) {
    if (!data || data.cod !== 200) {
        let msg = '❌ Unknown error occurred.';
        if (data.cod === 401) msg = '❌ Invalid API key.';
        else if (data.cod === 404) msg = '❌ Location not found.';
        weatherContainer.innerHTML = `<p>${msg}</p>`;
        return;
    }

    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherContainer.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${icon}" alt="Weather icon">
        <p><strong>${data.weather[0].main}</strong>: ${data.weather[0].description}</p>
        <p>🌡 Temperature: ${Math.round(data.main.temp)}°C</p>
        <p>🤔 Feels like: ${Math.round(data.main.feels_like)}°C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind: ${data.wind.speed} m/s</p>
    `;
}

function getWeatherByCity(city) {
    if (!city) return;
    weatherContainer.innerHTML = '<p>Loading weather...</p>';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(showWeather)
        .catch(() => {
            weatherContainer.innerHTML = '<p>❌ Network error. Check your connection.</p>';
        });
}

function getWeatherByCoords(lat, lon) {
    weatherContainer.innerHTML = '<p>Loading weather...</p>';
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(showWeather)
        .catch(() => {
            weatherContainer.innerHTML = '<p>❌ Network error. Check your connection.</p>';
        });
}

 
form.addEventListener('submit', e => {
    e.preventDefault();
    getWeatherByCity(input.value.trim());
});

locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        weatherContainer.innerHTML = '<p>Geolocation not supported.</p>';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        pos => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        err => {
            if(err.code === 1) weatherContainer.innerHTML = '<p>Permission denied. Allow location access.</p>';
            else weatherContainer.innerHTML = '<p>Could not access your location.</p>';
        }
    );
});
