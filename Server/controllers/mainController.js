//import axios from 'axios';
//import dotenv from 'dotenv';

const axios = require('axios');
require('dotenv').config()



const apikey = process.env.OPENWEATHER;
console.log(apikey)

exports.getWeatherData = async (req, res) => {
    const city = req.params.city;

    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    q: city,
                    units: 'metric',
                    appid: "7a3e4886ec13f53f8a39bde88631a28e",
                },
            }
        );
        res.json(response.data); // Send weather data as JSON
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message });
        } else if (error.request) {
            res.status(500).json({ error: "No response from the weather service" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
}
