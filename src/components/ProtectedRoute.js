// src/components/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tokenManager } from '../utils/TokenManager';

export const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Combined useEffect for all token checks
  useEffect(() => {
    const handleTokenExpired = () => {
      console.log('Token expired, logging out...');
      logout();
      navigate('/signin', { 
        state: { from: location.pathname },
        replace: true 
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && tokenManager.isTokenExpired()) {
        console.log('Token expired on tab focus');
        handleTokenExpired();
      }
    };

    if (isAuthenticated) {
      tokenManager.startTokenCheck(handleTokenExpired);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      tokenManager.stopTokenCheck();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, logout, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ceylon-pink-200 border-t-ceylon-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || tokenManager.isTokenExpired()) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  if (role === 'ROLE_ADMIN' && user?.role !== 'ROLE_ADMIN') {
    console.log('User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute role="ROLE_ADMIN">
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;