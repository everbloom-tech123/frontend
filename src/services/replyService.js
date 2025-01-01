
const REPLIES_API_URL = `${config.API_BASE_URL}/public/api/replies`;

class ReplyService {
    static async getRepliesByReview(reviewId) {
        try {
            const response = await fetch(`${REPLIES_API_URL}/review/${reviewId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch replies');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching replies:', error);
            throw error;
        }
    }

    static async createReply(replyData) {
        try {
            const response = await fetch(REPLIES_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(replyData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create reply');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    }

    static async updateReply(id, replyData) {
        try {
            const response = await fetch(`${REPLIES_API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(replyData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update reply');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating reply:', error);
            throw error;
        }
    }

    static async deleteReply(id) {
        try {
            const response = await fetch(`${REPLIES_API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete reply');
            }

            return true;
        } catch (error) {
            console.error('Error deleting reply:', error);
            throw error;
        }
    }
}

export default ReplyService;