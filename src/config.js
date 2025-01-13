/* // src/config.js
const config = {
  //API_BASE_URL: 'https://api-zdak.onrender.com'  // Always use production API
  //API_BASE_URL: 'http://localhost:8080'
API_BASE_URL: 'https://13.49.223.21'
};

export default config; */

// src/config.js
import axios from 'axios';

// Create an axios instance that ignores SSL certificate issues
const axiosInstance = axios.create({
    baseURL: 'http://13.49.223.21',
    validateStatus: () => true,  // Accept all status codes
    httpsAgent: {
        rejectUnauthorized: false // This is the key part that makes it work with self-signed certificates
    }
});

const config = {
    API_BASE_URL: 'http://13.49.223.21',
    axiosInstance: axiosInstance
};

export default config;