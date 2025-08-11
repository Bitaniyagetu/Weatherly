document.addEventListener('DOMContentLoaded', () => {
    const citySearch   = document.getElementById('citySearch');
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
  
    // Units toggle
    const unitsMetric   = document.getElementById('unitsMetric');
    const unitsImperial = document.getElementById('unitsImperial');
  
    function getUnits() {
      const saved = localStorage.getItem('units');
      return saved === 'imperial' ? 'imperial' : 'metric';
    }
    function setUnits(u) {
      const units = (u === 'imperial') ? 'imperial' : 'metric';
      localStorage.setItem('units', units);
      if (unitsMetric) unitsMetric.checked = units === 'metric';
      if (unitsImperial) unitsImperial.checked = units === 'imperial';
      return units;
    }
    function unitSymbol(units) { return units === 'imperial' ? '°F' : '°C'; }
    function windLabel(units)  { return units === 'imperial' ? 'mph' : 'm/s'; }
  
    // init units UI
    setUnits(getUnits());
  
    function setLoading(on) {
      if (!searchButton) return;
      searchButton.disabled = on;
      searchButton.textContent = on ? 'Loading…' : 'Search';
    }
  
    async function fetchWeatherData(cityRaw) {
      const city = (cityRaw || '').replace(/\s+/g, ' ').trim();
      const units = getUnits();
      if (!city) { alert('Please enter a city name.'); return; }
      try {
        setLoading(true);
        if (forecastRow) forecastRow.innerHTML = '';
  
        const res = await fetch(`/api/weather/${encodeURIComponent(city)}?units=${units}`);
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || 'City not found');
        }
        const data = await res.json();
        updateWeatherUI(data, city, units);
  
        // also fetch forecast (don’t block UI)
        fetchForecast(city, units).catch(() => {});
        localStorage.setItem('lastCity', city);
      } catch (err) {
        console.error(err);
        alert(err.message || 'Could not fetch weather data. Try another city.');
      } finally {
        setLoading(false);
      }
    }
  
    async function fetchForecast(city, units) {
      const res = await fetch(`/api/forecast/${encodeURIComponent(city)}?units=${units}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Forecast not available');
      }
      const payload = await res.json();
      renderForecast(payload.days || [], units);
    }
  
    function updateWeatherUI(weatherData, city, units) {
      // show card / hide welcome
      if (weatherCard) weatherCard.hidden = false;
      if (welcomeText) welcomeText.style.display = 'none';
  
      const { weather, main, wind, clouds, name } = weatherData;
      const desc = weather?.[0]?.description || '';
      const mainGroup = weather?.[0]?.main || '';
      const temp = Math.round(main.temp);
      const sym = unitSymbol(units);
  
      cityNameEl.textContent    = name || city;
      bigTempEl.textContent     = `${temp}${sym}`;
      summaryTextEl.textContent = desc;
      updatedTimeEl.textContent = `Updated ${new Date().toLocaleString()}`;
  
      weatherTable.innerHTML = `
        <tr><td>Temperature:</td><td>${main.temp} ${sym}</td></tr>
        <tr><td>Feels Like:</td><td>${main.feels_like} ${sym}</td></tr>
        <tr><td>Humidity:</td><td>${main.humidity}%</td></tr>
        <tr><td>Wind Speed:</td><td>${wind.speed} ${windLabel(units)}</td></tr>
        <tr><td>Cloudiness:</td><td>${clouds.all}%</td></tr>
        <tr><td>Description:</td><td>${desc}</td></tr>
      `;
  
      setWeatherTheme(mainGroup, weather?.[0]?.id);
    }
  
    function renderForecast(days, units) {
      if (!forecastRow) return;
      if (!Array.isArray(days) || days.length === 0) {
        forecastRow.innerHTML = '';
        return;
      }
      const sym = unitSymbol(units);
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
            <div class="range">${d.max}${sym} / ${d.min}${sym}</div>
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
    searchButton.addEventListener('click', () => fetchWeatherData(citySearch.value));
    citySearch.addEventListener('keypress', e => { if (e.key === 'Enter') fetchWeatherData(citySearch.value); });
  
    // units change → refetch current city (if we have one)
    function currentCity() {
      const txt = (cityNameEl?.textContent || '').trim();
      // avoid “City” placeholder triggering refetch
      if (!txt || txt.toLowerCase() === 'city') return null;
      return txt;
    }
    [unitsMetric, unitsImperial].forEach(el => {
      if (!el) return;
      el.addEventListener('change', () => {
        const u = setUnits(el.value);
        const c = currentCity() || localStorage.getItem('lastCity') || citySearch.value.trim();
        if (c) fetchWeatherData(c);
      });
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
  