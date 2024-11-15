import axios from 'axios';
import config from '../config';

const API_BASE_URL = `${config.API_BASE_URL}/public/api/categories`;


class CategoryService {
  static async getAllCategories() {
    try {
      console.log('Fetching all categories');
      const response = await axios.get(API_BASE_URL);
      console.log('Fetched categories:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data || error.message);
      throw error;
    }
  }

  static async getCategoryById(id) {
    try {
      console.log(`Fetching category with id: ${id}`);
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      console.log('Fetched category:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  static async createCategory(categoryData) {
    try {
      console.log('Creating new category:', categoryData);
      const response = await axios.post(API_BASE_URL, categoryData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Created category:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error.response?.data || error.message);
      throw error;
    }
  }

  static async updateCategory(id, categoryData) {
    try {
      console.log(`Updating category with id: ${id}`, categoryData);
      const response = await axios.put(`${API_BASE_URL}/${id}`, categoryData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Updated category:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  static async deleteCategory(id) {
    try {
      console.log(`Deleting category with id: ${id}`);
      await axios.delete(`${API_BASE_URL}/${id}`);
      console.log(`Deleted category with id: ${id}`);
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
}

export default CategoryService;