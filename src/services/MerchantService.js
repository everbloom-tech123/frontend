import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/api/merchants`;

/* const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://3.83.93.102.nip.io/api/merchants'
  : 'http://localhost:8080/api/merchants'; */

export const getAllMerchants = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch merchants');
    }

    return await response.json();
  } catch (error) {
    console.error('Get all merchants error:', error);
    throw error;
  }
};

export const getMerchantById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch merchant');
    }

    return await response.json();
  } catch (error) {
    console.error(`Get merchant with id ${id} error:`, error);
    throw error;
  }
};

export const createMerchant = async (merchantData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(merchantData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create merchant');
    }

    return await response.json();
  } catch (error) {
    console.error('Create merchant error:', error);
    throw error;
  }
};

export const updateMerchant = async (id, merchantData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(merchantData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update merchant');
    }

    return await response.json();
  } catch (error) {
    console.error(`Update merchant with id ${id} error:`, error);
    throw error;
  }
};

export const deleteMerchant = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete merchant');
    }

    return true; // Return true if deletion was successful
  } catch (error) {
    console.error(`Delete merchant with id ${id} error:`, error);
    throw error;
  }
};

// Helper function to check if user can manage merchants (admin-only)
export const canManageMerchants = (user) => {
  return user?.roles?.includes('ROLE_ADMIN') || false;
};