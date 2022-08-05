let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* change Forecast time */
function changeNextDate(timestamp) {
  let nextDate = new Date(timestamp * 1000);
  return days[nextDate.getDay()];
}

/* Forecast */
function displayForecast(response) {
  let forecast = response.data.daily;
  let forcastElement = document.querySelector("#forecast");
  let forecastHtml = ``;

  forecast.shift();
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
      <div class="col-lg-2 col-md-4 col-sm-5">
        <div class="nextWeather-icon">
          <img
            src="image/animated/${forecastDay.weather[0].icon}.svg"
            alt="partly-cloudy"
            width="70px"
          />
        </div>
        <div class="weather-box">
          <span class="nextDate">${changeNextDate(forecastDay.dt)}</span>
          <span class="nextDegree" id="nextDegree">${Math.round(
            forecastDay.temp.max
          )}°</span>
        </div>
       </div>
    `;
    }
  });
  forcastElement.innerHTML = forecastHtml;
}

/* Get Forecast */
function getForecast(coordinates) {
  let apiKey = "ab4448a82d0d50e0ba09f05600cb7043";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

/* Message box */
function messageBox(iconNum, temp) {
  iconNum = iconNum.slice(0, -1);
  let messages = {
    00: "If the temperature is less than my age, I dont get out of bed!",
    01: "The weather is perfect. The gods are shining on us.",
    02: "Who cares about the clouds when we're together? Just sing a song and bring the sunny weather.",
    03: "Oh, the lovely clouds again",
    04: "Oh, the lovely clouds again",
    05: "I love cold, windy weather.",
    09: "How about sitting a little bit next to the window, relaxing with cup of tea and reading some books!",
    10: "No matter what the weather, always bring your own sunshine.",
    11: "If you want to see the sunshine, you have to weather the storm.",
    13: "It is too cold out there, lets just stay and have our hot chocolate",
    50: "There is really no such thing as bad weather, only different kinds of good weather",
  };
  let ImgElement = document.querySelector("#messageImg");
  let textElement = document.querySelector("#message");

  if ((temp < 15) & (temp > 8)) {
    ImgElement.setAttribute("src", `image/${"00"}.svg`);
    textElement.innerHTML = `“ ${messages[00]} “`;
  } else {
    ImgElement.setAttribute("src", `image/${iconNum}.svg`);
    textElement.innerHTML = `“ ${messages[parseInt(iconNum)]} “`;
  }
}

/*  change circular progress bar */
function changeProgressBar(h, f, w) {
  h = Math.round(220 - 220 * (h / 100));
  f = Math.round(220 - 220 * (f / 100));
  w = Math.round(220 - 220 * (w / 100));

  document.documentElement.style.setProperty("--dashoffset-h", h);
  document.documentElement.style.setProperty("--dashoffset-f", f);
  document.documentElement.style.setProperty("--dashoffset-w", w);
}

/* change Current time */
function changeCurrDate(timestamp) {
  let now = new Date(timestamp);

  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let currClock = document.querySelector("#currClock");
  let currDate = document.querySelector("#currDate");

  currClock.innerHTML = `${("0" + now.getHours()).slice(-2)}:${(
    "0" + now.getMinutes()
  ).slice(-2)}`;
  currDate.innerHTML = `${day}, ${month} ${now.getDate()}`;
}

/* current weather */
function currWeather(response) {
  let currtemp = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let feelsLike = Math.round(response.data.main.feels_like);
  let windSpeed = Math.round(response.data.wind.speed);
  let iconNum = response.data.weather[0].icon;
  let date = response.data.dt * 1000;

  //getting from Html
  let currTempText = document.querySelector("#current-degree");
  let descriptionText = document.querySelector("#description");
  let humidityText = document.querySelector("#humidityPercentage");
  let feelsLikeText = document.querySelector("#feelsLikedegree");
  let windText = document.querySelector("#windSpeed");
  let currentIcon = document.querySelector("#currWeather-icone");

  currTempText.innerHTML = `${currtemp}°`;
  descriptionText.innerHTML = description;
  humidityText.innerHTML = `${humidity}%`;
  feelsLikeText.innerHTML = `${feelsLike}°`;
  windText.innerHTML = `${windSpeed}<span class="unit">m/h</span>`;
  currentIcon.setAttribute("src", `image/animated/${iconNum}.svg`);

  changeCurrDate(date);
  changeProgressBar(humidity, feelsLike, windSpeed);
  messageBox(iconNum, currtemp);
  getForecast(response.data.coord);
}

/* search part */
function search(city) {
  let apiKey = "ab4448a82d0d50e0ba09f05600cb7043";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(currWeather);
}

function handleSubmit(e) {
  e.preventDefault();
  let city = document.querySelector("#searchInput").value;
  let cityHeader = document.querySelector("#city");

  if (city !== "") {
    cityHeader.innerHTML = city;
    search(city);
  }
}

/* toggle button */
function unitChange(btn) {
  let currTemp = document.querySelector("#current-degree");
  let feelsLike = document.querySelector("#feelsLikedegree");
  let nextTemps = document.querySelectorAll("#nextDegree");
  let newTemp;
  if (btn.checked) {
    //change to F°
    newTemp = Math.round(parseInt(currTemp.innerHTML) * 1.8 + 32);
    currTemp.innerHTML = `${newTemp}°`;

    newTemp = Math.round(parseInt(feelsLike.innerHTML) * 1.8 + 32);
    feelsLike.innerHTML = `${newTemp}°`;

    for (temp of nextTemps) {
      newTemp = Math.round(parseInt(temp.innerHTML) * 1.8 + 32);
      temp.innerHTML = `${newTemp}°`;
    }
  } else {
    //change to C°
    newTemp = Math.round((parseInt(currTemp.innerHTML) - 32) * (5 / 9));
    currTemp.innerHTML = `${newTemp}°`;

    newTemp = Math.round((parseInt(feelsLike.innerHTML) - 32) * (5 / 9));
    feelsLike.innerHTML = `${newTemp}°`;

    for (temp of nextTemps) {
      newTemp = Math.round((parseInt(temp.innerHTML) - 32) * (5 / 9));
      temp.innerHTML = `${newTemp}°`;
    }
  }
}

let searchBar = document.querySelector("#searchbar");
searchBar.addEventListener("submit", handleSubmit);

search("Tehran");
