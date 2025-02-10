const express = require('express');
const path = require('path'); 
const app = express();
const axios = require('axios');
const bodypaser = require('body-parser')

const mainController = require('./controllers/mainController')

const accountController = require('./controllers/AccountController')

app.use(express.static(path.join(__dirname, '../Client/public'))); 
app.use(bodypaser.json())

const port = 3000;

// Routes
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../Client/views') });
});

app.get('/home', function (req, res) {
    res.sendFile('home.html', { root: path.join(__dirname, '../Client/views') }); 
});

app.get('/registration', function (req, res) {
    res.sendFile('registration.html', { root: path.join(__dirname, '../Client/views') }); 
});

app.get('/profile', function (req, res) {
    res.sendFile('profile.html', { root: path.join(__dirname, '../Client/views') }); 
});

app.get('/login', function(req,res){
    res.sendFile('login.html', {root: path.join(__dirname, '../Client/views')});
});

// There should be a default route that returns data with GET

// The names of your routes should comply with the RESTful API specifications
app.route('/api/weather/:city')  //post http://localhost:3000/api/:city should get all data for that city 
    .get(mainController.getWeatherData)

app.route('/api/data/:city/:appid') // get http://localhost:3000/api/:city/:appid should return that specific appid
    .get(mainController.getWeatherData)


app.route('/api/user') //post http://localhost:3000/api/user //should get users from pasting it into the raw file of postman in user.js
    .post(accountController.getAllUsers) // A POST should create a new user

app.route('/api/user/:id')
    .patch(accountController.updateUser) //patch http://localhost:3000/api/user/:{id that is given by SQL}
    .delete(accountController.deleteUser);//delete http://localhost:3000/api/user/:{id that is given by SQL}



    


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
