// index.js
const express = require('express');
const path = require('path');

const mainController = require('./Server/controllers/mainController');
const accountController = require('./Server/controllers/AccountController');

const app = express();

// ---- Paths (MATCH folder case exactly) ----
const CLIENT_DIR = path.join(__dirname, 'Client');
const PUBLIC_DIR = path.join(CLIENT_DIR, 'Public'); // capital P
const VIEWS_DIR  = path.join(CLIENT_DIR, 'Views');  // capital V

// ---- Middleware ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets (cache lightly so new CSS/JS show up; bump if you want)
app.use(express.static(PUBLIC_DIR, { maxAge: '1h', etag: true }));

// ---- Page routes ----
app.get('/', (_req, res) => res.sendFile(path.join(VIEWS_DIR, 'index.html')));
app.get('/home', (_req, res) => res.sendFile(path.join(VIEWS_DIR, 'home.html')));
app.get('/login', (_req, res) => res.sendFile(path.join(VIEWS_DIR, 'login.html')));
app.get('/profile', (_req, res) => res.sendFile(path.join(VIEWS_DIR, 'profile.html')));
app.get('/registration', (_req, res) => res.sendFile(path.join(VIEWS_DIR, 'registration.html')));

// ---- API routes ----
app.get('/api/weather/:city',   mainController.getWeatherData);
app.get('/api/forecast/:city',  mainController.getForecast); // new 5-day
// (Old /api/data/:city/:appid is redundant—safe to remove.)

app.post('/api/user',           accountController.getAllUsers);
app.patch('/api/user/:id',      accountController.updateUser);
app.delete('/api/user/:id',     accountController.deleteUser);

// ---- 404 fallback ----
app.use((_req, res) => res.status(404).sendFile(path.join(VIEWS_DIR, 'index.html')));

// ---- Error handler ----
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// ---- Start ----
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
