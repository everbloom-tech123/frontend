import axios from 'axios';

class CategoryService {
  static API_URL = '/public/api/categories';

  static async getAllCategories() {
    try {
      console.log('Fetching all categories');
      const response = await axios.get(this.API_URL);
      console.log('Fetched categories:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error.response?.status === 404) {
        throw new Error('Categories not found');
      }
      throw error;
    }
  }

  static async getCategoryById(id) {
    try {
      console.log(`Fetching category with id: ${id}`);
      const response = await axios.get(`${this.API_URL}/${id}`);
      console.log('Fetched category:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      throw error;
    }
  }

  static async createCategory(categoryData) {
    try {
      console.log('Creating new category:', categoryData);
      const response = await axios.post(this.API_URL, categoryData);
      console.log('Created category:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      if (error.response?.status === 400) {
        throw new Error('Invalid category data');
      } else if (error.response?.status === 409) {
        throw new Error('Category already exists');
      }
      throw error;
    }
  }

  static async updateCategory(id, categoryData) {
    try {
      console.log(`Updating category with id: ${id}`, categoryData);
      const response = await axios.put(`${this.API_URL}/${id}`, categoryData);
      console.log('Updated category:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      } else if (error.response?.status === 409) {
        throw new Error('Category name already exists');
      }
      throw error;
    }
  }

  static async deleteCategory(id) {
    try {
      console.log(`Deleting category with id: ${id}`);
      await axios.delete(`${this.API_URL}/${id}`);
      console.log(`Deleted category with id: ${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      } else if (error.response?.status === 409) {
        throw new Error('Cannot delete category with associated experiences');
      }
      throw error;
    }
  }

  static async searchCategories(query) {
    try {
      console.log(`Searching categories with query: ${query}`);
      const response = await axios.get(`${this.API_URL}/search`, {
        params: { query }
      });
      console.log('Search results:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  }

  static isValidCategoryName(name) {
    return name && name.length >= 2 && name.length <= 50;
  }
}

export default CategoryService;