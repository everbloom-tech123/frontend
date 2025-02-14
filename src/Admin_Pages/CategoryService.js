import axios from 'axios';
import config from '../config';

/**
 * Service class for handling all category-related API operations.
 * This service interfaces with the Spring Boot backend endpoints under /public/api/categories
 */
class CategoryService {
  // Base URL for all category-related endpoints
  static API_BASE_URL = `${config.API_BASE_URL}/public/api/categories`;

  /**
   * Fetches all categories from the backend
   * Includes error handling that returns an empty array instead of throwing
   * to prevent UI components from breaking
   * @returns {Promise<Array>} Array of category objects
   */
  static async getAllCategories() {
    try {
      console.log('Fetching categories from:', this.API_BASE_URL);
      const response = await axios.get(this.API_BASE_URL);
      console.log('Categories fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.error('Error details:', error.response?.data);
      // Return empty array instead of throwing to prevent UI breaks
      return [];
    }
  }

  /**
   * Creates a new category
   * @param {Object} categoryData - Object containing category information
   * @param {string} categoryData.name - The name of the category
   * @returns {Promise<Object>} Created category object
   */
  static async createCategory(categoryData) {
    try {
      const response = await axios.post(this.API_BASE_URL, {
        name: categoryData.name.trim(),
        subcategories: [] // Initialize with empty subcategories array
      });
      console.log('Category created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error.response?.data || error);
      // Throw error for UI to handle and display appropriate message
      throw this.formatError(error);
    }
  }

  /**
   * Updates an existing category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category object
   */
  static async updateCategory(id, categoryData) {
    try {
      const response = await axios.put(`${this.API_BASE_URL}/${id}`, {
        name: categoryData.name.trim(),
        subcategories: categoryData.subcategories || []
      });
      console.log('Category updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Deletes a category by ID
   * @param {number} id - Category ID to delete
   * @returns {Promise<void>}
   */
  static async deleteCategory(id) {
    try {
      await axios.delete(`${this.API_BASE_URL}/${id}`);
      console.log('Category deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting category:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Adds a subcategory to an existing category
   * @param {number} categoryId - Parent category ID
   * @param {string} subcategoryName - Name of the subcategory to add
   * @returns {Promise<Object>} Updated category object with new subcategory
   */
  static async addSubcategory(categoryId, subcategoryName) {
    try {
      const response = await axios.post(
        `${this.API_BASE_URL}/${categoryId}/subcategory`,
        null,
        {
          params: {
            subcategory: subcategoryName.trim()
          }
        }
      );
      console.log('Subcategory added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding subcategory:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Removes a subcategory from a category
   * @param {number} categoryId - Parent category ID
   * @param {string} subcategoryName - Name of the subcategory to remove
   * @returns {Promise<void>}
   */
  static async removeSubcategory(categoryId, subcategoryName) {
    try {
      await axios.delete(
        `${this.API_BASE_URL}/${categoryId}/subcategory`,
        {
          params: {
            subcategory: subcategoryName.trim()
          }
        }
      );
      console.log('Subcategory removed successfully');
    } catch (error) {
      console.error('Error removing subcategory:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Fetches a single category by ID
   * @param {number} id - Category ID to fetch
   * @returns {Promise<Object>} Category object
   */
  static async getCategoryById(id) {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/${id}`);
      console.log('Category fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error.response?.data || error);
      throw this.formatError(error);
    }
  }

  /**
   * Fetches multiple categories by their IDs
   * @param {Array<number>} categoryIds - Array of category IDs
   * @returns {Promise<Array>} Array of category objects
   */
  static async getCategoriesByIds(categoryIds) {
    try {
      // Convert array of IDs to query parameters
      const params = new URLSearchParams();
      categoryIds.forEach(id => params.append('categoryIds', id));
      
      const response = await axios.get(`${this.API_BASE_URL}/by-Ids`, { params });
      console.log('Categories fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories by IDs:', error.response?.data || error);
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

  /**
   * Validates category data before sending to backend
   * @private
   * @param {Object} categoryData - Category data to validate
   * @throws {Error} If validation fails
   */
  static validateCategoryData(categoryData) {
    if (!categoryData.name) {
      throw new Error('Category name is required');
    }
    if (categoryData.name.trim().length > 100) {
      throw new Error('Category name cannot exceed 100 characters');
    }
  }
}

export default CategoryService;