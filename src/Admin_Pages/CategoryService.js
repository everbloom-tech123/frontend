import axios from 'axios';
import config from '../config';

const API_BASE_URL = `${config.API_BASE_URL}/public/api/categories`;

class CategoryService {
  static async getAllCategories() {
    try {
      console.log('Fetching categories from:', API_BASE_URL);
      const response = await config.axiosInstance.get(API_BASE_URL);
      console.log('Categories fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.error('Error details:', error.response?.data);
      // Instead of throwing, return empty array to prevent form from breaking
      return [];
    }
  }

  static async createCategory(categoryData) {
    try {
      const response = await config.axiosInstance.post(API_BASE_URL, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error.response?.data || error);
      throw error;
    }
  }

  static async updateCategory(id, categoryData) {
    try {
      const response = await config.axiosInstance.put(`${API_BASE_URL}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error.response?.data || error);
      throw error;
    }
  }

  static async deleteCategory(id) {
    try {
      await config.axiosInstance.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error.response?.data || error);
      throw error;
    }
  }

  static async addSubcategory(categoryId, subCategory) {
    try {
      const response = await config.axiosInstance.post(`${API_BASE_URL}/${categoryId}/subcategories`, subCategory);
      return response.data;
    } catch (error) {
      console.error('Error adding subcategory:', error.response?.data || error);
      throw error;
    }
  }

  static async removeSubcategory(categoryId, subCategoryName) {
    try {
      await config.axiosInstance.delete(`${API_BASE_URL}/${categoryId}/subcategories/${subCategoryName}`);
    } catch (error) {
      console.error('Error removing subcategory:', error.response?.data || error);
      throw error;
    }
  }


  static async getCategoryById(id) {
    try {
      const response = await config.axiosInstance.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error.response?.data || error);
      throw error;
    }
  }
}



export default CategoryService;