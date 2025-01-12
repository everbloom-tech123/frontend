import axios from 'axios';
import config from '../config';

const API_BASE_URL = `${config.API_BASE_URL}/public/api/categories`;

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for consistent error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', {
      endpoint: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorMessage
    });
    return Promise.reject(error);
  }
);

class CategoryService {
  static async getAllCategories() {
    try {
      const response = await axiosInstance.get('');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return []; // Return empty array to prevent UI breaks
    }
  }

  static async createCategory(categoryData) {
    try {
      const response = await axiosInstance.post('', categoryData);
      return response.data;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw new Error('Failed to create category. Please try again.');
    }
  }

  static async updateCategory(id, categoryData) {
    try {
      const response = await axiosInstance.put(`/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw new Error('Failed to update category. Please try again.');
    }
  }

  static async deleteCategory(id) {
    try {
      await axiosInstance.delete(`/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw new Error('Failed to delete category. Please try again.');
    }
  }

  static async addSubcategory(categoryId, subCategory) {
    try {
      const response = await axiosInstance.post(
        `/${categoryId}/subcategories`, 
        subCategory
      );
      return response.data;
    } catch (error) {
      console.error('Failed to add subcategory:', error);
      throw new Error('Failed to add subcategory. Please try again.');
    }
  }

  static async removeSubcategory(categoryId, subCategoryName) {
    try {
      await axiosInstance.delete(
        `/${categoryId}/subcategories/${encodeURIComponent(subCategoryName)}`
      );
      return true;
    } catch (error) {
      console.error('Failed to remove subcategory:', error);
      throw new Error('Failed to remove subcategory. Please try again.');
    }
  }

  static async getCategoryById(id) {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      throw new Error('Failed to fetch category. Please try again.');
    }
  }
}

export default CategoryService;