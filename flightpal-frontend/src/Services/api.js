import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5092/api', // Your backend API URL
});

export default api;
