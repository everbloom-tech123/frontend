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

const formatUserData = (userData) => {
  if (!userData) return null;
  
  return {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    username: userData.username,
    // Add any other necessary user fields
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = AuthService.getCurrentUser();
    return formatUserData(storedUser);
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const userProfile = await AuthService.getUserProfile();
          const formattedUser = formatUserData(userProfile);
          setUser(formattedUser);
          
          // Add validation logging
          console.group('Auth Initialization');
          console.log('Formatted User Data:', formattedUser);
          console.log('Auth Token:', AuthService.getToken());
          console.log('User Role:', formattedUser?.role);
          console.groupEnd();
        } else {
          setUser(null);
          console.log('No authenticated user found');
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
      const formattedUser = formatUserData(response);
      setUser(formattedUser);
      
      // Add validation logging
      console.group('Login Success');
      console.log('Formatted User Data:', formattedUser);
      console.log('Auth Token:', AuthService.getToken());
      console.groupEnd();
      
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
    clearError: () => setError(null),
    // Add a new method to get formatted user data
    getUserData: () => formatUserData(user)
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