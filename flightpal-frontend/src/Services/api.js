import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.API_URL}`, // Backend API URL
});


// Fetch today's weather by zip code from the backend or third-party API
export const getTodayWeather = (zipCode, apiKey) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
    params: {
      zip: zipCode,
      appid: apiKey, // Passing the API key
      units: 'metric', 
    },
  });
};

// Fetch weekly forecast from OpenWeatherMap
export const getWeeklyForecast = (lat, lon, apiKey) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
    params: {
      lat,
      lon,
      appid: apiKey, // Passing the API key
      units: 'metric',
    },
  });
};

export const getUsers = () => api.get('/Users');
export const loginUser = (credentials) => api.post('/Auth/login', credentials);
export const registerUser = (userData) => api.post('/Auth/register', userData);
export const getUserById = (userId) => api.get(`/Users/${userId}`); // Added this function for fetching user by ID
export const getFlightsByUserId = (userId) => api.get(`/Flights/User/${userId}`);
export const addFlight = (flightInfo) => api.post('/Flights', flightInfo); // Adds flight to user
export const deleteFlightByFlightId = (flightId) => api.delete(`/Flights/${flightId}`);
export const checkAircraftExists = (aircraftModel) => {                   // Checks Aircraft table for Model 
  return api.get(`/Aircraft/model`, { params: { modelName: aircraftModel } });
};
export const addAircraftToUser = (userId, aircraftDetails) => api.post(`/Users/${userId}/aircraft`, aircraftDetails);
export const deleteAircraftByAircraftId = (userId, aircraftId) => api.delete(`/Users/${userId}/${aircraftId}`);
export const getUserAircraft = (userId) => api.get(`/Users/${userId}/aircraft`);

export default api;
