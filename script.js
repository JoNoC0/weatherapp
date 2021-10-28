/* 
Create search box for city
- show current and future weather conditions for city
- show city name, date and icon
    - icon represents weather conditions
    - icon represents temperature
    - humidity
    - wind speed
    - UV index
- color indicating 
    - favorable
    - moderate
    - severe
- future weather conditions(same as first criteria)
    - 5 day forecast
        - date
        - icon of weather conditions
        - temperature
        - wind speed
        - humidity
- when clicking on city in search history
    - display current and future weather conditions
*/
var temperatureEl = document.getElementById("temp")
var humidityEl = document.getElementById("humidity")
var windSpeedEl = document.getElementById("speed")
var uvIndexEl = document.getElementById("uv")

var apiKey = "4bf94cd55f931ea5fc3f98c36bdca5d5"

function getCityInfo() {
    var cityNameEl = document.getElementById("cityName");
    var apiCity = "https://api.openweathermap.org/data/2.5/weather?q=" + cityNameEl.value + "&appid="+ apiKey
    console.log(cityNameEl.value);

    fetch(apiCity)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
            // DOM manipulation add/modify HTML
            temperatureEl.innerHTML = "Temperature: " + tempConvert(data.main.temp) + "&#176F";
            humidityEl.innerHTML = "Humidity: " + data.main.humidity + "%"; 
            windSpeedEl.innerHTML = "Wind Speed: " + speedConvert(data.wind.speed) + "MPH";
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var uvUrlEl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=1";
            fetch(uvUrlEl)
                .then(function(res) {
                    console.log(res)
                    return res.json();
                })
                    uvIndexEl.innerHTML = "UV Index: " + res.data[0].coord
                
            

        })
        .catch(function(err) {
            console.log(err);
        });
}
var submitBtn = document.getElementById("cityBtn");
submitBtn.addEventListener("click", getCityInfo);

function tempConvert(temp) {
return Math.round((temp - 273.15) * 1.8 + 32)
}

function speedConvert(speed) {
    return ((2.23694 * speed).toFixed(2))
}