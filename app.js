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
            const feels_like = weatherData.main.feels_like;
            const weatherDescription = weatherData.weather[0].description;

            // convert a unix, UTC format for sunset and sunrise to usual time format for time zone
            // timeZone shifts in seconds from UTC
            const timeZone = weatherData.timezone;
            // call function for converting unix, UTC to human readable format of time
            const sunrise = timeConverter(weatherData.sys.sunrise, timeZone);
            const sunset = timeConverter(weatherData.sys.sunset, timeZone);
            
            // render data to list
            const weatherIcon = weatherData.weather[0].icon;
            res.render('list', {
                cityName: query, 
                temperature: temp, 
                feels_like: feels_like, 
                description: weatherDescription,
                sunrise: sunrise,
                sunset: sunset,
                icon: weatherIcon
            }) 

        })
    })
})


function timeConverter(time, offset) {
    // add GMT time and offset for the zone (in sec), count it in millisecs
    const timeMillisec = (time + offset) * 1000;
    // get a date and time for this time
    const dateObject = new Date(timeMillisec);
    // take only time in hh:mm:ss
    const humanDateFormat = dateObject.toLocaleString("en-US", {hour: "numeric",minute: "numeric"})
    return humanDateFormat;
}

app.listen(3000, function() {
    console.log('Server is running on port 3000.')
})