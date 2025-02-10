document.addEventListener('DOMContentLoaded', () => {
    const citySearch = document.getElementById('citySearch');
    const searchButton = document.getElementById('searchButton');
    const cityNameElement = document.getElementById('cityName');
    const weatherTable = document.getElementById('weatherTable');

    // Function to fetch and display weather data
    async function fetchWeatherData(city) {
        try {
            const response = await fetch(`/api/weather/${city}`);
            if (!response.ok) throw new Error('City not found');

            const weatherData = await response.json();
            updateWeatherUI(weatherData, city);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Could not fetch weather data. Please try another city.');
        }
    }

    // Function to update the UI with new weather data
    function updateWeatherUI(weatherData, city) {
        // Update the city name
        cityNameElement.textContent = city;

        // Clear and populate the weather table
        weatherTable.innerHTML = ''; // Clear existing table rows
        const { weather, main, wind, clouds } = weatherData;

        weatherTable.innerHTML = `
            <tr>
                <td>Temperature:</td>
                <td>${main.temp} °C</td>
            </tr>
            <tr>
                <td>Feels Like:</td>
                <td>${main.feels_like} °C</td>
            </tr>
            <tr>
                <td>Humidity:</td>
                <td>${main.humidity}%</td>
            </tr>
            <tr>
                <td>Wind Speed:</td>
                <td>${wind.speed} m/s</td>
            </tr>
            <tr>
                <td>Cloudiness:</td>
                <td>${clouds.all}%</td>
            </tr>
            <tr>
                <td>Description:</td>
                <td>${weather[0].description}</td>
            </tr>
        `;
    }

    // Handle the search button click
    searchButton.addEventListener('click', () => {
        const city = citySearch.value.trim();
        if (city) {
            fetchWeatherData(city);
        } else {
            alert('Please enter a city name.');
        }
    });

    // Auto-search when the user presses "Enter"
    citySearch.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
});
