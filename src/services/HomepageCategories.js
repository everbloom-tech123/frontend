import axios from 'axios';
import config from '../config';

/**
 * Service class for handling all homepage category-related API operations.
 * This service interfaces with the Spring Boot backend endpoints for managing 
 * which categories appear on the homepage.
 */
class HomepageCategoryService {
  // Base URL for all homepage category operations
  static API_BASE_URL = `${config.API_BASE_URL}/public/api/homepage-categories`;

  /**
   * Fetches all homepage categories (both active and inactive)
   * @returns {Promise<Array>} Array of all homepage category objects
   */
  static async getAllHomepageCategories() {
    try {
      console.log('Fetching all homepage categories from:', this.API_BASE_URL);
      const response = await axios.get(this.API_BASE_URL);
      console.log('Homepage categories fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching homepage categories:', error);
      console.error('Error details:', error.response?.data);
      // Return empty array instead of throwing to prevent UI breaks
      return [];
    }
  }

  /**
   * Fetches only active homepage categories
   * These are the categories that should be displayed on the public homepage
   * @returns {Promise<Array>} Array of active homepage category objects
   */
  static async getActiveHomepageCategories() {
    try {
      console.log('Fetching active homepage categories from:', `${this.API_BASE_URL}/active`);
      const response = await axios.get(`${this.API_BASE_URL}/active`);
      console.log('Active homepage categories fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching active homepage categories:', error);
      console.error('Error details:', error.response?.data);
      // Return empty array instead of throwing to prevent UI breaks
      return [];
    }
  }

  /**
   * Fetches a specific homepage category by ID
   * @param {number} id - The ID of the homepage category to fetch
   * @returns {Promise<Object>} Homepage category object
   */
  static async getHomepageCategoryById(id) {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/${id}`);
      console.log('Homepage category fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching homepage category:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Adds a category to the homepage
   * @param {number} categoryId - ID of the category to add to homepage
   * @returns {Promise<Object>} The created homepage category object
   */
  static async addCategoryToHomepage(categoryId) {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/add/${categoryId}`);
      console.log('Category added to homepage successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding category to homepage:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Adds multiple categories to the homepage at once
   * @param {Array<number>} categoryIds - Array of category IDs to add to homepage
   * @returns {Promise<Array>} Array of all homepage categories after the operation
   */
  static async addMultipleCategoriesToHomepage(categoryIds) {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/add-multiple`, categoryIds);
      console.log('Multiple categories added to homepage successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding multiple categories to homepage:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Updates a homepage category (activate/deactivate or change display order)
   * @param {number} id - Homepage category ID
   * @param {Object} updateData - Object containing properties to update
   * @param {boolean} [updateData.isActive] - Whether the category should be active on the homepage
   * @param {number} [updateData.displayOrder] - Position in the display order
   * @returns {Promise<Object>} Updated homepage category object
   */
  static async updateHomepageCategory(id, updateData) {
    try {
      const response = await axios.put(`${this.API_BASE_URL}/${id}`, updateData);
      console.log('Homepage category updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating homepage category:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Updates the display order of multiple homepage categories at once
   * @param {Array<Object>} orderUpdates - Array of objects with id and displayOrder
   * @returns {Promise<Array>} Updated array of homepage categories
   */
  static async updateHomepageCategoriesOrder(orderUpdates) {
    try {
      const response = await axios.put(`${this.API_BASE_URL}/update-order`, orderUpdates);
      console.log('Homepage categories order updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating homepage categories order:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Removes a category from the homepage
   * @param {number} id - Homepage category ID to remove
   * @returns {Promise<void>}
   */
  static async removeFromHomepage(id) {
    try {
      await axios.delete(`${this.API_BASE_URL}/${id}`);
      console.log('Category removed from homepage successfully:', id);
    } catch (error) {
      console.error('Error removing category from homepage:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Helper method to format error responses consistently
   * @private
   * @param {Error} error - The caught error object
   * @returns {Error} Formatted error object
   */
  static formatError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An unexpected error occurred';
      const formattedError = new Error(message);
      formattedError.status = error.response.status;
      formattedError.data = error.response.data;
      return formattedError;
    }
    if (error.request) {
      // Request was made but no response received
      return new Error('No response received from server');
    }
    // Something else went wrong
    return new Error('An error occurred while setting up the request');
  }
}

export default HomepageCategoryService;