import axios from 'axios';
import config from '../config';

/**
 * Service class for handling all navbar category-related API operations.
 * This service interfaces with the Spring Boot backend endpoints under /api/admin/navbar/categories and /public/api/navbar/categories
 */
class NavbarCategoryService {
  // Base URL for public navbar category endpoint
  static PUBLIC_API_URL = `${config.API_BASE_URL}/public/api/navbar/categories`;
  
  // Base URL for admin navbar category management
  static ADMIN_API_URL = `${config.API_BASE_URL}/api/admin/navbar/categories`;

  /**
   * Fetches active categories displayed in the navbar (public endpoint)
   * @returns {Promise<Array>} Array of category objects
   */
  static async getNavbarCategories() {
    try {
      console.log('Fetching navbar categories from:', this.PUBLIC_API_URL);
      const response = await axios.get(this.PUBLIC_API_URL);
      console.log('Navbar categories fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching navbar categories:', error);
      console.error('Error details:', error.response?.data);
      // Return empty array instead of throwing to prevent UI breaks
      return [];
    }
  }

  /**
   * Fetches all navbar categories (admin endpoint)
   * @returns {Promise<Array>} Array of navbar category objects with status info
   */
  static async getAllNavbarCategories() {
    try {
      console.log('Fetching all navbar categories from:', this.ADMIN_API_URL);
      const token = localStorage.getItem('token');
      const response = await axios.get(this.ADMIN_API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('All navbar categories fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all navbar categories:', error);
      console.error('Error details:', error.response?.data);
      throw this.formatError(error);
    }
  }

  /**
   * Adds a category to the navbar
   * @param {number} categoryId - ID of the category to add
   * @param {number} displayOrder - Optional display order (position in navbar)
   * @returns {Promise<Object>} Newly created navbar category object
   */
  
  static async addCategoryToNavbar(categoryId, displayOrder = null) {
    try {
      const params = { categoryId };
      if (displayOrder !== null) {
        params.displayOrder = displayOrder;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(this.ADMIN_API_URL, null, { 
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Category added to navbar successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding category to navbar:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Updates a navbar category
   * @param {number} id - The navbar category ID
   * @param {Object} updateData - Data to update
   * @param {boolean} updateData.isActive - Whether the category is active in navbar
   * @param {number} updateData.displayOrder - Display order of the category
   * @returns {Promise<Object>} Updated navbar category object
   */
  static async updateNavbarCategory(id, { isActive, displayOrder }) {
    try {
      const params = {};
      if (isActive !== undefined) params.isActive = isActive;
      if (displayOrder !== undefined) params.displayOrder = displayOrder;

      const token = localStorage.getItem('token');
      const response = await axios.put(`${this.ADMIN_API_URL}/${id}`, null, { 
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Navbar category updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating navbar category:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Removes a category from the navbar
   * @param {number} id - The navbar category ID to remove
   * @returns {Promise<void>}
   */
  static async removeFromNavbar(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${this.ADMIN_API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Category removed from navbar successfully:', id);
    } catch (error) {
      console.error('Error removing category from navbar:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Updates the display order of multiple navbar categories at once
   * @param {Array<Object>} categories - Array of navbar category objects with id and displayOrder
   * @returns {Promise<Array>} Updated navbar category objects
   */
  static async updateNavbarCategoriesOrder(categories) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${this.ADMIN_API_URL}/reorder`, categories, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Navbar categories order updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating navbar categories order:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Adds multiple categories to the navbar at once
   * @param {Array<Object>} categories - Array of objects with categoryId and displayOrder
   * @returns {Promise<void>}
   */
  static async bulkAddCategoriesToNavbar(categories) {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${this.ADMIN_API_URL}/bulk`, categories, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Bulk categories added to navbar successfully');
    } catch (error) {
      console.error('Error adding bulk categories to navbar:', error.response?.data || error);
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

export default NavbarCategoryService;