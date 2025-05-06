// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Add useNavigate
import { tokenManager } from '../utils/TokenManager';
import * as AuthService from '../services/AuthService';
import { GlobalStateManager, AUTH_STATE_CHANGED } from '../utils/GlobalStateManager';

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
  clearError: () => {},
  syncAuthState: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Add navigate hook

  const syncAuthState = () => {
    console.log('Syncing auth state...');
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      let userData = null;
      
      try {
        userData = userStr ? JSON.parse(userStr) : null;
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
      }
      
      const isTokenValid = token && !tokenManager.isTokenExpired();
      console.log('Sync check:', { 
        token: token ? '[PRESENT]' : null, 
        userData, 
        isTokenValid,
        tokenExpired: token ? tokenManager.isTokenExpired() : null
      });

      if (isTokenValid && userData) {
        setUser(userData);
        setIsAuthenticated(true);
        tokenManager.startTokenCheck(() => {
          console.log('Token expired, logging out');
          handleLogout();
        });
        console.log('Auth synced - User authenticated:', userData);
      } else {
        if (!isTokenValid && token) {
          console.log('Auth sync - Token invalid or expired');
          handleLogout(); // Call logout if token is invalid/expired
        }
        if (!userData && userStr) {
          console.log('Auth sync - User data invalid');
        }
        setUser(null);
        setIsAuthenticated(false);
        tokenManager.stopTokenCheck();
        console.log('Auth cleared: no valid token or user');
      }
    } catch (err) {
      console.error('Error syncing auth state:', err);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    syncAuthState();
    setLoading(false);

    const handleAuthUpdate = () => {
      console.log('Auth update event received');
      syncAuthState();
    };

    window.addEventListener('auth-update', handleAuthUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'token' || e.key === 'user') {
        console.log('Storage event:', e.key);
        syncAuthState();
      }
    });

    const unsubscribe = GlobalStateManager.subscribe(AUTH_STATE_CHANGED, () => {
      console.log('GlobalStateManager auth update received');
      syncAuthState();
    });

    return () => {
      window.removeEventListener('auth-update', handleAuthUpdate);
      window.removeEventListener('storage', () => {});
      tokenManager.stopTokenCheck();
      unsubscribe();
    };
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(email, password);
      
      const userData = {
        id: response.id || 'unknown',
        username: response.username || response.sub || email.split('@')[0],
        email: response.email || email,
        role: response.role || 'ROLE_USER',
      };
      
      tokenManager.setToken(response.token);
      tokenManager.setUser(userData);
      tokenManager.setRole(response.role || 'ROLE_USER');
      
      tokenManager.startTokenCheck(() => {
        console.log('Token expired, logging out');
        handleLogout();
      });
      
      setUser(userData);
      setIsAuthenticated(true);
      
      window.dispatchEvent(new CustomEvent('auth-state-changed', { 
        detail: { user: userData, isAuthenticated: true } 
      }));
      window.dispatchEvent(new CustomEvent('auth-update'));
      GlobalStateManager.update(AUTH_STATE_CHANGED, {
        isAuthenticated: true,
        user: userData
      });
      
      setLoading(false);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const handleLogout = () => {
    try {
      tokenManager.clearSession();
      tokenManager.stopTokenCheck();
      setUser(null);
      setIsAuthenticated(false);
      
      window.dispatchEvent(new CustomEvent('auth-state-changed', { 
        detail: { user: null, isAuthenticated: false } 
      }));
      window.dispatchEvent(new CustomEvent('auth-update'));
      GlobalStateManager.update(AUTH_STATE_CHANGED, {
        isAuthenticated: false,
        user: null
      });

      // Redirect to login page
      navigate('/signin', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin: user?.role === 'ROLE_ADMIN',
    login: handleLogin,
    logout: handleLogout,
    clearError: () => setError(null),
    syncAuthState,
  }), [user, loading, error, isAuthenticated]);

  if (loading && !user && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;