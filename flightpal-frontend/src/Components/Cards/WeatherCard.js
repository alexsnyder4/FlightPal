import React, { useState, useEffect, useCallback} from 'react';
import { getTodayWeather, getWeeklyForecast } from '../../Services/api';
import '../CSS/Card.css';

const WeatherCard = () => {
  const [zipCode, setZipCode] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState(null);
  const [currentTab, setCurrentTab] = useState('today'); // Track current tab
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [layer, setLayer] = useState('precipitation_new'); // Default layer set to 'precipitation'

  const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Initialize the map with OpenWeatherMap overlay
const initMap = useCallback(
  (coord) => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: coord.lat, lng: coord.lon },
      zoom: 10,
    });

    // Add the OpenWeatherMap layer
    const weatherLayer = new window.google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        return `https://tile.openweathermap.org/map/${layer}/${zoom}/${coord.x}/${coord.y}.png?appid=${WEATHER_API_KEY}`;
      },
      tileSize: new window.google.maps.Size(256, 256),
      opacity: 0.99,
      name: 'OpenWeatherMap',
    });

    // Add the weather layer on top of the map
    map.overlayMapTypes.insertAt(0, weatherLayer);
  },
  [layer, WEATHER_API_KEY] // Dependencies for initMap
);
  // Function to load Google Maps script dynamically
  const loadGoogleMapsScript = useCallback(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
  
      script.onload = () => {
        if (location) {
          initMap(location); // Initialize the map once the script is loaded
        }
      };
    } else {
      initMap(location); // Google Maps is already loaded, initialize the map
    }
  }, [GOOGLE_MAPS_API_KEY, initMap, location]);

  // Handle zip code submission
  const handleZipCodeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Fetch today's weather
      const todayWeatherResponse = await getTodayWeather(zipCode, WEATHER_API_KEY);
      setWeatherData(todayWeatherResponse.data);

      // Fetch weekly forecast using latitude and longitude from today's weather
      const coord = todayWeatherResponse.data.coord;
      setLocation(coord); // Correctly set location

      const weeklyForecastResponse = await getWeeklyForecast(coord.lat, coord.lon, WEATHER_API_KEY);
      setWeeklyForecast(weeklyForecastResponse.data);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location && currentTab === 'radar') {
      loadGoogleMapsScript(); // Load the Google Maps script and initialize the map
    }
  }, [location, layer, currentTab, loadGoogleMapsScript]);

  // Render different tabs
  const renderTabContent = () => {
    if (currentTab === 'today' && weatherData) {
      return (
        <div>
          <h4>Today's Conditions</h4>
          <p>Temperature: {weatherData.main.temp}°F</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      );
    } else if (currentTab === 'radar' && location) {
      return (
        <div>
          <h4>Radar Map</h4>
          {/* Dropdown for weather layer selection */}
          <select value={layer} onChange={(e) => setLayer(e.target.value)}>
            <option value="precipitation_new">Precipitation</option>
            <option value="clouds_new">Clouds</option>
            <option value="temp_new">Temperature</option>
            <option value="wind_new">Wind</option>
          </select>
          <div className='map' id="map" style={{ width: '100%', height: '400px' }}></div>
        </div>
      );
    } else if (currentTab === 'weekly' && weeklyForecast) {
      return (
        <div>
          <h4>Weekly Forecast</h4>
          {weeklyForecast.list.map((forecast, index) => (
            <div key={index}>
              <p>{new Date(forecast.dt_txt).toLocaleString()}: Temp - {forecast.main.temp}°F, Weather - {forecast.weather[0].description}</p>
            </div>
          ))}
        </div>
      );
    }
    return <p>Please enter a valid zip code to see the weather data.</p>;
  };

  // Determine the CSS class for the card based on whether the form is rendered
  const cardClass = !weatherData ? 'weather-card-zip-form' : 'weather-card';

  return (
    <div className={`card card-large ${cardClass} ${!weatherData}`}>
      {!weatherData ? (
        <form onSubmit={handleZipCodeSubmit}>
          <h3>Enter Zip Code</h3>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Zip Code"
            required
          />
          <button className="button--submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <div>
          <div className="tabs">
            <button onClick={() => setCurrentTab('today')} className={currentTab === 'today' ? 'active' : ''}>Today's Conditions</button>
            <button onClick={() => setCurrentTab('radar')} className={currentTab === 'radar' ? 'active' : ''}>Radar</button>
            <button onClick={() => setCurrentTab('weekly')} className={currentTab === 'weekly' ? 'active' : ''}>Weekly Forecast</button>
          </div>
          <div className="tab-content">{renderTabContent()}</div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
