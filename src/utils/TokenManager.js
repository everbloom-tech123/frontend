// src/utils/TokenManager.js
import { jwtDecode } from 'jwt-decode'; // Changed from import jwtDecode from 'jwt-decode'

export const tokenManager = {
  tokenCheckInterval: null,
  
  setToken: (token) => {
    localStorage.setItem('token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  },
  
  getUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  },
  
  setRole: (role) => {
    localStorage.setItem('userRole', role);
  },
  
  getRole: () => {
    return localStorage.getItem('userRole');
  },
  
  clearSession: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  },
  
  isTokenExpired: () => {
    const token = tokenManager.getToken();
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (e) {
      console.error('Error decoding token:', e);
      return true;
    }
  },
  
  isAuthenticated: () => {
    return !!tokenManager.getToken() && !!tokenManager.getUser() && !tokenManager.isTokenExpired();
  },
  
  startTokenCheck: (onExpired) => {
    // Clear any existing interval first
    tokenManager.stopTokenCheck();
    
    // Check every minute
    tokenManager.tokenCheckInterval = setInterval(() => {
      if (tokenManager.isTokenExpired()) {
        console.log('Token check: token expired');
        tokenManager.stopTokenCheck();
        if (onExpired) onExpired();
      }
    }, 60000);
  },
  
  stopTokenCheck: () => {
    if (tokenManager.tokenCheckInterval) {
      clearInterval(tokenManager.tokenCheckInterval);
      tokenManager.tokenCheckInterval = null;
    }
  }
};

export default tokenManager;