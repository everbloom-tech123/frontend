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

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleError = (error) => {
    setError(error.message || 'An error occurred');
    setLoading(false);
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(email, password);
      setUser(AuthService.getCurrentUser());
      return response;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(username, email, password);
      return response;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      AuthService.logout();
      setUser(null);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, verificationCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.verifyEmail(email, verificationCode);
      return response;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.resendVerificationCode(email);
      return response;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await AuthService.updateUserProfile(profileData);
      setUser(updatedProfile);
      return updatedProfile;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.requestPasswordReset(email);
      return response;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.resetPassword(token, newPassword);
      return response;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Automatically refresh token before it expires
  useEffect(() => {
    if (!user) return;

    const refreshTokenInterval = setInterval(async () => {
      try {
        await AuthService.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        logout();
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes (assuming 15-minute token lifetime)

    return () => clearInterval(refreshTokenInterval);
  }, [user]);

  // Create the auth value object
  const value = {
    user,
    loading,
    error,
    isAuthenticated: AuthService.isAuthenticated(),
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationCode,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    getToken: AuthService.getToken,
    clearError: () => setError(null)
  };

  // Wait for initial authentication check
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