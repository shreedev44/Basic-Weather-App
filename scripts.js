async function fetchWeather(city){
  let response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=c027ddd7602b4133ab173706240407&q=${city}`,
    {
      method: "GET",
    }
  );
  let data = await response.json();
  return data.current;
}

async function fetchCountries(){
  let response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/positions",
    {
      method: "GET",
    }
  )
  const data = await response.json();
  return data.data;
}

async function fetchStates(country){
  let response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/states",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: country,
      })
    }
  )
  const data = await response.json();
  return data.data.states;
}

async function fetchCities(country, state){
  let response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/state/cities",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: country,
        state: state
      })
    }
  );
  let data = await response.json();
  return data.data
}

const countrySelecter = document.getElementById("select-country");
const stateSelecter = document.getElementById("select-state");
const citySelecter = document.getElementById("select-city");



document.addEventListener("DOMContentLoaded", async () => {
  const degreeCel = document.getElementById("degree-celcius");
  const feelsLike = document.getElementById("feels-like");
  const degreeText = document.getElementById("degree-text");
  const wind = document.getElementById('wind');
  const humidity = document.getElementById("humidity");
  const dewPoint = document.getElementById("dew-point");
  const pressure = document.getElementById('pressure');
  const image = document.getElementById('image');

  const countries = await fetchCountries();
  countries.forEach((country) => {
    let optionElem = `<option value="${country.name}">${country.name}</option>`;
    countrySelecter.innerHTML += optionElem;
  });
  const states = await fetchStates(countries[0].name);
  states.forEach((state) => {
    let optionElem = `<option value="${state.name}">${state.name}</option>`;
    stateSelecter.innerHTML += optionElem;
  });
  const cities = await fetchCities(countries[0].name, states[0].name);
  cities.forEach((city) => {
    let optionElem = `<option value="${city}">${city}</option>`;
    citySelecter.innerHTML += optionElem;
  })
})
countrySelecter.addEventListener('change', async () => {
  while (stateSelecter.firstChild) {
    stateSelecter.removeChild(stateSelecter.firstChild);
  }
  while (citySelecter.firstChild) {
    citySelecter.removeChild(citySelecter.firstChild);
  }
  const states = await fetchStates(countrySelecter.value);
  states.forEach((state) => {
    let optionElem = `<option value="${state.name}">${state.name}</option>`;
    stateSelecter.innerHTML += optionElem;
  });
  const cities = await fetchCities(countrySelecter.value, states[0].name);
  cities.forEach((city) => {
    let optionElem = `<option value="${city}">${city}</option>`;
    citySelecter.innerHTML += optionElem;
  })
});
stateSelecter.addEventListener('change', async () => {
  while (citySelecter.firstChild) {
    citySelecter.removeChild(citySelecter.firstChild);
  }
  const cities = await fetchCities(countrySelecter.value, stateSelecter.value);
  cities.forEach((city) => {
    let optionElem = `<option value="${city}">${city}</option>`;
    citySelecter.innerHTML += optionElem;
  })
});

citySelecter.addEventListener('change', async () => {
  const degreeCel = document.getElementById("degree-celcius");
  const feelsLike = document.getElementById("feels-like");
  const degreeText = document.getElementById("degree-text");
  const wind = document.getElementById('wind');
  const humidity = document.getElementById("humidity");
  const dewPoint = document.getElementById("dew-point");
  const pressure = document.getElementById('pressure');
  const image = document.getElementById('image');

  const weather = await fetchWeather(citySelecter.value);
  degreeCel.innerHTML = weather.temp_c + "℃";
  feelsLike.innerHTML = weather.feelslike_c;
  degreeText.innerHTML = weather.condition.text;
  wind.innerHTML = weather.wind_kph;
  humidity.innerHTML = weather.humidity;
  dewPoint.innerHTML = weather.dewpoint_c;
  pressure.innerHTML = weather.pressure_mb;
  const imageElem = `<img src="http:${weather.condition.icon}" alt="image">`;
  image.innerHTML = imageElem;
})

var options = {
  type: ['(cities)']
}