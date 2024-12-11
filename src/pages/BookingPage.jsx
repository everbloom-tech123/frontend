import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BookingService from '../services/BookingService';
import * as userService from '../services/userService';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const experienceDetails = location.state?.experienceDetails;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        navigate('/signin', { 
          state: { from: location.pathname }
        });
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
        if (err.message.includes('401') || err.message.includes('403')) {
          navigate('/signin', { 
            state: { from: location.pathname }
          });
        }
        setError('Failed to load user data. Please try again.');
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

  const resetToDefaultEmail = () => {
    if (currentUser?.email) {
      setBookingData(prev => ({
        ...prev,
        email: currentUser.email
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!currentUser?.id) {
      setError('User data not available. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const bookingPayload = {
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        description: bookingData.description,
        user: { id: currentUser.id },
        product: { id: experienceDetails.id },
        status: 'PENDING'
      };

      console.log('Submitting booking payload:', bookingPayload);
      const response = await BookingService.submitBooking(bookingPayload);
      console.log('Booking response:', response);
      
      navigate('/booking-confirmation', { 
        state: { 
          bookingDetails: response,
          experienceDetails: experienceDetails
        }
      });
    } catch (err) {
      console.error('Booking error:', err);
      if (err.message.includes('403')) {
        setError('You are not authorized to make this booking. Please log in again.');
      } else {
        setError(err.message || 'Failed to submit booking. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!experienceDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">No experience details found</h2>
          <button
            onClick={() => navigate('/experiences')}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Back to Experiences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Book Your Experience</h1>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{experienceDetails.title}</h2>
              {experienceDetails.imageUrl && (
                <img 
                  src={experienceDetails.imageUrl} 
                  alt={experienceDetails.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={bookingData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    placeholder="Enter your full name"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    placeholder="Enter your phone number"
                    pattern="[0-9]*"
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {currentUser?.email && bookingData.email !== currentUser.email && (
                  <button
                    type="button"
                    onClick={resetToDefaultEmail}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Reset to my account email
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="description"
                  value={bookingData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Any special requirements or requests..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <p className="text-sm text-gray-600">Experience: {experienceDetails.title}</p>
                {experienceDetails.price && (
                  <p className="text-sm text-gray-600">Price: ${experienceDetails.price}</p>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  Status: <span className="font-medium text-yellow-600">Pending Confirmation</span>
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Back to Experience
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <span className="mr-2">Processing</span>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    'Submit Booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;