const apiKey = '4df5fbdbd837f4422d1503d0df861d8f';
const url = "https://api.openweathermap.org/data/2.5/forecast";




const updateForecast = (searchQuery) => {
    fetch(`${url}?q=${searchQuery}&appid=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const cityName = data?.city?.name;
    const forecastList = data.list;

    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; 

    const today = new Date();
    const currentDateString = today.toISOString();
    
    let currentDayForecast;

    forecastList.forEach(forecast => {
      const date = forecast.dt_txt.split(' ')[0];
      const time = getTime(forecast?.dt);
      
      if (date === currentDateString) {
        currentDayForecast = forecast;
      } else {
        const dayInWeek = getDayOfWeek(forecast.dt);
        const formattedDate = getFormattedDate(forecast.dt);

        const forecastItem = createForecastItem(cityName, dayInWeek, formattedDate, forecast, time);
        forecastContainer.appendChild(forecastItem); 
      }
    });

    if (currentDayForecast) {
      const dayInWeek = getDayOfWeek(currentDayForecast.dt);
      const formattedDate = getFormattedDate(currentDayForecast.dt);
      
      const forecastItem = createForecastItem(cityName, dayInWeek, formattedDate, currentDayForecast, time);
      forecastContainer.insertBefore(forecastItem, forecastContainer.firstChild);
    }
  })
  .catch(error => {
    console.log('Error:', error);
    const forecastContainer = document.getElementById('forecast-container');
    const errorMessage = error.response?.message || 'City Not Found';
    forecastContainer.innerHTML = `<div class="error">${errorMessage}</div>`;
  });
};
updateForecast('Kathmandu');
const form = document.querySelector('.find-location');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('input[type="text"]');
    const searchQuery = searchInput.value;
    updateForecast(searchQuery);
});




const createForecastItem = (cityName, dayInWeek, formattedDate, forecast, time) => {
  const forecastItem = document.createElement('div');
  forecastItem.classList.add('col-auto');
  forecastItem.innerHTML = `
    <div class="forecast">
      <div class="forecast-header">
        <div class="day">${dayInWeek}</div>
        <div class="date">${formattedDate}</div>
      </div>
      <div class="forecast-content">
        <div class="location">${cityName}</div>
        <div class="degree">
          <div class="num">${kelvinToDegree(forecast?.main?.temp)}<sup>o</sup>C</div>
          <div class="forecast-icon">
            <img src="images/icons/icon-1.svg" alt="" width="90">
          </div>	
        </div>
        <span><img src="images/icon-umberella.png" alt="">${(forecast?.pop * 100).toFixed(2)}%</span>
        <span>Time: ${time}</span>
      </div>
    </div>
  `;

  return forecastItem;
};


const getDayOfWeek = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = {
    weekday: 'long'
  };
  const dayOfWeek = date.toLocaleString('en-US', options);
  return dayOfWeek;
};
const getTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;
    return formattedTime;
};

const getFormattedDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = {
    month: 'short',
    day: 'numeric'
  };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
};

const kelvinToDegree = (temperatureKelvin) => {
  const temperatureCelsius = temperatureKelvin - 273.15;
  return temperatureCelsius.toFixed(2);
};
