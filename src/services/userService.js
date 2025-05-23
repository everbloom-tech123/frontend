import axios from 'axios';
import config from '../config';
import { tokenManager } from '../utils/TokenManager';

const API_URL = `${config.API_BASE_URL}/api/v1/users`;

/* const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://3.83.93.102.nip.io/api/v1/users'
  : 'http://localhost:8080/api/v1/users'; */

  export const getCurrentUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          tokenManager.clearSession(); // Now tokenManager is defined
          window.dispatchEvent(new CustomEvent('auth-update'));
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(errorData.message || 'Failed to fetch user profile');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Get current user profile error:', error);
      throw error;
    }
  };

export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

export const changeUserRole = async (userId, newRole) => {
  try {
    const token = localStorage.getItem('token');
    // Ensure role format is correct (remove ROLE_ if present)
    const roleToSend = newRole.replace('ROLE_', '');
    
    const response = await fetch(`${API_URL}/admin/change-role?userId=${userId}&newRole=${roleToSend}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change user role');
    }

    return await response.json();
  } catch (error) {
    console.error('Change user role error:', error);
    throw error;
  }
};

export const getClientDashboard = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/client/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch client dashboard');
    }

    return await response.json();
  } catch (error) {
    console.error('Get client dashboard error:', error);
    throw error;
  }
};

export const getCustomerProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/customer/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch customer profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Get customer profile error:', error);
    throw error;
  }
};

// Role check utilities
export const hasRole = (user, role) => {
  const roleToCheck = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
  return user?.roles?.includes(roleToCheck) || false;
};

export const isAdmin = (user) => {
  return hasRole(user, 'ROLE_ADMIN');
};

export const isUser = (user) => {
  return hasRole(user, 'ROLE_USER');
};