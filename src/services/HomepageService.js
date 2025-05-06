// homepageService.js
import config from '../config';

// Set up API URLs based on the backend controller paths
const HOMEPAGE_API_URL = `${config.API_BASE_URL}/public/api/homepage`;

class HomepageService {
    /**
     * Utility method to log response errors in a consistent format
     * @param {Response} response - The fetch API response object
     * @param {string} context - Description of where the error occurred
     */
    static logResponseError(response, context) {
        console.error(`Error in ${context}:`, {
            status: response.status,
            statusText: response.statusText,
            url: response.url
        });
    }

    /**
     * Fetches all homepage data with default category limit of 5
     * @param {number} categoriesLimit - Optional limit for the number of experiences per category
     * @returns {Promise<Object>} - Homepage data containing special products, popular products, and categories
     */
    static async getHomepageData(categoriesLimit = 5) {
        try {
            const response = await fetch(`${HOMEPAGE_API_URL}/data?categoriesLimit=${categoriesLimit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            // Better error handling
            if (!response.ok) {
                this.logResponseError(response, 'getHomepageData');
                
                let errorMessage = 'Failed to fetch homepage data';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                    console.error('API error details:', errorData);
                } catch (e) {
                    console.error('Could not parse error response:', e);
                }
                
                throw new Error(errorMessage);
            }
    
            const data = await response.json();
            console.log('Homepage data fetched successfully:', {
                specialProducts: data.specialProducts?.length || 0,
                popularProducts: data.popularProducts?.length || 0, 
                categories: data.categories?.length || 0
            });
            
            return data;
        } catch (error) {
            console.error('Error fetching homepage data:', error);
            throw error;
        }
    }

    /**
     * Fetches selective homepage data based on specified parameters
     * @param {Object} options - Configuration options for the selective data fetch
     * @param {boolean} options.includeSpecial - Whether to include special products
     * @param {boolean} options.includePopular - Whether to include popular products
     * @param {boolean} options.includeCategories - Whether to include homepage categories
     * @param {number} options.categoriesLimit - Optional limit for the number of experiences per category
     * @returns {Promise<Object>} - Customized homepage data containing only requested sections
     */
    static async getSelectiveHomepageData({
        includeSpecial = true,
        includePopular = true,
        includeCategories = true,
        categoriesLimit = 5
    } = {}) {
        try {
            // Build query parameters for selective data
            const queryParams = new URLSearchParams({
                includeSpecial,
                includePopular,
                includeCategories,
                categoriesLimit
            });

            // Get token if available
            const token = localStorage.getItem('token');
            
            console.log(`Fetching selective homepage data with params: ${queryParams.toString()}`);
            
            const response = await fetch(`${HOMEPAGE_API_URL}/selective-data?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });
        
            console.log('Selective homepage data response status:', response.status);
        
            if (!response.ok) {
                this.logResponseError(response, 'getSelectiveHomepageData');
                
                let errorMessage = 'Failed to fetch selective homepage data';
                try {
                    const errorData = await response.json();
                    console.error('API error details:', errorData);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use default message
                    console.error('Could not parse error response:', e);
                }
                throw new Error(errorMessage);
            }
        
            const data = await response.json();
            console.log('Selective homepage data fetched successfully:', {
                specialProducts: data.specialProducts?.length || 0,
                popularProducts: data.popularProducts?.length || 0, 
                categories: data.categories?.length || 0
            });
            
            return data;
        } catch (error) {
            console.error('Detailed error fetching selective homepage data:', error);
            throw error;
        }
    }

    /**
     * Helper method to fetch only special products
     * @returns {Promise<Array>} - List of special products
     */
    static async getSpecialProducts() {
        try {
            const homepageData = await this.getSelectiveHomepageData({
                includeSpecial: true,
                includePopular: false,
                includeCategories: false
            });
            return homepageData.specialProducts || [];
        } catch (error) {
            console.error('Error fetching special products:', error);
            throw error;
        }
    }

    /**
     * Helper method to fetch only popular products
     * @returns {Promise<Array>} - List of popular products
     */
    static async getPopularProducts() {
        try {
            const homepageData = await this.getSelectiveHomepageData({
                includeSpecial: false,
                includePopular: true,
                includeCategories: false
            });
            return homepageData.popularProducts || [];
        } catch (error) {
            console.error('Error fetching popular products:', error);
            throw error;
        }
    }

    /**
     * Helper method to fetch only homepage categories with experiences
     * @param {number} limit - Optional limit for the number of experiences per category
     * @returns {Promise<Array>} - List of homepage categories with experiences
     */
    static async getCategories(limit = 5) {
        try {
            const homepageData = await this.getSelectiveHomepageData({
                includeSpecial: false,
                includePopular: false,
                includeCategories: true,
                categoriesLimit: limit
            });
            return homepageData.categories || [];
        } catch (error) {
            console.error('Error fetching homepage categories:', error);
            throw error;
        }
    }
}

export default HomepageService;