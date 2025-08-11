// Server/controllers/mainController.js
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.OPENWEATHER;
if (!API_KEY) console.warn('[weather] OPENWEATHER key missing in .env');

// --- tiny in-memory cache (5 minutes) ---
const cache = new Map();
const setCache = (key, data, ttlMs = 5 * 60 * 1000) =>
  cache.set(key, { data, expires: Date.now() + ttlMs });
const getCache = (key) => {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;
  if (hit) cache.delete(key);
  return null;
};

// Normalize units param
function normalizeUnits(u) {
  return (u === 'imperial' || u === 'metric') ? u : 'metric';
}

// ============= CURRENT WEATHER =============
exports.getWeatherData = async (req, res) => {
  const city = (req.params.city || '').trim();
  const units = normalizeUnits(req.query.units);
  if (!city) return res.status(400).json({ error: 'City is required' });
  if (!API_KEY) return res.status(500).json({ error: 'Server missing API key' });

  const cacheKey = `current:${units}:${city.toLowerCase()}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: city, units, appid: API_KEY },
      timeout: 10000
    });
    setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    handleOWMError(error, res);
  }
};

// ============= 5-DAY FORECAST (condensed) =============
exports.getForecast = async (req, res) => {
  const city = (req.params.city || '').trim();
  const units = normalizeUnits(req.query.units);
  if (!city) return res.status(400).json({ error: 'City is required' });
  if (!API_KEY) return res.status(500).json({ error: 'Server missing API key' });

  const cacheKey = `forecast:${units}:${city.toLowerCase()}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: { q: city, units, appid: API_KEY },
      timeout: 10000
    });

    const byDate = {};
    for (const entry of data.list) {
      const [date, time] = entry.dt_txt.split(' ');
      (byDate[date] ||= []).push({ ...entry, _time: time });
    }

    const days = Object.keys(byDate)
      .slice(0, 5)
      .map((date) => {
        const items = byDate[date];
        let min = Infinity, max = -Infinity;
        let chosen = items[0];
        for (const it of items) {
          min = Math.min(min, it.main.temp_min);
          max = Math.max(max, it.main.temp_max);
          if (it._time.startsWith('12:00:00')) chosen = it;
        }
        const w = chosen.weather?.[0] || {};
        return {
          date,
          min: Math.round(min),
          max: Math.round(max),
          icon: w.icon || '01d',
          description: w.description || ''
        };
      });

    const payload = { city: data.city?.name || city, country: data.city?.country || '', units, days };
    setCache(cacheKey, payload);
    res.json(payload);
  } catch (error) {
    handleOWMError(error, res);
  }
};

// ============= helpers =============
function handleOWMError(error, res) {
  if (error.response) {
    const code = error.response.status || 500;
    const msg = error.response.data?.message || 'Upstream error';
    return res.status(code).json({ error: msg });
  }
  if (error.request) return res.status(502).json({ error: 'No response from weather service' });
  return res.status(500).json({ error: error.message || 'Server error' });
}
