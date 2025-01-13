/* // src/config.js
const config = {
  //API_BASE_URL: 'https://api-zdak.onrender.com'  // Always use production API
  //API_BASE_URL: 'http://localhost:8080'
API_BASE_URL: 'https://13.49.223.21'
};

export default config; */

// src/config.js
import axios from 'axios';

// Create axios instance with SSL validation disabled for development
const axiosInstance = axios.create({
  baseURL: 'https://13.49.223.21',
  httpsAgent: {
    rejectUnauthorized: false
  }
});

const config = {
  API_BASE_URL: 'https://13.49.223.21',
  // Export the configured axios instance
  axiosInstance: axiosInstance
};

export default config;