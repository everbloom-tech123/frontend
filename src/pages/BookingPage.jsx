import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BookingService from '../services/BookingService';
import * as userService from '../services/userService';

const BookingPage = () => {
  // Navigation and authentication hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State management for user and form data
  const [currentUser, setCurrentUser] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    description: '',
    bookedDate: '' // Added field for date selection
  });

  // UI state management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  // Get experience details from navigation state
  const { experienceId, experienceDetails } = location.state || {};

  // Calculate date constraints for the date picker
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Debug logging for navigation state
  useEffect(() => {
    console.group('Navigation State Debug');
    console.log('Location State:', location.state);
    console.log('Experience ID:', experienceId);
    console.log('Experience Details:', experienceDetails);
    console.groupEnd();
  }, [location.state, experienceId, experienceDetails]);

  // Fetch user data and handle authentication
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !localStorage.getItem('token')) {
        console.log('Not authenticated, redirecting to signin');
        navigate('/signin', { state: { from: location.pathname } });
        return;
      }

      try {
        const userData = await userService.getCurrentUserProfile();
        console.log('Fetched user data:', userData);
        setCurrentUser(userData);
        setBookingData(prev => ({
          ...prev,
          name: userData.username || '',
          email: userData.email || ''
        }));
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/signin', { state: { from: location.pathname } });
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate, location.pathname]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate booking date
    if (!bookingData.bookedDate) {
      setError('Please select a booking date');
      setLoading(false);
      return;
    }

    // Validate authentication
    if (!localStorage.getItem('token') || !currentUser?.id) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    // Validate experience ID
    if (!experienceId) {
      setError('Experience ID is missing');
      setLoading(false);
      return;
    }

    try {
      const bookingPayload = {
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        description: bookingData.description,
        bookedDate: bookingData.bookedDate,
        productId: Number(experienceId),
        user: currentUser.id
      };

      // Debug logging for booking submission
      console.group('Booking Submission');
      console.log('Payload:', bookingPayload);
      console.log('Current User:', currentUser);
      console.log('Experience ID:', experienceId);
      console.groupEnd();

      const response = await BookingService.submitBooking(bookingPayload);
      console.log('Booking response:', response);
      
      setBookingResponse(response);
      setSuccess(true);
      setBookingData({
        name: '',
        phone: '',
        email: '',
        description: '',
        bookedDate: ''
      });
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  // Render error state if no experience details
  if (!experienceDetails || !experienceId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            No Experience Details Found
          </h2>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/experiences')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Experiences
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render success state after booking
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your booking for {experienceDetails.title} has been confirmed.
            </p>
            <p className="font-medium text-gray-800 mb-6">
              Booking ID: {bookingResponse?.id}
            </p>
            <button
              onClick={() => navigate('/experiences')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse More Experiences
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main booking form render
  return (
    <div className="container mx-auto px-4 pt-16 pb-8">
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{experienceDetails.title}</h1>
            <p className="text-gray-600">Complete your booking details below</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-medium mb-1">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Date
              </label>
              <input
                type="date"
                name="bookedDate"
                value={bookingData.bookedDate}
                onChange={handleInputChange}
                min={today}
                max={maxDateString}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
              <p className="text-sm text-gray-500">
                Please select a date within the next year
              </p>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={bookingData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={bookingData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={bookingData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Special Requests Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Special Requests
              </label>
              <textarea
                name="description"
                value={bookingData.description}
                onChange={handleInputChange}
                placeholder="Any special requirements or requests..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors min-h-32"
              />
            </div>

            {/* Debug Information */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-gray-100 rounded-lg text-sm font-mono">
                Debug Info:
                <br />
                Experience ID: {experienceId}
                <br />
                User ID: {currentUser?.id}
                <br />
                Selected Date: {bookingData.bookedDate}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-colors
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BookingPage;