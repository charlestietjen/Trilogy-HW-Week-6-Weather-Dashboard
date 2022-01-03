var weatherKey = '2310f233ab6857108c9bcc03fc5b6458';
var locDateEl = document.querySelector("#location");
var currentTempEl = document.querySelector("#current-temp");
var windSpeedEl = document.querySelector("#wind-speed");
var humidityEl = document.querySelector("#humidity");
var uvIndexEl = document.querySelector("#UV-index");
var currentLocName = " ";
var searchBtnEl = document.querySelector("#search-btn");
var inputEl = document.querySelector("#city-input");
var fiveDayEl = document.querySelector("#five-day-weather");
var searchHistEl = document.querySelector("#prev-cities");
var searchHist = [];
var histBtnEl = document.querySelectorAll(".prev-btn");

var geoCode = (function(city){
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + weatherKey;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if (data.length === 0) {
                    alert("Entered location returned no results.");
                } else {
                    fetchWeather(data[0].lat, data[0].lon);
                    currentLocName = data[0].name + ", " + data[0].state;
                    for(i = 0; i < searchHist.length; i++){
                        if (searchHist[i] === currentLocName){
                            console.log(searchHist);
                            return;
                        }
                    }
                    histBtnHandler(currentLocName);
                }
            })
        } else {
            console.log("Search was invalid");
        }
    })
});

var histBtnHandler = (function(name){
    console.log(name);
    console.log(searchHist);
    histBtnEl = document.querySelectorAll(".prev-btn");
    var newBtn = document.createElement("button");
    newBtn.classList = "prev-btn button is-fullwidth is-link";
    newBtn.value = name;
    newBtn.innerText = name;
    console.log(newBtn);
    searchHistEl.appendChild(newBtn);
    saveSearchHist(name);
    newBtn.addEventListener("click", function() {
        geoCode(name)});
})

var fetchWeather = (function(lat, long){
    var apiUrl = 'http://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&units=metric' + '&appid=' + weatherKey;
    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                fillCurrentWeather(data);
                fillFiveDayWeather(data);
                //console.log(data);
            })
        } else {
            console.log("weather no bueno");
        }
    })
});

var fillCurrentWeather = (function(weather) {
    var cDate = dayjs.unix(weather.current.dt);
    currentLocName = currentLocName + " (" + (cDate.$M + 1) + "/" + cDate.$D + "/" + cDate.$y + ")";
    locDateEl.textContent = currentLocName;
    currentTempEl.textContent = "Temperature: " + weather.current.temp + "C";
    windSpeedEl.textContent = "Wind Speed: " + weather.current.wind_speed + " km/h";
    humidityEl.textContent = "Humidity: " + weather.current.humidity + "%";
    uvIndexEl.textContent = "UV Index: " + weather.current.uvi;
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
        day[i].icon = "http://openweathermap.org/img/wn/" + weather.daily[i].weather[0].icon + "@2x.png";
        day[i].temp = weather.daily[i].temp.day;
        day[i].wind = weather.daily[i].wind_speed;
        day[i].hum = weather.daily[i].humidity;
        var containerCardEl = document.createElement("div");
        containerCardEl.classList = "card is-link";
        var uDate = dayjs.unix(weather.daily[i].dt);
        var dateEl = document.createElement("h3");
        dateEl.innerText = (uDate.$M + 1) + "/" + uDate.$D + "/" + uDate.$y;
        var wIconConEl = document.createElement("div");
        wIconConEl.classList = "card-image";
        var wIconEl = document.createElement("figure")
        wIconEl.classList = "image, is-16x16";
        wIconEl.innerHTML = "<img src='" + day[i].icon + "' alt='Weather Icon'>";
        var tempEl = document.createElement("P");
        tempEl.classList = "card-content";
        tempEl.innerText = "Temperature: " + day[i].temp + "C";
        var windEl = document.createElement("P");
        windEl.classList = "card-content";
        windEl.innerText = "Wind Speed: " + day[i].wind + "km/h";
        var humEl = document.createElement("P");
        humEl.classList = "card-content";
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