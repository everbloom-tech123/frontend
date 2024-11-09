// src/config.js
const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production'
      ? 'http://3.83.93.102:8080'  // Replace with your production backend URL when deployed
      : 'http://localhost:8080'
  };
  
  export default config;