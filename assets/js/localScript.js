var weatherKey = '2310f233ab6857108c9bcc03fc5b6458';
var locDateEl = document.querySelector("#location");
var currentTempEl = document.querySelector("#current-temp");
var windSpeedEl = document.querySelector("#wind-speed");
var humidityEl = document.querySelector("#humidity");
var uvIndexEl = document.querySelector("#UV-index");
var currentLocName = " ";

var geoCode = (function(city){
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + weatherKey;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                cDate = dayjs()
                currentLocName = data[0].name + ", " + data[0].state + " (" + (cDate.$M + 1) + "/" + cDate.$D + "/" + cDate.$y + ")";
                fetchWeather(data[0].lat, data[0].lon);
            })
        } else {
            console.log("Search was invalid");
        }
    })
});

var fetchWeather = (function(lat, long){
    var apiUrl = 'http://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&units=metric' + '&appid=' + weatherKey;
    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                fillCurrentWeather(data)
            })
        } else {
            console.log("something no bueno");
        }
    })
});

var fillCurrentWeather = (function(weather) {
    locDateEl.textContent = currentLocName;
    currentTempEl.textContent = "Temperature: " + weather.current.temp;
    windSpeedEl.textContent = "Wind Speed: " + weather.current.wind_speed + " km/h";
    humidityEl.textContent = "Humidity: " + weather.current.humidity + "%";
    uvIndexEl.textContent = "UV Index: " + weather.current.uvi;
});

geoCode('Toronto');