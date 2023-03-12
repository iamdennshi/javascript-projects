const container = document.querySelector('.container');
const search = document.querySelector('.search-box');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

search.addEventListener('submit', (e) => {
    e.preventDefault();
    const APIKey = 'dd340587f1d2fc598b73df031ce84459';
    const city = document.querySelector('.search-box input').value;
    
    if (city === '')
        return;
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }
            error404.style.display = 'none';
            error404.classList.remove('fadeIn');
            const emoji = document.querySelector('.weather-box .emoji-weather');

            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            
            switch (data.weather[0].main) {
                case 'Clear': {
                    emoji.innerHTML = '☀️';
                    break;
                }
                case 'Rain': {
                    emoji.innerHTML = '🌧️';
                    break;
                }
                case 'Snow': {
                    emoji.innerHTML = '🌨️';
                    break;
                }
                default: {
                    emoji.innerHTML = '☁️';
                }
            }

            switch (data.weather[0].description) {
                case 'clear sky': {
                    description.innerHTML = 'Ясное небо';
                    break;
                }
                case 'shower rain': {
                    description.innerHTML = 'Мелкий дождь';
                    break;        
                }
                case 'rain': {
                    description.innerHTML = 'Дождь';
                    break;        
                }                
                case 'thunderstorm': {
                    description.innerHTML = 'Гроза';
                    break;        
                }                
                case 'snow': {
                    description.innerHTML = 'Снег';
                    break;        
                }                
                case 'mist': {
                    description.innerHTML = 'Туман';
                    break;        
                }
                default: {
                    description.innerHTML = `Облачно`;
                }
            }

            temperature.innerHTML = `${parseInt(data.main.temp)}<span>°C</span>`
            
            humidity.innerHTML = `${data.main.humidity}%`;
            wind.innerHTML = `${parseInt(data.wind.speed)} км/ч`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '550px';
        })
})