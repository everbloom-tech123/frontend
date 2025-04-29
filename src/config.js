const config = {
 //API_BASE_URL: 'https://api-n0ae.onrender.com'  // Always use production API
 //API_BASE_URL: 'http://localhost:8080'
API_BASE_URL: 'https://api.ceylonnow.com/backend'
};

export default config;

// src/config.js
/* import axios from 'axios';

// Create an axios instance that ignores SSL certificate issues
const axiosInstance = axios.create({
    baseURL: 'https://api-zdak.onrender.com',
    validateStatus: () => true,  // Accept all status codes
    httpsAgent: {
        rejectUnauthorized: false // This is the key part that makes it work with self-signed certificates
    }
});

const config = {
    API_BASE_URL: 'https://api-zdak.onrender.com',
    axiosInstance: axiosInstance
};
export default config; */
