//Storing configuration in the environment separate from code
require('dotenv').config();
// require experess module for npm
const express = require('express');
const path = require('path');
// require https module for npm to get data from remoted server
const https = require('https');
// require body-parser to catch requests from user
const bodyParser = require('body-parser');

let ejs = require('ejs');

const app = express();
// use EJS as a view enjine (for using templates)
app.set('view engine', 'ejs');


// require styles from public folder
app.use(express.static(__dirname));
// necessary code to be able to parsing through the body of the post request(from body-parser module)
app.use(bodyParser.urlencoded({extended: true}));

// get request for the home page
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

// post request from user through the form
app.post('/', function(req, res){
    const query = req.body.cityName;
    const appId = process.env.API_KEY;
    const unit = 'metric';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + appId + '&units=' + unit;
    https.get(url, function(response){

        response.on('data', function(data){
            // JSON method convert hexadecimal data into javascript object
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            var imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    
            res.write('<h1>The temperature in ' + query + ' is ' + temp + ' degrees.</h1>');
            res.write('<p>The weather is currently ' + weatherDescription + '.</p>');
            res.write('<img src=' + imageURL + '>');
        })
    })
})



app.listen(3000, function() {
    console.log('Server is running on port 3000.')
})