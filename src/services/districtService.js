import axios from 'axios';
import config from '../config';

class DistrictService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: `${config.API_BASE_URL}/public/api`,
            timeout: 10000, // 10 second timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add response interceptor for error handling
        this.apiClient.interceptors.response.use(
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
    }

    /**
     * Fetch all districts
     * @returns {Promise<Array<District>>} Array of districts
     */
    async getAllDistricts() {
        try {
            const response = await this.apiClient.get('/districts');
            
            // Validate response data
            if (!response.data) {
                console.error('No data received from districts API');
                return [];
            }

            // Ensure we have an array of districts
            if (!Array.isArray(response.data)) {
                console.error('Invalid districts data format:', response.data);
                return [];
            }

            // Validate each district object has required properties
            return response.data.filter(district => {
                const isValid = district && 
                              typeof district.id !== 'undefined' && 
                              typeof district.name === 'string';
                
                if (!isValid) {
                    console.warn('Invalid district object:', district);
                }
                return isValid;
            });

        } catch (error) {
            console.error('Error fetching districts:', error);
            // Return empty array instead of throwing to prevent UI breaks
            return [];
        }
    }

    /**
     * Fetch cities by district ID
     * @param {number} districtId - The ID of the district
     * @returns {Promise<Array<DistrictCity>>} Array of cities in the district
     */
    async getCitiesByDistrict(districtId) {
        if (!districtId) {
            console.error('No district ID provided');
            return [];
        }

        try {
            const response = await this.apiClient.get(`/districts/${districtId}/cities`);
            
            // Validate response data
            if (!response.data) {
                console.error('No data received from cities API');
                return [];
            }

            // Ensure we have an array of cities
            if (!Array.isArray(response.data)) {
                console.error('Invalid cities data format:', response.data);
                return [];
            }

            // Validate each city object has required properties
            return response.data.filter(city => {
                const isValid = city && 
                              typeof city.id !== 'undefined' && 
                              typeof city.name === 'string';
                
                if (!isValid) {
                    console.warn('Invalid city object:', city);
                }
                return isValid;
            });

        } catch (error) {
            console.error(`Error fetching cities for district ${districtId}:`, error);
            // Return empty array instead of throwing to prevent UI breaks
            return [];
        }
    }

    /**
     * Check if the API is accessible
     * @returns {Promise<boolean>} True if API is accessible, false otherwise
     */
    async checkApiHealth() {
        try {
            await this.apiClient.get('/health');
            return true;
        } catch (error) {
            console.error('API health check failed:', error);
            return false;
        }
    }
}

// Export a singleton instance
export default new DistrictService();