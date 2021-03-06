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
var cityInfoEl = document.getElementById("city-info")
var temperatureEl = document.getElementById("temp")
var humidityEl = document.getElementById("humidity")
var windSpeedEl = document.getElementById("speed")
var uvIndexEl = document.getElementById("uv")
var weatherIconEl = document.getElementById("weather-icon")

var apiKey = "4bf94cd55f931ea5fc3f98c36bdca5d5"

// current weather
function getCityInfo() {
    var cityNameEl = document.getElementById("cityName");
    var apiCity = "https://api.openweathermap.org/data/2.5/weather?q=" + cityNameEl.value + "&appid=" + apiKey
    console.log(cityNameEl.value);

    fetch(apiCity)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            // DOM manipulation add/modify HTML
            var currentDate = new Date(data.dt * 1000);
            var day = currentDate.getDate();
            var month = currentDate.getMonth();
            var year = currentDate.getFullYear();
            cityInfoEl.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ") ";
            var weatherIcon = data.weather[0].icon;
            weatherIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png")
            weatherIconEl.setAttribute("alt", data.weather[0].description);
            console.log(weatherIcon)

            temperatureEl.innerHTML = "Temperature: " + tempConvert(data.main.temp) + "&#176F";
            humidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
            windSpeedEl.innerHTML = "Wind Speed: " + speedConvert(data.wind.speed) + "MPH";

            //input data into api call

            var lat = data.coord.lat;
            var lon = data.coord.lon;

            searchLocation(lat, lon);
            // var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            // console.log(uvUrl)
            // fetch(uvUrl)
            //     .then(function(res) {
            //         console.log(uvUrl)
            //         res.json();
            //     })
            //     .then(function(data) {
            //         console.log(data.current.temp)

            //         var uvIndex = document.createElement("span");
            //         uvIndex.setAttribute("class", "badge badge-danger");
            //         uvIndex.innerHTML = data.coord.value;
            //         uvIndexEl.innerHTML = "UV Index: " + uvUrl;
            //         uvIndexEl.append(uvIndex);
            //     })
            // console.log(uvUrl);
        })
        .catch(function (err) {
            console.log(err);
        });
}
// 5-day forecast and UV index
function searchLocation(lat, long) {
    //pass coordinate data into weather fetch request
    var locationApi =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        long +
        "&appid=" + apiKey +
        "&units=imperial";

    fetch(locationApi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                //   var currentTemp = data.current.temp;
                //   var currentDewPoint = data.current.dew_point;
                //   var currentWindSpeed = data.current.wind_speed;
                var currentUv = data.current.uvi;
                uvButtonText = document.createElement("p");
                uvButtonText.textContent = "UV Index:"
                uvButton = document.createElement("button");
                uvButton.textContent = currentUv

                const uvContainer = document.querySelector("#uv");
                uvButtonText.appendChild(uvButton);
                uvContainer.appendChild(uvButtonText);

                if (currentUv < 3) {
                    uvButton.classList.add("btn-success")
                } else if (currentUv < 6) {
                    uvButton.classList.add("btn-warning")
                } else {
                    uvButton.classList.add("btn-danger");
                }

                //   var weatherForecast = data.daily;
                for (let i = 1; i < 6; i++) {
                    const day = data.daily[i];
                    const dayDiv = document.querySelector("#day" + i)
                    const temp = document.createElement("p")
                    temp.textContent = Math.round(day.temp.day) + "??F"
                    const date = document.createElement("p")
                    date.textContent = new Date(day.dt * 1000).toLocaleDateString();


                    dayDiv.appendChild(temp);
                    dayDiv.appendChild(date);

                }
                //pass variables to current weather display
            });

        } else {
            alert("Error: " + response.statusText);
        }

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