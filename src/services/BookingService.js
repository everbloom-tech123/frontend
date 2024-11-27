import config from '../config';

class BookingService {
  static async submitBooking(bookingData) {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to submit booking');
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