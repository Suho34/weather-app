import { useState, useEffect } from "react";
import Search from "./Search";

const API_KEY = "c587e916b33c41ccac404102251803"; // Replace with your WeatherAPI key
const CURRENT_URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q={city}`;
const FORECAST_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q={city}&days=7`;

function Weather() {
  const [city, setCity] = useState(null); // City name from Search
  const [weather, setWeather] = useState(null); // Current weather data
  const [location, setLocation] = useState(null); // Location data
  const [forecast, setForecast] = useState(null); // 7-day forecast data
  const [error, setError] = useState(null); // Error message
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const getWeatherData = async () => {
      if (!city) return; // Skip if no city

      setLoading(true);
      setError(null);
      setWeather(null); // Reset previous data
      setLocation(null);
      setForecast(null);

      try {
        // Fetch both APIs concurrently with Promise.all
        const [currentResponse, forecastResponse] = await Promise.all([
          fetch(CURRENT_URL.replace("{city}", city)),
          fetch(FORECAST_URL.replace("{city}", city)),
        ]);

        // Check responses
        if (!currentResponse.ok) {
          throw new Error(
            `Current weather HTTP error! Status: ${currentResponse.status}`
          );
        }
        if (!forecastResponse.ok) {
          throw new Error(
            `Forecast HTTP error! Status: ${forecastResponse.status}`
          );
        }

        // Parse JSON from both responses
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        // Check for API-specific errors
        if (currentData.error) {
          throw new Error(
            currentData.error.message || "City not found (current)"
          );
        }
        if (forecastData.error) {
          throw new Error(
            forecastData.error.message || "City not found (forecast)"
          );
        }

        // Set state with data from both APIs
        setWeather(currentData.current);
        setLocation(currentData.location); // Could use forecastData.location too
        setForecast(forecastData.forecast.forecastday);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
  }, [city]);

  // Loading state
  if (loading) {
    return (
      <div>
        <Search setCity={setCity} />
        <p>Loading weather data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Search setCity={setCity} />
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  // No data state (initial or after reset)
  if (!weather || !location || !forecast) {
    return (
      <div>
        <Search setCity={setCity} />
      </div>
    );
  }

  // Success state
  return (
    <div>
      <Search setCity={setCity} />
      <div className="weather-details">
        <h2 className="weather-header">Weather in {city}</h2>
        <p className="weather-info">Country: {location.country}</p>
        <p className="weather-info">Region: {location.region}</p>
        <p className="weather-info">Local Time: {location.localtime}</p>
        <p className="weather-info">
          Last Updated: {new Date(weather.last_updated).toLocaleTimeString()}
        </p>

        {/* Current Weather */}
        <div className="current-weather">
          <h3 className="section-title">Current Conditions</h3>
          <div className="condition">
            <p className="condition-text">
              Condition: {weather.condition.text}
            </p>
            <img
              src={`https:${weather.condition.icon}`}
              alt={weather.condition.text}
              className="weather-icon"
            />
          </div>
          <div className="weather-metrics">
            <p>
              Temperature: {weather.temp_c}°C ({weather.temp_f}°F)
            </p>
            <p>
              Feels Like: {weather.feelslike_c}°C ({weather.feelslike_f}°F)
            </p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind Speed: {weather.wind_kph} kph</p>
            <p>Pressure: {weather.pressure_mb} mb</p>
            <p>UV Index: {weather.uv}</p>
            <p>Cloud Cover: {weather.cloud}%</p>
            <p>
              Visibility: {weather.vis_km} km ({weather.vis_miles} mi)
            </p>
            <p>
              Precipitation: {weather.precip_mm} mm ({weather.precip_in} in)
            </p>
            <p>
              Wind Gust: {weather.gust_kph} kph ({weather.gust_mph} mph)
            </p>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <h3 className="section-title">7-Day Forecast</h3>
        <div className="forecast">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="forecast-day"
              style={{ "--index": index }}
            >
              <p className="forecast-date">
                Date: {new Date(day.date).toLocaleDateString()}
              </p>
              <div className="condition">
                <p className="condition-text">{day.day.condition.text}</p>
                <img
                  src={`https:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                  className="weather-icon"
                />
              </div>
              <div className="forecast-metrics">
                <p>
                  Max Temp: {day.day.maxtemp_c}°C ({day.day.maxtemp_f}°F)
                </p>
                <p>
                  Min Temp: {day.day.mintemp_c}°C ({day.day.mintemp_f}°F)
                </p>
                <p>Avg Humidity: {day.day.avghumidity}%</p>
                <p>Total Precipitation: {day.day.totalprecip_mm} mm</p>
                <p>Chance of Rain: {day.day.daily_chance_of_rain}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Weather;
