// src/utils/TokenManager.js
import { jwtDecode } from 'jwt-decode';

class TokenManager {
  constructor() {
    this.checkInterval = null;
    this.tokenKey = 'token';
    this.userKey = 'user';
    this.roleKey = 'userRole';
  }

  startTokenCheck(logoutCallback) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      if (this.isTokenExpired()) {
        console.log('Token expired during interval check');
        this.clearSession();
        logoutCallback();
      }
    }, 30000);
  }

  stopTokenCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  setToken(token) {
    try {
      localStorage.setItem(this.tokenKey, token);
      const decoded = jwtDecode(token);
      localStorage.setItem('tokenExp', decoded.exp);
    } catch (error) {
      console.error('Error setting token:', error);
      this.clearSession();
    }
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(user) {
    try {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
    }
  }

  getUser() {
    try {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  setRole(role) {
    try {
      localStorage.setItem(this.roleKey, role);
    } catch (error) {
      console.error('Error setting role:', error);
    }
  }

  getRole() {
    return localStorage.getItem(this.roleKey);
  }

  isTokenExpired() {
    try {
      const token = this.getToken();
      if (!token) return true;

      const expTime = localStorage.getItem('tokenExp');
      if (!expTime) {
        const decoded = jwtDecode(token);
        return Date.now() >= decoded.exp * 1000;
      }

      return Date.now() >= (expTime * 1000) - 10000;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  clearSession() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem('tokenExp');
  }

  getTokenRemainingTime() {
    try {
      const expTime = localStorage.getItem('tokenExp');
      if (!expTime) return 0;
      
      const remaining = (expTime * 1000) - Date.now();
      return Math.max(0, Math.floor(remaining / 1000));
    } catch (error) {
      console.error('Error getting remaining time:', error);
      return 0;
    }
  }

  isAuthenticated() {
    return !this.isTokenExpired() && this.getUser() !== null;
  }
}

export const tokenManager = new TokenManager();

// Setup axios interceptors helper
export const setupAxiosInterceptors = (axios, logoutCallback) => {
  axios.interceptors.request.use(
    (config) => {
      const token = tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        tokenManager.clearSession();
        logoutCallback();
      }
      return Promise.reject(error);
    }
  );
};