var weatherKey = '2310f233ab6857108c9bcc03fc5b6458';
var locDateEl = document.querySelector("#location");
var currentTempEl = document.querySelector("#current-temp");
var windSpeedEl = document.querySelector("#wind-speed");
var humidityEl = document.querySelector("#humidity");
var uvIndexEl = document.querySelector("#UV-index");
var currentIconEl = document.querySelector("#current-weather-icon");
var currentLocName = " ";
var searchBtnEl = document.querySelector("#search-btn");
var inputEl = document.querySelector("#city-input");
var fiveDayEl = document.querySelector("#five-day-weather");
var searchHistEl = document.querySelector("#prev-cities");
var searchHist = [];
var histBtnEl = document.querySelectorAll(".prev-btn");

var geoCode = (function(city){
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + weatherKey;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if (data.length === 0) {
                    locDateEl.innerText = "Location entered was invalid or received no results, please try again.";
                } else {
                    fetchWeather(data[0].lat, data[0].lon);
                    if (data[0].state === undefined){
                        currentLocName = data[0].name;
                    } else {
                        currentLocName = data[0].name + ", " + data[0].state;
                    }
                    for(i = 0; i < searchHist.length; i++){
                        if (searchHist[i] === currentLocName){
                            return;
                        }
                    }
                    histBtnHandler(currentLocName);
                }
            })
        } else {
            locDateEl.innerText("Location entered was invalid or received no results, please try again.");
        }
    })
});

var histBtnHandler = (function(name){
    histBtnEl = document.querySelectorAll(".prev-btn");
    var newBtn = document.createElement("button");
    newBtn.classList = "prev-btn button is-fullwidth is-link";
    newBtn.value = name;
    newBtn.innerText = name;
    searchHistEl.appendChild(newBtn);
    saveSearchHist(name);
    newBtn.addEventListener("click", function() {
        geoCode(name)});
})

var fetchWeather = (function(lat, long){
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&units=metric' + '&appid=' + weatherKey;
    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                fillCurrentWeather(data);
                fillFiveDayWeather(data);
            })
        } else {
            locDateEl.innerText = "No/Invalid response from Weather Source, please try again later.";
        }
    })
});

var fillCurrentWeather = (function(weather) {
    var cDate = dayjs.unix(weather.current.dt);
    currentLocName = currentLocName + " (" + (cDate.$M + 1) + "/" + cDate.$D + "/" + cDate.$y + ")";
    locDateEl.textContent = currentLocName + " - " + weather.current.weather[0].main + ", " + weather.current.weather[0].description;
    var cIconUrl = "https://openweathermap.org/img/wn/" + weather.current.weather[0].icon + "@2x.png";
    var uviNum = Number(weather.current.uvi);
    var uvColorClass = "has-background-success";
    if (uviNum >= 11) {
        uvColorClass = "has-background-danger";
    } else if (uviNum >= 8) {
        uvColorClass = "has-background-danger";
    } else if (uviNum >= 6) {
        uvColorClass = "has-background-warning";
    } else if (uviNum >= 3) {
        uvColorClass = "has-background-warning";
    };
    currentTempEl.textContent = "Temperature: " + weather.current.temp + "C";
    windSpeedEl.textContent = "Wind Speed: " + weather.current.wind_speed + " km/h";
    humidityEl.textContent = "Humidity: " + weather.current.humidity + "%";
    uvIndexEl.textContent = "UV Index: " + weather.current.uvi;
    uvIndexEl.classList = uvColorClass;
    currentIconEl.setAttribute("src", cIconUrl);
    console.log(weather);
    console.log(cIconUrl);
});

var fillFiveDayWeather = (function(weather) {
    fiveDayEl.textContent = "";
    var day = [
        {
            icon: " ",
            temp: " ",
            wind: " ",
            hum: " "
        },
        {
            icon: " ",
            temp: " ",
            wind: " ",
            hum: " "
        },
        {
            icon: " ",
            temp: " ",
            wind: " ",
            hum: " "
        },
        {
            icon: " ",
            temp: " ",
            wind: " ",
            hum: " "
        },
        {
            icon: " ",
            temp: " ",
            wind: " ",
            hum: " "
        }
    ];
    for (i = 0; i < day.length; i++) {
        day[i].icon = "https://openweathermap.org/img/wn/" + weather.daily[i].weather[0].icon + "@2x.png";
        day[i].temp = weather.daily[i].temp.day;
        day[i].wind = weather.daily[i].wind_speed;
        day[i].hum = weather.daily[i].humidity;
        var containerCardEl = document.createElement("div");
        containerCardEl.classList = "card is-link";
        var uDate = dayjs.unix(weather.daily[i].dt);
        var dateEl = document.createElement("h3");
        dateEl.innerText = (uDate.$M + 1) + "/" + uDate.$D + "/" + uDate.$y;
        dateEl.classList = "card-header card-header-title subtitle";
        var wIconConEl = document.createElement("div");
        wIconConEl.classList = "card-image";
        var wIconEl = document.createElement("figure")
        wIconEl.classList = "image, is-16x16";
        wIconEl.innerHTML = "<img src='" + day[i].icon + "' alt='Weather Icon'>";
        var tempEl = document.createElement("P");
        tempEl.classList = "card-content subtitle";
        tempEl.innerText = "Temperature: " + day[i].temp + "C";
        var windEl = document.createElement("P");
        windEl.classList = "card-content subtitle";
        windEl.innerText = "Wind Speed: " + day[i].wind + "km/h";
        var humEl = document.createElement("P");
        humEl.classList = "card-content subtitle";
        humEl.innerText = "Humidity: " + day[i].hum + "%";
        fiveDayEl.appendChild(containerCardEl);
        containerCardEl.appendChild(dateEl);
        containerCardEl.appendChild(wIconConEl);
        containerCardEl.appendChild(tempEl);
        containerCardEl.appendChild(windEl);
        containerCardEl.appendChild(humEl);
        wIconConEl.appendChild(wIconEl);
        }
});

var saveSearchHist = (function(name){
    for(i = 0; i < searchHist.length; i++) {
        if (searchHist[i] === name) {
            return;
        }
    }
    searchHist.push(name);
    localStorage.setItem("searchHistory", JSON.stringify(searchHist));
});

var loadSearchHist = (function(){
    searchHist = JSON.parse(localStorage.getItem("searchHistory"));
    if (searchHist === null) {
        searchHist = [];
    }
   for (i = 0; i < searchHist.length; i++) {
        histBtnHandler(searchHist[i]);
    };
});

searchBtnEl.addEventListener("click", function(){
    var searchTerm = inputEl.value;
    geoCode(searchTerm);
});

loadSearchHist();