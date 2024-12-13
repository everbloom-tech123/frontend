import config from '../config';

const API_URL = `${config.API_BASE_URL}/api/bookings`;

class BookingService {
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
}

export default BookingService;