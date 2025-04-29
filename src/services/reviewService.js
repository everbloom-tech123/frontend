// reviewService.js
import config from '../config';

// Update the API path to match your backend controller
const REVIEWS_API_URL = `${config.API_BASE_URL}/api/reviews`;
const REVIEWS_API_URL2 = `${config.API_BASE_URL}/public/api/reviews`;

class ReviewService {
    static async getReviewsByProduct(productId) {
        try {
            // Add authentication token similar to other methods
            const token = localStorage.getItem('token');
            const response = await fetch(`${REVIEWS_API_URL2}/products/${productId}`, {
                method: 'GET',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });

            // Better error handling
            if (!response.ok) {
                // For 403 errors, throw a more specific error
                if (response.status === 403) {
                    throw new Error('You do not have permission to access these reviews');
                }
                
                // Try to parse error message if available
                let errorMessage = 'Failed to fetch reviews';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If parsing fails, just use the default message
                }
                
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching product reviews:', error);
            throw error;
        }
    }

    // Rest of ReviewService methods remain unchanged
    static async getReviewsByUser(userId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${REVIEWS_API_URL}/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user reviews');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            throw error;
        }
    }

    static async createReview(reviewData) {
        try {
            // Validate required fields before submission
            if (!reviewData.bookingId || !reviewData.rating) {
                throw new Error('Missing required review data: bookingId and rating are required');
            }
            
            const token = localStorage.getItem('token');
            console.log('Creating review with data:', reviewData);
            
            const response = await fetch(REVIEWS_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
        
            console.log('Create review response status:', response.status);
        
            if (!response.ok) {
                let errorMessage = 'Failed to create review';
                try {
                    const errorData = await response.json();
                    console.error('API error details:', errorData);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use default message
                }
                throw new Error(errorMessage);
            }
        
            const data = await response.json();
            console.log('Review created successfully:', data);
            return data;
        } catch (error) {
            console.error('Detailed error creating review:', error);
            throw error;
        }
    }

    static async updateReview(id, reviewData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${REVIEWS_API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
        
            if (!response.ok) {
                let errorMessage = 'Failed to update review';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use default message
                }
                throw new Error(errorMessage);
            }
        
            return await response.json();
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    }
    
    // Admin method for processing reviews
    static async processReview(id, actionData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${REVIEWS_API_URL}/admin/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(actionData)
            });
        
            if (!response.ok) {
                let errorMessage = 'Failed to process review';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use default message
                }
                throw new Error(errorMessage);
            }
        
            return await response.json();
        } catch (error) {
            console.error('Error processing review:', error);
            throw error;
        }
    }

    static async deleteReview(id) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${REVIEWS_API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                let errorMessage = 'Failed to delete review';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use default message
                }
                throw new Error(errorMessage);
            }

            return true;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }

    static async getMyReviews() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${REVIEWS_API_URL}/my-reviews`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                let errorMessage = 'Failed to fetch your reviews';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use default message
                }
                throw new Error(errorMessage);
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error fetching my reviews:', error);
            throw error;
        }
    }

    static async getAllReviews() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${REVIEWS_API_URL}/admin/all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                let errorMessage = 'Failed to fetch all reviews';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use default message
                }
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching all reviews:', error);
            throw error;
        }
    }
}

export default ReviewService;