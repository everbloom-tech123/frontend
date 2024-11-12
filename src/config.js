// src/config.js
const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production'
      ? 'https://3.83.93.102.nip.io'  // Replace with your production backend URL when deployed
      : 'http://localhost:8080'
  };
  
  export default config;