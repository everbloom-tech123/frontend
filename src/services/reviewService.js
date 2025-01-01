// reviewService.js
import config from '../config';

const REVIEWS_API_URL = `${config.API_BASE_URL}/public/api/reviews`;

class ReviewService {
    static async getReviewsByProduct(productId) {
        try {
            const response = await fetch(`${REVIEWS_API_URL}/product/${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch reviews');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching product reviews:', error);
            throw error;
        }
    }

    static async getReviewsByUser(userId) {
        try {
            const response = await fetch(`${REVIEWS_API_URL}/user/${userId}`, {
                method: 'GET',
                headers: {
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
            const response = await fetch(REVIEWS_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create review');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    }

    static async updateReview(id, reviewData) {
        try {
            const response = await fetch(`${REVIEWS_API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update review');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    }

    static async deleteReview(id) {
        try {
            const response = await fetch(`${REVIEWS_API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete review');
            }

            return true;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }
}

export default ReviewService;

