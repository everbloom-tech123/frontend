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

    static async getProductsByCategories() {
        try {
            console.log('Fetching products organized by categories...');
            const response = await axios.get(`${API_BASE_URL}/categories`);
            console.log('Products by categories fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching products by categories:', error.response?.data || error.message);
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
            console.log('Creating experience with data:');
            for (let pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    console.log(pair[0], ':', pair[1].name, '(File)');
                } else {
                    console.log(pair[0], ':', pair[1]);
                }
            }

            const requiredFields = [
                'title',
                'description',
                'additionalInfo',
                'price',
                'discount',
                'subCategoryIds',
                'cityId',
                'address'
            ];

            for (let field of requiredFields) {
                const value = formData.get(field);
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                }
            }

            const subCategoryIds = formData.getAll('subCategoryIds');
            if (!subCategoryIds || subCategoryIds.length === 0) {
                throw new Error('At least one subcategory must be selected');
            }

            const numericValidations = {
                price: { min: 0, message: 'Price must be greater than or equal to 0' },
                discount: { min: 0, max: 100, message: 'Discount must be between 0 and 100' }
            };

            for (const [field, validation] of Object.entries(numericValidations)) {
                const value = parseFloat(formData.get(field));
                if (isNaN(value)) {
                    throw new Error(`${field} must be a valid number`);
                }
                if (value < validation.min || (validation.max && value > validation.max)) {
                    throw new Error(validation.message);
                }
            }

            const latitude = formData.get('latitude');
            const longitude = formData.get('longitude');
            if (latitude || longitude) {
                if (!latitude || !longitude) {
                    throw new Error('Both latitude and longitude must be provided if one is specified');
                }
                
                const lat = parseFloat(latitude);
                const lng = parseFloat(longitude);
                
                if (lat < 5.0 || lat > 10.0 || lng < 79.0 || lng > 82.0) {
                    throw new Error('Coordinates must be within Sri Lanka\'s boundaries (Latitude: 5.0-10.0, Longitude: 79.0-82.0)');
                }
            }

            const images = formData.getAll('images');
            if (!images || images.length === 0) {
                throw new Error('At least one image is required');
            }
            if (images.length > 5) {
                throw new Error('Maximum 5 images allowed');
            }

            const imageValidationPromises = images.map(async (image, index) => {
                if (image instanceof File) {
                    if (!image.type.startsWith('image/')) {
                        throw new Error(`File ${index + 1} is not a valid image`);
                    }
                    if (image.size > 10 * 1024 * 1024) {
                        throw new Error(`Image ${index + 1} exceeds maximum size of 10MB`);
                    }
                }
            });
            await Promise.all(imageValidationPromises);

            const video = formData.get('video');
            if (video instanceof File && video.name) {
                if (!video.type.startsWith('video/')) {
                    throw new Error('Invalid video file type');
                }
                if (video.size > 500 * 1024 * 1024) {
                    throw new Error('Video file size exceeds maximum allowed size of 500MB');
                }
            }

            ['special', 'mostPopular'].forEach(flag => {
                if (!formData.has(flag)) {
                    formData.append(flag, 'false');
                }
            });

            if (!formData.has('tags')) {
                formData.append('tags', JSON.stringify([]));
            }

            const response = await axios.post(API_BASE_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 180000,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`Upload progress: ${percentCompleted}%`);
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error creating experience:', error);
            
            if (error.response) {
                const errorMessage = error.response.data.message || 
                                   error.response.data.error || 
                                   'Server error occurred';
                throw new Error(errorMessage);
            }
            
            if (error.code === 'ECONNABORTED') {
                throw new Error('Upload timed out. Please check your connection and try again.');
            }

            throw error;
        }
    }

    // Add this method to your ExperienceService class
    static async getExperiencesByCategory(categoryId) {
        try {
            console.log('Fetching experiences for category:', categoryId);
            const response = await axios.get(`${API_BASE_URL}/filter/by-category`, {
                params: { categoryId }
            });
            console.log('Category experiences fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching category experiences:', error);
            if (error.response?.status === 404) {
                throw new Error('Category not found');
            }
            throw new Error('Failed to fetch category experiences');
        }
    }

    static async getExperiencesBySubcategories(subcategoryIds) {
        try {
            console.log('Fetching experiences by subcategories:', subcategoryIds);
            const response = await axios.get(`${API_BASE_URL}/filter/by-subcategory`, {
                params: { subcategories: subcategoryIds }
            });
            console.log('Filtered experiences fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error filtering experiences by subcategories:', error);
            throw error;
        }
    }

    static async updateExperience(id, formData) {
        try {
            console.log(`Updating experience ${id} with data:`);
            for (let pair of formData.entries()) {
                const value = pair[1] instanceof File 
                    ? `${pair[1].name} (${(pair[1].size / 1024 / 1024).toFixed(2)}MB)`
                    : pair[1];
                console.log(`${pair[0]}: ${value}`);
            }

            const requiredFields = [
                'title',
                'description',
                'additionalInfo',
                'price',
                'discount',
                'subCategoryIds',
                'cityId',
                'address'
            ];

            for (const field of requiredFields) {
                const value = formData.get(field);
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                }
            }

            const numericValidations = {
                price: {
                    min: 0,
                    message: 'Price must be greater than or equal to 0',
                    required: true
                },
                discount: {
                    min: 0,
                    max: 100,
                    message: 'Discount must be between 0 and 100',
                    required: true
                }
            };

            for (const [field, rules] of Object.entries(numericValidations)) {
                const value = formData.get(field);
                if (rules.required || value) {
                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                        throw new Error(`${field} must be a valid number`);
                    }
                    if (numValue < rules.min || (rules.max && numValue > rules.max)) {
                        throw new Error(rules.message);
                    }
                }
            }

            const latitude = formData.get('latitude');
            const longitude = formData.get('longitude');
            
            if (latitude || longitude) {
                if (!latitude || !longitude) {
                    throw new Error('Both latitude and longitude must be provided if one is specified');
                }

                const lat = parseFloat(latitude);
                const lng = parseFloat(longitude);
                
                if (isNaN(lat) || isNaN(lng)) {
                    throw new Error('Invalid coordinate values provided');
                }

                if (lat < 5.0 || lat > 10.0 || lng < 79.0 || lng > 82.0) {
                    throw new Error(
                        'Coordinates must be within Sri Lanka\'s boundaries\n' +
                        'Latitude: 5.0-10.0\n' +
                        'Longitude: 79.0-82.0'
                    );
                }
            }

            const existingImages = formData.get('removeImages') 
                ? JSON.parse(formData.get('removeImages')) 
                : [];
            const newImages = formData.getAll('images');
            
            const totalImagesAfterUpdate = newImages.length + 
                (formData.get('currentImageCount') || 0) - 
                existingImages.length;

            if (totalImagesAfterUpdate === 0) {
                throw new Error('Product must have at least one image');
            }
            if (totalImagesAfterUpdate > 5) {
                throw new Error('Maximum 5 images allowed');
            }

            for (const image of newImages) {
                if (image instanceof File) {
                    if (!image.type.startsWith('image/')) {
                        throw new Error(`File "${image.name}" is not a valid image`);
                    }
                    if (image.size > 10 * 1024 * 1024) {
                        throw new Error(
                            `Image "${image.name}" exceeds maximum size of 10MB`
                        );
                    }
                }
            }

            const newVideo = formData.get('video');
            if (newVideo instanceof File && newVideo.name) {
                if (!newVideo.type.startsWith('video/')) {
                    throw new Error('Invalid video file type');
                }
                if (newVideo.size > 500 * 1024 * 1024) {
                    throw new Error('Video file size exceeds maximum allowed size of 500MB');
                }
            }

            ['special', 'mostPopular'].forEach(flag => {
                if (!formData.has(flag)) {
                    formData.append(flag, 'false');
                }
            });

            const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 180000,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(`Upload progress: ${percentCompleted}%`);
                }
            });

            return response.data;
        } catch (error) {
            console.error(`Error updating experience ${id}:`, error);
            
            if (error.response) {
                const errorMessage = error.response.data.message || 
                                   error.response.data.error || 
                                   'Server error occurred';
                throw new Error(`Update failed: ${errorMessage}`);
            }
            
            if (error.code === 'ECONNABORTED') {
                throw new Error(
                    'Update timed out. Please check your connection and try again.'
                );
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

    static getFileUrl(filename) {
        if (!filename) return '';
        if (filename.startsWith('http')) {
            return filename;
        }
        const cleanPath = filename.startsWith('/') ? filename.substring(1) : filename;
        return `${API_BASE_URL}/files/${cleanPath}`;
    }

    static async validateFile(file, type = 'image') {
        return new Promise((resolve, reject) => {
            const maxSizes = {
                image: 5 * 1024 * 1024,
                video: 100 * 1024 * 1024
            };

            const allowedTypes = {
                image: ['image/jpeg', 'image/png', 'image/gif'],
                video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
            };

            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            if (file.size > maxSizes[type]) {
                reject(new Error(`File size exceeds maximum allowed size (${maxSizes[type] / (1024 * 1024)}MB)`));
                return;
            }

            if (!allowedTypes[type].includes(file.type)) {
                reject(new Error(`Invalid file type. Allowed types: ${allowedTypes[type].join(', ')}`));
                return;
            }

            if (type === 'image') {
                const img = new Image();
                img.onload = () => {
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

    static async filterByLocation(cityId = null, districtId = null) {
        try {
            if (!cityId && !districtId) {
                throw new Error('Either cityId or districtId must be provided');
            }
        
            console.log(`Filtering experiences by cityId: ${cityId} or districtId: ${districtId}`);
            const params = {};
            if (cityId) params.cityId = cityId;
            if (districtId) params.districtId = districtId;
        
            const response = await axios.get(`${API_BASE_URL}/filter/location`, { params });
            console.log('Experiences filtered by location successfully:', response.data);
            return response.data;
        } catch (error) {
          console.error('Error filtering experiences by location:', error.response?.data || error.message);
          throw error;
      }
  }

  static async uploadFile(file, type = 'image') {
      try {
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

  static getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('http')) {
          return imagePath;
      }
      const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      return `${API_BASE_URL}/files/${cleanPath}`;
  }

  static getVideoUrl(videoPath) {
      if (!videoPath) {
          console.log('No video path provided');
          return '';
      }
      
      if (videoPath.startsWith('http')) {
          console.log('Using full URL:', videoPath);
          return videoPath;
      }
      
      const cleanPath = videoPath.startsWith('/') ? videoPath.substring(1) : videoPath;
      const fullUrl = `${API_BASE_URL}/files/${cleanPath}`;
      console.log('Constructed video URL:', fullUrl);
      
      return fullUrl;
  }

  static getFileSize(file) {
      const size = file.size;
      if (size < 1024) return size + ' B';
      if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

export default ExperienceService;