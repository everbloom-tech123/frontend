import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/auth`;


/* const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://3.83.93.102.nip.io/auth'  // This will be your deployed backend URL
  : 'http://localhost:8080/auth'; */

export const register = async (username, email, password) => {
  try {
    const response = await config.axiosInstance.post(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred during registration');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    console.log('Attempting login with:', { email, password });
    
    const response = await config.axiosInstance.post(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred during login');
    }

    const data = await response.json();
    console.log('Login response data:', data);

    // Store token
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    // Store user data
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role
    };
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Store role
    if (data.role) {
      localStorage.setItem('userRole', data.role);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getUserRole = () => {
  try {
    return localStorage.getItem('userRole');
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();
    return !!(token && user);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const verifyEmail = async (email, verificationCode) => {
  try {
    const response = await config.axiosInstance.post(`${API_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, verificationCode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Email verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};

export const resendVerificationCode = async (email) => {
  try {
    const response = await config.axiosInstance.post(`${API_URL}/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to resend verification code');
    }

    return await response.json();
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
    });

    if (!response.ok) {
      removeToken();
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    setToken(data.token);
    return data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const storedUser = getCurrentUser();
    if (storedUser) {
      return storedUser;
    }

    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }

    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/reset-password-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to request password reset');
    }

    return await response.json();
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password');
    }

    return await response.json();
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};