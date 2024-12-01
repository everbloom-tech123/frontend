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
      const requiredFields = [
        'title', 
        'description', 
        'price', 
        'categoryId',
        'discount',
        'additionalInfo'
      ];
      
      for (let field of requiredFields) {
        if (!formData.get(field)) {
          throw new Error(`${field} is required`);
        }
      }

      // Handle special flag
      if (!formData.has('special')) {
        formData.append('special', 'false'); // Default value
      }

      // Validate numeric fields
      const numericFields = ['price', 'discount'];
      for (let field of numericFields) {
        const value = formData.get(field);
        if (isNaN(parseFloat(value))) {
          throw new Error(`${field} must be a valid number`);
        }
        if (parseFloat(value) < 0) {
          throw new Error(`${field} cannot be negative`);
        }
      }

      // Validate images
      const images = formData.getAll('images');
      if (!images || images.length === 0) {
        throw new Error('At least one image is required');
      }
      if (images.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }

      // Validate each image
      for (let image of images) {
        if (image instanceof File) {
          try {
            await this.validateFile(image, 'image');
          } catch (error) {
            throw new Error(`Image validation failed: ${error.message}`);
          }
        }
      }

      // Validate video if present
      const video = formData.get('video');
      if (video instanceof File && !video.name) {
        try {
          await this.validateFile(video, 'video');
        } catch (error) {
          throw new Error(`Video validation failed: ${error.message}`);
        }
      }

      // Convert categoryId to category if needed
      const categoryId = formData.get('categoryId');
      if (categoryId) {
        formData.append('category', categoryId);
      }

      // Add tags if not present
      if (!formData.has('tags')) {
        formData.append('tags', []);
      }

      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for large uploads
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });

      console.log('Experience created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating experience:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
        throw new Error(error.response.data.message || 'Server error occurred');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
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

      // Validate numeric fields if present
      const numericFields = ['price', 'discount'];
      for (let field of numericFields) {
        const value = formData.get(field);
        if (value !== null && value !== undefined && value !== '') {
          if (isNaN(parseFloat(value))) {
            throw new Error(`${field} must be a valid number`);
          }
          if (parseFloat(value) < 0) {
            throw new Error(`${field} cannot be negative`);
          }
        }
      }

      // Validate new images if present
      const images = formData.getAll('images');
      if (images && images.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }
      
      for (let image of images) {
        if (image instanceof File) {
          try {
            await this.validateFile(image, 'image');
          } catch (error) {
            throw new Error(`Image validation failed: ${error.message}`);
          }
        }
      }

      // Validate new video if present
      const video = formData.get('video');
      if (video instanceof File && !video.name) {
        try {
          await this.validateFile(video, 'video');
        } catch (error) {
          throw new Error(`Video validation failed: ${error.message}`);
        }
      }

      const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });

      console.log('Experience updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating experience ${id}:`, error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
        throw new Error(error.response.data.message || 'Server error occurred');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
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

  /* static getVideoUrl(videoPath) {
    if (!videoPath) return '';
    if (videoPath.startsWith('http')) {
      return videoPath;
    }
    const cleanPath = videoPath.startsWith('/') ? videoPath.substring(1) : videoPath;
    return `${config.API_BASE_URL}/public/api/products/files/${cleanPath}`;
  } */

    static getVideoUrl(videoPath) {
      if (!videoPath) return '';
      // Handle both full URLs and relative paths
      if (videoPath.startsWith('http')) {
          return videoPath;
      }
      // Clean up the path to ensure proper formatting
      const cleanPath = videoPath.startsWith('/') ? videoPath.substring(1) : videoPath;
      const fullUrl = `${config.API_BASE_URL}/public/api/products/files/${cleanPath}`;
      console.log('Video URL:', fullUrl); // For debugging
      return fullUrl;
  }

  static async uploadFile(file, type = 'image') {
    try {
      // Validate file before upload
      await this.validateFile(file, type);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/upload/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });

      console.log(`${type} uploaded successfully:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error.response?.data || error.message);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timed out. Please try again.');
      }
      throw error;
    }
  }

  static getFileSize(file) {
    const size = file.size;
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }

  static async validateFile(file, type = 'image') {
    return new Promise((resolve, reject) => {
      // Maximum file sizes (in bytes)
      const maxSizes = {
        image: 5 * 1024 * 1024, // 5MB
        video: 100 * 1024 * 1024 // 100MB to match backend
      };

      // Allowed MIME types
      const allowedTypes = {
        image: ['image/jpeg', 'image/png', 'image/gif'],
        video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
      };

      // Basic validation
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      // Check file size
      if (file.size > maxSizes[type]) {
        reject(new Error(`File size exceeds maximum allowed size (${maxSizes[type] / (1024 * 1024)}MB)`));
        return;
      }

      // Check file type
      if (!allowedTypes[type].includes(file.type)) {
        reject(new Error(`Invalid file type. Allowed types: ${allowedTypes[type].join(', ')}`));
        return;
      }

      // Additional validation for images
      if (type === 'image') {
        const img = new Image();
        img.onload = () => {
          // You can add additional image validation here if needed
          // For example, checking dimensions
          resolve(true);
        };
        img.onerror = () => {
          reject(new Error('Invalid image file'));
        };
        img.src = URL.createObjectURL(file);
      } else {
        resolve(true);
      }
    });
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