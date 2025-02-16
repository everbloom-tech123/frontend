// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { tokenManager } from '../utils/TokenManager';
import * as AuthService from '../services/AuthService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => tokenManager.getUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = async () => {
    try {
      tokenManager.clearSession();
      tokenManager.stopTokenCheck();
      setUser(null);
      window.dispatchEvent(new Event('auth-change'));
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Initialize auth state and start token check
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (tokenManager.isAuthenticated()) {
          const userProfile = await AuthService.getUserProfile();
          setUser(userProfile);
          
          // Start token expiration check
          tokenManager.startTokenCheck(logout);
          
          console.group('Auth Initialization');
          console.log('User Profile:', userProfile);
          console.log('Token Valid:', !tokenManager.isTokenExpired());
          console.log('Token Remaining Time:', tokenManager.getTokenRemainingTime());
          console.groupEnd();
        } else {
          setUser(null);
          console.log('No authenticated user found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      tokenManager.stopTokenCheck();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(email, password);
      
      // Store auth data using token manager
      tokenManager.setToken(response.token);
      tokenManager.setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role
      });
      tokenManager.setRole(response.role);
      
      // Start token expiration check
      tokenManager.startTokenCheck(logout);
      
      setUser(tokenManager.getUser());
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: tokenManager.isAuthenticated(),
    isAdmin: user?.role === 'ROLE_ADMIN',
    login,
    logout,
    clearError: () => setError(null),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ceylon-pink-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;