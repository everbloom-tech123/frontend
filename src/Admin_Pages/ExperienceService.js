import axios from 'axios';
import config from '../config';

const API_BASE_URL = `${config.API_BASE_URL}/public/api/products`;

class ExperienceService {
  static async getAllExperiences() {
    try {
      console.log('Fetching all experiences...');
      const response = await axios.get(API_BASE_URL);
      console.log('Experiences fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching experiences:', error.response?.data || error);
      throw error;
    }
  }

  static async getExperience(id) {
    try {
      console.log(`Fetching experience with id: ${id}`);
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      console.log('Experience fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching experience ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  static async createExperience(formData) {
    try {
      // Log the FormData contents
      console.log('Creating experience with data:');
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], ':', pair[1].name, '(File)');
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }

      // Validate required fields
      const requiredFields = ['title', 'description', 'price', 'categoryId'];
      for (let field of requiredFields) {
        if (!formData.get(field)) {
          throw new Error(`${field} is required`);
        }
      }

      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Experience created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating experience:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      throw error;
    }
  }

  static async updateExperience(id, formData) {
    try {
      // Log the FormData contents
      console.log(`Updating experience ${id} with data:`);
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], ':', pair[1].name, '(File)');
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }

      const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Experience updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating experience ${id}:`, error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      throw error;
    }
  }

  static async deleteExperience(id) {
    try {
      console.log(`Deleting experience ${id}`);
      await axios.delete(`${API_BASE_URL}/${id}`);
      console.log(`Experience ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting experience ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  static getImageUrl(imagePath) {
    if (!imagePath) return '';
    // Handle both full URLs and relative paths
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Clean up the path to ensure proper formatting
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${config.API_BASE_URL}/public/api/products/files/${cleanPath}`;
  }

  static async uploadFile(file, type = 'image') {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/upload/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(`${type} uploaded successfully:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error.response?.data || error.message);
      throw error;
    }
  }

  static getFileSize(file) {
    const size = file.size;
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }

  static validateFile(file, type = 'image') {
    // Maximum file sizes (in bytes)
    const maxSizes = {
      image: 5 * 1024 * 1024, // 5MB
      video: 50 * 1024 * 1024 // 50MB
    };

    // Allowed MIME types
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif'],
      video: ['video/mp4', 'video/quicktime', 'video/x-msvideo']
    };

    // Check file size
    if (file.size > maxSizes[type]) {
      throw new Error(`File size exceeds maximum allowed size (${maxSizes[type] / (1024 * 1024)}MB)`);
    }

    // Check file type
    if (!allowedTypes[type].includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes[type].join(', ')}`);
    }

    return true;
  }

  static async searchExperiences(query) {
    try {
      console.log('Searching experiences with query:', query);
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { query }
      });
      console.log('Search results:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching experiences:', error.response?.data || error.message);
      throw error;
    }
  }

  static async getExperiencesByCategory(categoryId) {
    try {
      console.log(`Fetching experiences for category ${categoryId}`);
      const response = await axios.get(`${API_BASE_URL}/category/${categoryId}`);
      console.log('Experiences fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching experiences for category ${categoryId}:`, 
        error.response?.data || error.message);
      throw error;
    }
  }
}

export default ExperienceService;