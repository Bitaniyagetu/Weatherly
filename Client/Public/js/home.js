document.addEventListener('DOMContentLoaded', () => {
    const citySearch = document.getElementById('citySearch');
    const searchButton = document.getElementById('searchButton');
  
    // New elements from the upgraded HTML
    const weatherCard   = document.getElementById('weatherCard');
    const welcomeText   = document.getElementById('welcomeText');
    const cityNameEl    = document.getElementById('cityName');
    const bigTempEl     = document.getElementById('bigTemp');
    const summaryTextEl = document.getElementById('summaryText');
    const updatedTimeEl = document.getElementById('updatedTime');
    const weatherTable  = document.getElementById('weatherTable');
    const forecastRow   = document.getElementById('forecastRow');
  
    async function fetchWeatherData(city) {
      try {
        const res = await fetch(`/api/weather/${encodeURIComponent(city)}`);
        if (!res.ok) throw new Error('City not found');
        const data = await res.json();
        updateWeatherUI(data, city);
  
        // also fetch forecast
        fetchForecast(city);
  
        localStorage.setItem('lastCity', city);
      } catch (err) {
        console.error(err);
        alert('Could not fetch weather data. Try another city.');
      }
    }
  
    async function fetchForecast(city) {
      try {
        const res = await fetch(`/api/forecast/${encodeURIComponent(city)}`);
        if (!res.ok) throw new Error('Forecast not available');
        const payload = await res.json();
        renderForecast(payload.days || []);
      } catch (e) {
        console.warn('Forecast fetch failed:', e);
        if (forecastRow) forecastRow.innerHTML = '';
      }
    }
  
    function updateWeatherUI(weatherData, city) {
      // show card / hide welcome
      if (weatherCard) weatherCard.hidden = false;
      if (welcomeText) welcomeText.style.display = 'none';
  
      const { weather, main, wind, clouds, name } = weatherData;
      const desc = weather?.[0]?.description || '';
      const mainGroup = weather?.[0]?.main || '';
      const temp = Math.round(main.temp);
  
      cityNameEl.textContent = name || city;
      bigTempEl.textContent = `${temp}°`;
      summaryTextEl.textContent = desc;
      updatedTimeEl.textContent = `Updated ${new Date().toLocaleString()}`;
  
      weatherTable.innerHTML = `
        <tr><td>Temperature:</td><td>${main.temp} °C</td></tr>
        <tr><td>Feels Like:</td><td>${main.feels_like} °C</td></tr>
        <tr><td>Humidity:</td><td>${main.humidity}%</td></tr>
        <tr><td>Wind Speed:</td><td>${wind.speed} m/s</td></tr>
        <tr><td>Cloudiness:</td><td>${clouds.all}%</td></tr>
        <tr><td>Description:</td><td>${desc}</td></tr>
      `;
  
      setWeatherTheme(mainGroup, weather?.[0]?.id);
    }
  
    function renderForecast(days) {
      if (!forecastRow) return;
      if (!Array.isArray(days) || days.length === 0) {
        forecastRow.innerHTML = '';
        return;
      }
  
      const fmtDay = (iso) => {
        const d = new Date(iso + 'T12:00:00');
        return d.toLocaleDateString(undefined, { weekday: 'short' });
      };
  
      forecastRow.innerHTML = days
        .slice(0, 5)
        .map(d => `
          <div class="day">
            <div class="label">${fmtDay(d.date)}</div>
            <img alt="${d.description}" width="48" height="48"
                 src="https://openweathermap.org/img/wn/${d.icon}@2x.png"/>
            <div class="range">${d.max}° / ${d.min}°</div>
            <div class="small-muted">${d.description}</div>
          </div>
        `)
        .join('');
    }
  
    // Simple theme mapper
    function setWeatherTheme(mainGroup, id) {
      const body = document.body;
      body.className = '';
      const g = (mainGroup || '').toLowerCase();
      if (g.includes('clear')) body.classList.add('sunny');
      else if (g.includes('cloud')) body.classList.add('cloudy');
      else if (g.includes('rain') || g.includes('drizzle')) body.classList.add('rainy');
      else if (g.includes('snow')) body.classList.add('snowy');
      else if (g.includes('thunder')) body.classList.add('thunder');
      else if (g.includes('fog') || g.includes('mist') || g.includes('haze')) body.classList.add('fog');
      else if (typeof id === 'number' && id >= 200 && id < 300) body.classList.add('thunder');
      else body.classList.add('cloudy');
    }
  
    // search handlers
    searchButton.addEventListener('click', () => {
      const city = citySearch.value.trim();
      if (city) fetchWeatherData(city);
      else alert('Please enter a city name.');
    });
    citySearch.addEventListener('keypress', e => {
      if (e.key === 'Enter') searchButton.click();
    });
  
    // initial load
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
      fetchWeatherData(lastCity);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async pos => {
        try {
          const { latitude, longitude } = pos.coords;
          const geoRes = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
          const geo = await geoRes.json();
          const city =
            geo.address?.city ||
            geo.address?.town ||
            geo.address?.village ||
            geo.address?.state;
          if (city) fetchWeatherData(city);
        } catch (e) {
          console.warn('Geolocation lookup failed:', e);
        }
      }, err => console.warn('Geolocation denied:', err));
    }
  });
  