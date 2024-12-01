import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomerInfoForm from '../components/booking/CustomerInfoForm';
import InquiryForm from '../components/booking/InquiryForm';
import BookingService from '../services/BookingService';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userEmail, experienceId } = location.state || {};

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [inquiryData, setInquiryData] = useState({
    subject: '',
    message: '',
  });

  useEffect(() => {
    // Redirect if no user data is present
    if (!userId || !userEmail || !experienceId) {
      navigate('/viewall');
    }
  }, [userId, userEmail, experienceId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit booking data
      const bookingData = {
        userId,
        userEmail,
        experienceId,
        customerInfo,
      };
      await BookingService.submitBooking(bookingData);

      // Send inquiry email if there's a message
      if (inquiryData.subject || inquiryData.message) {
        const emailData = {
          ...inquiryData,
          userEmail,
          experienceId,
        };
        await BookingService.sendInquiryEmail(emailData);
      }

      // Redirect to success page
      navigate('/booking-success');
    } catch (error) {
      console.error('Booking failed:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="booking-page">
      <h2>Book Your Experience</h2>
      <form onSubmit={handleSubmit}>
        <CustomerInfoForm 
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
        />
        
        <InquiryForm 
          inquiryData={inquiryData}
          setInquiryData={setInquiryData}
        />

        <button type="submit" className="submit-button">
          Complete Booking
        </button>
      </form>
    </div>
  );
};

export default BookingPage; 