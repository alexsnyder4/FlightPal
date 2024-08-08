import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5092/api', // Your backend API URL
});

export const getUsers = () => api.get('/Users');
export const loginUser = (credentials) => api.post('/Auth/login', credentials);
export const registerUser = (userData) => {
    return axios.options('/Auth/register', userData);
  };

export default api;
