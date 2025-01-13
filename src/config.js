/* // src/config.js
const config = {
  //API_BASE_URL: 'https://api-zdak.onrender.com'  // Always use production API
  //API_BASE_URL: 'http://localhost:8080'
API_BASE_URL: 'https://13.49.223.21'
};

export default config; */

// src/config.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://13.49.223.21',
  httpsAgent: {
    rejectUnauthorized: false
  }
});

const config = {
  API_BASE_URL: 'https://13.49.223.21',
  axiosInstance
};

export default config;