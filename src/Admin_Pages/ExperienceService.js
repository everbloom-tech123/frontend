import axios from 'axios';
import config from '../config';

const API_BASE_URL = `${config.API_BASE_URL}/public/api/products`;

class ExperienceService {
  // Public methods
  static async getAllExperiences() {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching experiences:', error);
      throw error;
    }
  }

  static async getExperience(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching experience:', error.response?.data || error.message);
      throw error;
    }
  }

  // Protected methods
  static async createExperience(experienceData) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Add basic fields
      formData.append('title', experienceData.title);
      formData.append('description', experienceData.description);
      formData.append('price', experienceData.price);
      formData.append('categoryName', experienceData.category?.name || experienceData.categoryName || '');

      // Optional fields
      if (experienceData.additionalInfo) {
        formData.append('additionalInfo', experienceData.additionalInfo);
      }
      if (experienceData.discount) {
        formData.append('discount', experienceData.discount);
      }

      // Add tags
      if (experienceData.tags && experienceData.tags.length > 0) {
        experienceData.tags.forEach(tag => formData.append('tags', tag));
      }

      // Add images
      if (experienceData.images && experienceData.images.length > 0) {
        experienceData.images.forEach(image => formData.append('images', image));
      }

      // Add video if exists
      if (experienceData.video) {
        formData.append('video', experienceData.video);
      }

      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating experience:', error.response?.data || error.message);
      throw error;
    }
  }

  static async updateExperience(id, experienceData) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Add basic fields
      formData.append('title', experienceData.title);
      formData.append('description', experienceData.description);
      formData.append('price', experienceData.price);
      formData.append('categoryName', experienceData.category?.name || experienceData.categoryName || '');

      // Optional fields
      if (experienceData.additionalInfo) {
        formData.append('additionalInfo', experienceData.additionalInfo);
      }
      if (experienceData.discount) {
        formData.append('discount', experienceData.discount);
      }

      // Add tags
      if (experienceData.tags && experienceData.tags.length > 0) {
        experienceData.tags.forEach(tag => formData.append('tags', tag));
      }

      // Add new images
      if (experienceData.images && experienceData.images.length > 0) {
        experienceData.images.forEach(image => formData.append('images', image));
      }

      // Add new video if exists
      if (experienceData.video) {
        formData.append('video', experienceData.video);
      }

      const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating experience:', error.response?.data || error.message);
      throw error;
    }
  }

  static async deleteExperience(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error deleting experience:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default ExperienceService;