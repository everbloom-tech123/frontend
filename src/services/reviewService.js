// reviewService.js
import config from '../config';

// Update the API path to match your backend controller
const REVIEWS_API_URL = `${config.API_BASE_URL}/api/reviews`;

class ReviewService {
    static async getReviewsByProduct(productId) {
        try {
            const response = await fetch(`${REVIEWS_API_URL}/products/${productId}`, {
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
            // Add authentication token similar to userService.js
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
            // Add authentication token
            const token = localStorage.getItem('token');
            const response = await fetch(REVIEWS_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update review');
          }
    
          return await response.json();
        } catch (error) {
          console.error('Error updating review:', error);
          throw error;
        }
      }
    
      // New method for admin status updates
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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to process review');
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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete review');
            }

            return true;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }

    // Add a method to get the user's own reviews (matches the my-reviews endpoint)
    // Fix the getMyReviews method to ensure proper data retrieval
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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch your reviews');
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error fetching my reviews:', error);
            throw error;
        }
    }

  // Fix the createReview method to ensure proper data submission
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
        const errorData = await response.json();
        console.error('API error details:', errorData);
        throw new Error(errorData.message || 'Failed to create review');
      }
  
      const data = await response.json();
      console.log('Review created successfully:', data);
      return data;
    } catch (error) {
      console.error('Detailed error creating review:', error);
      throw error;
    }
  }
  
    // Admin endpoint to get all reviews
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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch all reviews');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching all reviews:', error);
            throw error;
        }
    }
}

export default ReviewService;