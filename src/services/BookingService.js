import config from '../config';

const API_URL = `${config.API_BASE_URL}/api/bookings`;

class BookingService {
  /**
   * Submits a new booking
   * @param {Object} bookingData - The booking information
   * @returns {Promise<Object>} The created booking
   */
  static async submitBooking(bookingData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Booking submission error:', error);
      throw error;
    }
  }

  /**
   * Retrieves a booking by ID
   * @param {number} id - The booking ID
   * @returns {Promise<Object>} The booking details
   */
  static async getBookingById(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to retrieve booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Booking retrieval error:', error);
      throw error;
    }
  }

  /**
   * Retrieves all bookings for a specific user
   * @param {number} userId - The user ID
   * @returns {Promise<Array>} List of user's bookings
   */
  static async getBookingsByUser(userId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to retrieve user bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('User bookings retrieval error:', error);
      throw error;
    }
  }

  /**
   * Admin: Retrieves all bookings
   * @returns {Promise<Array>} List of all bookings
   */
  static async getAllBookings() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to retrieve all bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('All bookings retrieval error:', error);
      throw error;
    }
  }

  /**
   * Admin: Retrieves all pending bookings
   * @returns {Promise<Array>} List of pending bookings
   */
  static async getPendingBookings() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to retrieve pending bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Pending bookings retrieval error:', error);
      throw error;
    }
  }

  /**
   * Admin: Retrieves bookings by status and optional date range
   * @param {string} status - The booking status to filter by
   * @param {string} [startDate] - Optional start date for filtering
   * @param {string} [endDate] - Optional end date for filtering
   * @returns {Promise<Array>} List of filtered bookings
   */
  static async getBookingsByStatus(status, startDate = null, endDate = null) {
    try {
      const token = localStorage.getItem('token');
      let url = `${API_URL}/admin/status/${status}`;
      
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to retrieve bookings by status');
      }

      return await response.json();
    } catch (error) {
      console.error('Bookings by status retrieval error:', error);
      throw error;
    }
  }

  /**
   * Admin: Responds to a booking (confirm or decline)
   * @param {number} bookingId - The booking ID to respond to
   * @param {Object} responseData - The response data
   * @param {string} responseData.status - CONFIRMED or DECLINED
   * @param {string} responseData.message - Response message
   * @returns {Promise<Object>} The updated booking
   */
  // BookingService.js
static async respondToBooking(bookingId, responseData) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/${bookingId}/respond`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: responseData.status,
        message: responseData.message || ''  // Ensure message is never null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to respond to booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Booking response error:', error);
    throw error;
  }
}
}

export default BookingService;