// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ceylon-pink-200 border-t-ceylon-pink-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // Check for role-based access
  if (role) {
    // For admin routes
    if (role === 'ROLE_ADMIN' && user?.role !== 'ROLE_ADMIN') {
      return <Navigate to="/" replace />;
    }
    // Add other role checks if needed
  }

  // If all checks pass, render the protected content
  return children;
};

// Example usage in a standalone component for admin routes
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute role="ADMIN">
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;