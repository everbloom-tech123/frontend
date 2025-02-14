import config from '../config';

// Base URL for all booking-related API endpoints
const API_URL = `${config.API_BASE_URL}/api/bookings`;

class BookingService {
  /**
   * Submits a new booking to the backend server
   * @param {Object} bookingData - The booking information
   * @param {string} bookingData.name - Customer's name
   * @param {string} bookingData.phone - Contact phone number
   * @param {string} bookingData.email - Contact email address
   * @param {string} bookingData.description - Additional booking details or special requests
   * @param {string} bookingData.bookedDate - The requested date for the booking
   * @param {number} bookingData.productId - ID of the product being booked
   * @param {number} bookingData.user - ID of the user making the booking
   * @returns {Promise<Object>} The created booking object from the server
   * @throws {Error} If the booking submission fails
   */
  static async submitBooking(bookingData) {
    try {
      // Get the authentication token from local storage
      const token = localStorage.getItem('token');
      
      // Prepare the booking data including the new bookedDate field
      const bookingPayload = {
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        description: bookingData.description,
        bookedDate: bookingData.bookedDate, // Include the booked date in the request
        productId: bookingData.productId,
        user: bookingData.user
      };

      // Make the API request to create the booking
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingPayload),
      });

      // Handle non-successful responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit booking');
      }

      // Parse and return the successful response
      return await response.json();
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Booking submission error:', error);
      // Re-throw the error to be handled by the calling component
      throw error;
    }
  }

  /**
   * Retrieves a booking by its ID
   * @param {number} id - The booking ID to retrieve
   * @returns {Promise<Object>} The booking details
   * @throws {Error} If the booking retrieval fails
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
   * @param {number} userId - The ID of the user whose bookings to retrieve
   * @returns {Promise<Object>} The user's booking details
   * @throws {Error} If the booking retrieval fails
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
}

export default BookingService;