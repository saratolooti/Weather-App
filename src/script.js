/* change Time and Date */
function changeTime(timestamp) {
  let now = new Date(timestamp);

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

  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let currClock = document.querySelector("#currClock");
  let currDate = document.querySelector("#currDate");

  currClock.innerHTML = `${("0" + now.getHours()).slice(-2)}:${(
    "0" + now.getMinutes()
  ).slice(-2)}`;
  currDate.innerHTML = `${day}, ${month} ${now.getDate()}`;
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

/* current weather */
function currWeather(response) {
  console.log(response);

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
  windText.innerHTML = `${windSpeed}<span class="unit">km/h</span>`;
  currentIcon.setAttribute("src", `image/animated/${iconNum}.svg`);

  changeTime(date);
  changeProgressBar(humidity, feelsLike, windSpeed);
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
