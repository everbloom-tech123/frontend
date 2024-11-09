import axios from 'axios';
import config from '../config';

const API_BASE_URL = `${config.API_BASE_URL}/public/api/products`;

class ExperienceService {
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

  static async createExperience(experienceData) {
    try {
      const formData = new FormData();
      Object.keys(experienceData).forEach(key => {
        if (key === 'tags') {
          experienceData[key].forEach(tag => formData.append('tags', tag));
        } else if (key === 'images') {
          experienceData[key].forEach(image => formData.append('images', image));
        } else if (key === 'video') {
          if (experienceData[key]) {
            formData.append('video', experienceData[key]);
          }
        } else {
          formData.append(key, experienceData[key]);
        }
      });

      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating experience:', error.response?.data || error.message);
      throw error;
    }
  }

  static async updateExperience(id, experienceData) {
    try {
      const formData = new FormData();
      Object.keys(experienceData).forEach(key => {
        if (key === 'tags') {
          experienceData[key].forEach(tag => formData.append('tags', tag));
        } else if (key === 'images') {
          experienceData[key].forEach(image => formData.append('images', image));
        } else if (key === 'video') {
          if (experienceData[key]) {
            formData.append('video', experienceData[key]);
          }
        } else {
          formData.append(key, experienceData[key]);
        }
      });

      const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating experience:', error.response?.data || error.message);
      throw error;
    }
  }

  static async deleteExperience(id) {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting experience:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default ExperienceService;