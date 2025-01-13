// src/services/districtService.js
import config from '../config';

class DistrictService {
    constructor() {
        // Use the pre-configured axiosInstance from config
        this.apiClient = config.axiosInstance.create({
            baseURL: `${config.API_BASE_URL}/public/api`
        });
    }

    /**
     * Fetch all districts
     * @returns {Promise<Array<District>>} Array of districts
     */
    async getAllDistricts() {
        try {
            const response = await this.apiClient.get('/districts');
            return response.data;
        } catch (error) {
            console.error('Error fetching districts:', error);
            throw new Error('Failed to fetch districts');
        }
    }

    /**
     * Fetch cities by district ID
     * @param {number} districtId - The ID of the district
     * @returns {Promise<Array<DistrictCity>>} Array of cities in the district
     */
    async getCitiesByDistrict(districtId) {
        try {
            const response = await this.apiClient.get(`/districts/${districtId}/cities`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching cities for district ${districtId}:`, error);
            throw new Error('Failed to fetch cities');
        }
    }
}

export default new DistrictService();