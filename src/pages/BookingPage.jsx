import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BookingService from '../services/BookingService';
import * as userService from '../services/userService';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  const { experienceId, experienceDetails } = location.state || {};

  useEffect(() => {
    console.group('Navigation State Debug');
    console.log('Location State:', location.state);
    console.log('Experience ID:', experienceId);
    console.log('Experience Details:', experienceDetails);
    console.groupEnd();
  }, [location.state, experienceId, experienceDetails]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!localStorage.getItem('token') || !currentUser?.id) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

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
        productId: Number(experienceId),
        user: currentUser.id
      };

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
        description: ''
      });
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

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

  return (
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

            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-gray-100 rounded-lg text-sm font-mono">
                Debug Info:
                <br />
                Experience ID: {experienceId}
                <br />
                User ID: {currentUser?.id}
              </div>
            )}

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
  );
};

export default BookingPage;