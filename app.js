//Storing configuration in the environment separate from code
require('dotenv').config();
// require experess module for npm
const express = require('express');
const path = require('path');
// require https module for npm to get data from remoted server
const https = require('https');
// require body-parser to catch requests from user
const bodyParser = require('body-parser');
// set the apps view enging to ejs (tell the app to use ejs as its view engine)
let ejs = require('ejs');
const { breadcrumbsClasses } = require('@mui/material');

const app = express();
// use EJS as a view enjine (for using templates)
app.set('view engine', 'ejs');
// require styles from public folder
app.use(express.static(__dirname));
// necessary code to be able to parsing through the body of the post request (from body-parser module)
app.use(bodyParser.urlencoded({extended: true}));

// get request for the home page
app.get('/', function(req, res) {
    res.render('/index.html');
})

// post request from user through the input inside form
app.post('/', function(req, res){
    const query = req.body.cityName;
    const appId = '943afe627dbbdaf7e3c11a6d37138e44';
    const unit = 'metric';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + appId + '&units=' + unit;
    https.get(url, function(response){

        response.on('data', function(data){
            // JSON method convert hexadecimal data into javascript object
            const weatherData = JSON.parse(data);
            console.log(weatherData)
            const temp = Math.floor(weatherData.main.temp);
            const feels_like = Math.floor(weatherData.main.feels_like);
            const weatherDescription = weatherData.weather[0].description;

            // convert a unix, UTC format for sunset and sunrise to usual time format for time zone
            // time zone shifts in seconds from UTC
            const timeZone = weatherData.timezone;
            // call function for converting unix, UTC to human readable format of time
            const sunrise = timeConverter(weatherData.sys.sunrise, timeZone);
            const sunset = timeConverter(weatherData.sys.sunset, timeZone);

            // assignment different types of svg depending on received weather icon
            const weatherIcon = weatherData.weather[0].icon;
            let weatherBackground;
            if (weatherIcon.includes("n")) {
                weatherBackground = "#night";
            } else {
                switch (weatherIcon) {
                    case "01d":
                        weatherBackground = "#sunny";
                        break;
                    case "02d":
                        weatherBackground = "#cloudy";
                        break;
                    case "03d":
                        weatherBackground = "#cloudy";
                        break;
                    case "04d":
                        weatherBackground = "#cloudy";
                        break;
                    case "09d":
                        weatherBackground = "#rainy";
                        break;
                    case "10d":
                        weatherBackground = "#rainy";
                        break;
                    case "11d":
                        weatherBackground = "#thunderstorm";
                        break;
                    case "13d":
                        weatherBackground = "#snowy";
                        break;
                    case "50d":
                        weatherBackground = "#misty";
                        break;
                };
            };

            // render data to list
            res.render('list', {
                cityName: query, 
                temperature: temp, 
                feels_like: feels_like, 
                description: weatherDescription,
                sunrise: sunrise,
                sunset: sunset,
                background_svg: weatherBackground
            }) 

        })
    })
})



function timeConverter(time, offset) {
    // add GMT time and offset for the zone (in sec), count it in millisecs
    const timeMillisec = (time + offset) * 1000;
    // get a date and time for this time
    const dateObject = new Date(timeMillisec);
    // take only time in hh:mm format
    const humanDateFormat = dateObject.toLocaleString("en-US", {hour: "numeric",minute: "numeric"})
    return humanDateFormat;
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, function() {
    console.log(`Server is running on port ${port}.`)
})