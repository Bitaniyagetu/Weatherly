const express = require('express');
const path = require('path'); 
const app = express();
const axios = require('axios');
const bodyparser = require('body-parser');

const mainController = require('./Server/controllers/mainController');
const accountController = require('./Server/controllers/AccountController');

app.use(express.static(path.join(__dirname, 'Client/public'))); 
app.use(bodyparser.json());

const port = process.env.PORT || 3000;

// Routes
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, 'Client/views') });
});

app.get('/home', function (req, res) {
    res.sendFile('home.html', { root: path.join(__dirname, 'Client/views') }); 
});

app.get('/registration', function (req, res) {
    res.sendFile('registration.html', { root: path.join(__dirname, 'Client/views') }); 
});

app.get('/profile', function (req, res) {
    res.sendFile('profile.html', { root: path.join(__dirname, 'Client/views') }); 
});

app.get('/login', function(req, res){
    res.sendFile('login.html', { root: path.join(__dirname, 'Client/views') });
});

// API routes
app.route('/api/weather/:city')
    .get(mainController.getWeatherData);

app.route('/api/data/:city/:appid')
    .get(mainController.getWeatherData);

app.route('/api/user')
    .post(accountController.getAllUsers);

app.route('/api/user/:id')
    .patch(accountController.updateUser)
    .delete(accountController.deleteUser);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
