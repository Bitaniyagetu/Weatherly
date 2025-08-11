async function loadWeather(query = '') {
    const out = document.getElementById('weather');
    out.textContent = 'Loading...';
    try {
      let lat, lon, label = '';
  
      if (query) {
        const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`).then(r=>r.json());
        if (!geo.results?.length) { out.textContent = 'City not found.'; return; }
        const r = geo.results[0];
        lat = r.latitude; lon = r.longitude;
        label = `${r.name}${r.admin1 ? ', ' + r.admin1 : ''}${r.country ? ', ' + r.country : ''}`;
      } else {
        const pos = await new Promise((res, rej) => navigator.geolocation ?
          navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy:true, timeout:8000 }) :
          rej(new Error('No geolocation')));
        lat = pos.coords.latitude; lon = pos.coords.longitude;
        label = 'Your location';
      }
  
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const data = await fetch(url).then(r=>r.json());
      const cur = data.current_weather;
      const hi = Math.round(data.daily.temperature_2m_max[0]);
      const lo = Math.round(data.daily.temperature_2m_min[0]);
  
      out.innerHTML = `
        <strong>${label}</strong><br/>
        ${Math.round(cur.temperature)}° · H ${hi}° / L ${lo}° · Wind ${Math.round(cur.windspeed)} km/h
      `;
    } catch (e) {
      out.textContent = 'Could not load weather: ' + e.message;
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => loadWeather());
  