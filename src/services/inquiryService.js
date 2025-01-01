import axios from 'axios';
import config from '../config';

const API_BASE_URL = `${config.API_BASE_URL}/public/api/inquiries`;




// Utility function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred while processing your request'
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Main InquiryService class
export class InquiryService {
  /**
   * Creates a new inquiry
   * @param {Object} inquiryDTO - The inquiry data
   * @param {string} inquiryDTO.name - Name of the person making inquiry
   * @param {string} inquiryDTO.email - Email address
   * @param {string} inquiryDTO.subject - Subject of the inquiry
   * @param {string} inquiryDTO.message - Inquiry message
   * @param {string} inquiryDTO.location - Location information
   * @returns {Promise<Object>} Created inquiry
   */
  static async createInquiry(inquiryDTO) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryDTO),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating inquiry:', error);
      throw error;
    }
  }

  /**
   * Retrieves all inquiries (Admin endpoint)
   * @returns {Promise<Array>} List of all inquiries
   */
  static async getAllInquiries() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if required
          // 'Authorization': `Bearer ${token}`
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      throw error;
    }
  }

  /**
   * Responds to an inquiry (Admin endpoint)
   * @param {number} inquiryId - ID of the inquiry to respond to
   * @param {Object} responseDTO - Response data
   * @param {string} responseDTO.message - Response message
   * @returns {Promise<Object>} Updated inquiry
   */
  static async respondToInquiry(inquiryId, responseDTO) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/${inquiryId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if required
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(responseDTO),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error responding to inquiry:', error);
      throw error;
    }
  }

  /**
   * Custom error handler that can be used to process API errors
   * @param {Error} error - The error object
   * @returns {Object} Processed error object
   */
  static handleError(error) {
    return {
      message: error.message || 'An unexpected error occurred',
      status: error.status || 500,
      timestamp: new Date().toISOString(),
    };
  }
}

// Example React Hook for using the inquiry service
export const useInquiry = () => {
  const submitInquiry = async (inquiryData) => {
    try {
      return await InquiryService.createInquiry(inquiryData);
    } catch (error) {
      throw InquiryService.handleError(error);
    }
  };

  const getAllInquiries = async () => {
    try {
      return await InquiryService.getAllInquiries();
    } catch (error) {
      throw InquiryService.handleError(error);
    }
  };

  const respondToInquiry = async (inquiryId, responseData) => {
    try {
      return await InquiryService.respondToInquiry(inquiryId, responseData);
    } catch (error) {
      throw InquiryService.handleError(error);
    }
  };

  return {
    submitInquiry,
    getAllInquiries,
    respondToInquiry,
  };
};