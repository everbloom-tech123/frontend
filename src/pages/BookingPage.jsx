import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, AlertCircle, Clock } from 'lucide-react';
import CustomerInfoForm from '../components/booking/CustomerInfoForm';
import InquiryForm from '../components/booking/InquiryForm';
import BookingService from '../services/BookingService';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userEmail, experienceId, experienceDetails } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
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
      setIsSubmitting(false);
    }
  };

  const StepIndicator = ({ number, title, isActive, isCompleted }) => (
    <div className="flex items-center">
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          isActive
            ? 'bg-red-600 text-white'
            : isCompleted
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {isCompleted ? '✓' : number}
      </div>
      <span className={`ml-2 ${isActive ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
        {title}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <StepIndicator
              number={1}
              title="Experience Details"
              isActive={currentStep === 1}
              isCompleted={currentStep > 1}
            />
            <ChevronRight className="text-gray-400" />
            <StepIndicator
              number={2}
              title="Personal Information"
              isActive={currentStep === 2}
              isCompleted={currentStep > 2}
            />
            <ChevronRight className="text-gray-400" />
            <StepIndicator
              number={3}
              title="Additional Information"
              isActive={currentStep === 3}
              isCompleted={currentStep > 3}
            />
          </div>
        </div>

        {/* Experience Summary */}
        {experienceDetails && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-start space-x-6">
                {experienceDetails.imageUrl && (
                  <img
                    src={experienceDetails.imageUrl}
                    alt={experienceDetails.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {experienceDetails.title}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      ${experienceDetails.price}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {experienceDetails.duration || '2 hours'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {error && (
              <div className="p-4 bg-red-50">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Info Section */}
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h3>
              <CustomerInfoForm
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
              />
            </div>

            {/* Inquiry Section */}
            <div className="p-8 bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Additional Inquiry
              </h3>
              <InquiryForm
                inquiryData={inquiryData}
                setInquiryData={setInquiryData}
              />
            </div>

            {/* Submit Button */}
            <div className="p-8 bg-gray-50">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    inline-flex items-center px-8 py-3 border border-transparent
                    text-base font-medium rounded-lg shadow-sm text-white
                    bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2
                    focus:ring-offset-2 focus:ring-red-500 transition-colors
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;