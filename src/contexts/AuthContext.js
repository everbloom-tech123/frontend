// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
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
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const userProfile = await AuthService.getUserProfile();
          setUser(userProfile);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        AuthService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(email, password);
      setUser(AuthService.getCurrentUser());
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      // Force update isAuthenticated
      window.dispatchEvent(new Event('auth-change'));
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(AuthService.getCurrentUser());
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ROLE_ADMIN',
    login,
    logout,
    clearError: () => setError(null)
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