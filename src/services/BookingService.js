import config from '../config';


class BookingService {
  static async submitBooking(bookingData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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

  static async sendInquiryEmail(inquiryData) {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to send inquiry');
    }
  }
}

export default BookingService; 