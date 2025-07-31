import config from '../config';

const API_URL = `${config.API_BASE_URL}/api/bookings`;

class BookingService {
  /**
   * Submits a new booking with multiple products
   * @param {Object} bookingData - The booking information
   * @param {string} bookingData.name - Customer name
   * @param {string} bookingData.phone - Customer phone
   * @param {string} bookingData.email - Customer email
   * @param {string} bookingData.description - Booking description
   * @param {string} bookingData.bookedDate - Booking date
   * @param {number} bookingData.user - User ID
   * @param {Array} bookingData.bookingDetails - Array of booking details
   * @param {number} bookingData.bookingDetails[].productId - Product ID
   * @param {string} bookingData.bookingDetails[].productName - Product name
   * @param {number} bookingData.bookingDetails[].quantity - Quantity
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
        body: JSON.stringify({
          name: bookingData.name,
          phone: bookingData.phone,
          email: bookingData.email,
          description: bookingData.description || '',
          bookedDate: bookingData.bookedDate,
          user: bookingData.user,
          bookingDetails: bookingData.bookingDetails.map(detail => ({
            productId: detail.productId,
            productName: detail.productName,
            quantity: detail.quantity
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit booking');
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
        throw new Error(errorData.error || 'Failed to retrieve booking');
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
        throw new Error(errorData.error || 'Failed to retrieve user bookings');
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
        const text = await response.text();
        let errorMessage = 'Failed to retrieve all bookings';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError, text);
        }
        throw new Error(errorMessage);
      }

      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        console.log('Response text:', text.substring(0, 200) + '...');
        throw new Error('Invalid JSON response from server');
      }
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
        const text = await response.text();
        let errorMessage = 'Failed to retrieve pending bookings';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError, text);
        }
        throw new Error(errorMessage);
      }

      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        console.log('Response text:', text.substring(0, 200) + '...');
        throw new Error('Invalid JSON response from server');
      }
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
        const text = await response.text();
        let errorMessage = 'Failed to retrieve bookings by status';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError, text);
        }
        throw new Error(errorMessage);
      }

      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        console.log('Response text:', text.substring(0, 200) + '...');
        throw new Error('Invalid JSON response from server');
      }
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
          message: responseData.message.trim() || 'No message provided'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to respond to booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Booking response error:', error);
      throw error;
    }
  }
}

export default BookingService;