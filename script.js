

        const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';  // Replace with your OpenWeatherMap API Key

        const locationInput = document.getElementById('locationInput');
        const searchBtn = document.getElementById('searchBtn');
        const weatherInfo = document.getElementById('weatherInfo');
        const locationName = document.getElementById('locationName');
        const temperature = document.getElementById('temperature');
        const description = document.getElementById('description');
        const weatherIcon = document.getElementById('weatherIcon');
        const localDateTime = document.getElementById('localDateTime');
        const errorMessage = document.getElementById('errorMessage');

        searchBtn.addEventListener('click', () => {
            const location = locationInput.value.trim();
            if (location) {
                getWeather(location);
            }
        });

        async function getWeather(location) {
            errorMessage.style.display = 'none';
            weatherInfo.style.display = 'none';

            try {
                // Fetch weather data from OpenWeatherMap API
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
                );

                if (!response.ok) {
                    throw new Error('Location not found');
                }

                const data = await response.json();

                // Display weather information
                locationName.textContent = `${data.name}, ${data.sys.country}`;
                temperature.textContent = `${Math.round(data.main.temp)}°C`;
                description.textContent = data.weather[0].description;
                weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`;
                weatherIcon.alt = data.weather.description + ' icon';

                // Calculate and display local date/time of the location using timezone offset
                displayLocalDateTime(data.timezone);

                weatherInfo.style.display = 'block';
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            }
        }

        function displayLocalDateTime(timezoneOffsetSeconds) {
            // timezoneOffsetSeconds is offset from UTC in seconds
            const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
            const localTime = new Date(utcTime + timezoneOffsetSeconds * 1000);

            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            };
            localDateTime.textContent = `Local Time: ${localTime.toLocaleString(undefined, options)}`;
        }

        // Optionally fetch default city weather on page load
        window.onload = () => {
            locationInput.value = 'New York';
            getWeather('New York');
        };
let refreshIntervalId = null; // To keep track of the interval timer

searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        startWeatherUpdates(location);
    }
});

async function fetchWeather(location) {
    errorMessage.style.display = 'none';
    weatherInfo.style.display = 'none';

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
            throw new Error('Location not found');
        }
        const data = await response.json();

        locationName.textContent = `${data.name}, ${data.sys.country}`;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        description.textContent = data.weather[0].description;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`;
        weatherIcon.alt = data.weather.description + ' icon';

        displayLocalDateTime(data.timezone);

        weatherInfo.style.display = 'block';
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
}

function startWeatherUpdates(location) {
    // Clear previous interval if any
    if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
    }
    // Fetch immediately
    fetchWeather(location);

    // Set interval to update weather every 60 seconds
    refreshIntervalId = setInterval(() => {
        fetchWeather(location);
    }, 60000);
}

function displayLocalDateTime(timezoneOffsetSeconds) {
    const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + timezoneOffsetSeconds * 1000);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    localDateTime.textContent = `Local Time: ${localTime.toLocaleString(undefined, options)}`;
}
const darkModeToggle = document.getElementById('darkModeToggle') || document.getElementById('darkModeToggleBtn');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
// Load saved mode on page load
window.onload = () => {
  if(localStorage.getItem('dark-mode') === 'enabled'){
    document.body.classList.add('dark-mode');
    if(darkModeToggle.type === 'checkbox') darkModeToggle.checked = true;
  }
};

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  if(document.body.classList.contains('dark-mode')){
     localStorage.setItem('dark-mode', 'enabled');
  } else {
     localStorage.setItem('dark-mode', 'disabled');
  }
});
// Get the humidity value and show it
const humidityEl = document.getElementById('humidity');
humidityEl.textContent = `Humidity: ${data.main.humidity}%`;

// Get sunrise time (timestamp in seconds), convert using timezone offset
const sunriseTimestamp = data.sys.sunrise; // in UTC seconds
const timezoneOffset = data.timezone; // in seconds

// Convert to local date object based on location timezone
const sunriseDate = new Date((sunriseTimestamp + timezoneOffset) * 1000);

// Format time in HH:MM (24hr) format
const sunriseHours = sunriseDate.getUTCHours().toString().padStart(2, '0');
const sunriseMinutes = sunriseDate.getUTCMinutes().toString().padStart(2, '0');
const sunriseTimeFormatted = `${sunriseHours}:${sunriseMinutes}`;

const sunriseEl = document.getElementById('sunrise');
sunriseEl.textContent = `Sunrise: ${sunriseTimeFormatted} (local time)`;
