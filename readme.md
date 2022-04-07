## Week 6 - Weather Dashboard App

This weekly challenge is to use the OpenWeather api to create a dashboard that will display weather for entered locations, save entries and recall them when the dashboard is revisited.

My application presents all requested information for an area and saves each search to a history of clickable buttons under the search controls. Clicking a button will return the appropriate weather and forecast.

Additionally my dashboard will save previous searches between sessions, as of writing my dashboard does not have a function for removing previous searches.

### Links

[Deployed App](https://charlestietjen.github.io/Trilogy-HW-Week-6-Weather-Dashboard/ "Weather Dashboard")

![Project Screenshot](img/project-ss.png?raw=true)

### Acceptance Criteria

GIVEN a weather dashboard with form inputs

WHEN I search for a city

THEN I am presented with current and future conditions for that city and that city is added to the search history

WHEN I view current weather conditions for that city

THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV 

WHEN I view the UV index

THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

WHEN I view future weather conditions for that city

THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

WHEN I click on a city in the search history

THEN I am again presented with current and future conditions for that city