const apiKey = "193d27510af7f5ce2803b8da5657d93e"; 

// Listen for keypress event on search input element
document.getElementById("search-bar").addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        searchWeather();
    }
});

// Listen for click event on search history items
document.getElementById("history-list").addEventListener("click", function(event) {
    if (event.target.tagName === "LI") {
        document.getElementById("search-bar").value = event.target.innerHTML;
        searchWeather();
    }
});

// Call displaySearchHistory() to populate search history box
displaySearchHistory();

function searchWeather() {
    let cityName = document.getElementById("search-bar").value;
    let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;

    // Get current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Display current weather data
            document.getElementById("city-name").innerHTML = data.name;
            document.getElementById("current-icon").innerHTML = `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">`;
            document.getElementById("current-temp").innerHTML = `${Math.round(data.main.temp)}&deg;F`;
            document.getElementById("current-description").innerHTML = data.weather[0].description;

            // Save search history
            let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
            if (!searchHistory.includes(cityName)) {
                searchHistory.unshift(cityName);
                if (searchHistory.length > 5) {
                    searchHistory.pop();
                }
                localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                displaySearchHistory();
            }
        })
        .catch(error => console.log(error));

    // Get 5-day forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Display forecast data
            for (let i = 1; i <= 5; i++) {
                let forecast = data.list[i*8-1];
                let date = new Date(forecast.dt * 1000);
                let day = date.toLocaleDateString("en-US", { weekday: "short" });
                document.getElementById(`day-${i}`).innerHTML = day;
                document.getElementById(`icon-${i}`).innerHTML = `<img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">`;
                document.getElementById(`temp-${i}`).innerHTML = `${Math.round(forecast.main.temp)}&deg;F`;
                document.getElementById(`description-${i}`).innerHTML = forecast.weather[0].description;
            }   
        })
        .catch(error => console.log(error));
}

// Listen for click event on clear history button
document.getElementById("clear-history").addEventListener("click", function() {
    localStorage.removeItem("searchHistory");
    clearHistory();
    document.location.reload();
});


function displaySearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    let historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
    searchHistory.forEach(city => {
        let li = document.createElement("li");
        li.innerHTML = city;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    let historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
}


