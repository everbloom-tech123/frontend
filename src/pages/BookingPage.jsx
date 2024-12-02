import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomerInfoForm from '../components/booking/CustomerInfoForm';
import InquiryForm from '../components/booking/InquiryForm';
import BookingService from '../services/BookingService';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userEmail, experienceId, experienceDetails } = location.state || {};

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [inquiryData, setInquiryData] = useState({
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !userEmail || !experienceId) {
      navigate('/viewall');
    }
  }, [userId, userEmail, experienceId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const bookingData = {
        userId,
        userEmail,
        experienceId,
        customerInfo,
      };
      await BookingService.submitBooking(bookingData);

      if (inquiryData.subject || inquiryData.message) {
        const emailData = {
          ...inquiryData,
          userEmail,
          experienceId,
        };
        await BookingService.sendInquiryEmail(emailData);
      }

      navigate('/booking-success');
    } catch (error) {
      console.error('Booking failed:', error);
      setError('Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Book Your Experience
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Complete your booking details below
          </p>
        </div>

        {/* Experience Summary Card */}
        {experienceDetails && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-4">
              {experienceDetails.imageUrl && (
                <img 
                  src={experienceDetails.imageUrl} 
                  alt={experienceDetails.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {experienceDetails.title}
                </h2>
                <p className="text-lg font-medium text-red-600">
                  ${experienceDetails.price}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8 p-8">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Info Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Personal Information
              </h3>
              <CustomerInfoForm 
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
              />
            </div>

            {/* Inquiry Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Additional Inquiry
              </h3>
              <InquiryForm 
                inquiryData={inquiryData}
                setInquiryData={setInquiryData}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  inline-flex items-center px-6 py-3 border border-transparent 
                  text-base font-medium rounded-md shadow-sm text-white 
                  bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-red-500
                  ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Complete Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 