import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BookingService from '../services/BookingService';
import * as userService from '../services/userService';
import { Check, Lock } from 'lucide-react';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    description: '',
    bookedDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  // Date constraints
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Load cart items and user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !localStorage.getItem('token')) {
        navigate('/signin', { state: { from: location.pathname } });
        return;
      }

      try {
        const userData = await userService.getCurrentUserProfile();
        setCurrentUser(userData);
        setBookingData(prev => ({
          ...prev,
          name: userData.username || '',
          email: userData.email || ''
        }));

        // Load cart items
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (storedCartItems.length === 0) {
          setError('Your cart is empty');
          return;
        }
        setCartItems(storedCartItems);
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

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    // Validate inputs
    if (!bookingData.bookedDate) {
      setError('Please select a booking date');
      setLoading(false);
      return;
    }
    if (!bookingData.name || !bookingData.phone || !bookingData.email) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return;
    }
    if (!currentUser?.id) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    try {
      const bookingPayload = {
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        description: bookingData.description,
        bookedDate: bookingData.bookedDate,
        user: currentUser.id,
        bookingDetails: cartItems.map(item => ({
          productId: item.id,
          productName: item.title,
          quantity: item.quantity
        }))
      };

      console.group('Booking Submission');
      console.log('Payload:', bookingPayload);
      console.groupEnd();

      const response = await BookingService.submitBooking(bookingPayload);
      setBookingResponse(response);
      setSuccess(true);

      // Clear cart after successful booking
      localStorage.removeItem('cartItems');
      setCartItems([]);
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

  // Render error state if cart is empty
  if (cartItems.length === 0 && !loading && error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 mx-auto">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Your Cart is Empty
          </h2>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/viewall')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse Experiences
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render success state
  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Successful!</h2>
            <p className="text-black mb-4">
              Your booking has been submitted and is pending confirmation.
            </p>
            <p className="font-medium text-black mb-8">
              Booking ID: {bookingResponse?.id}
            </p>
            <button
              onClick={() => navigate('/viewall')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
    <div className="min-h-screen bg-white pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-20">
        <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold mb-2 text-black">
  Complete Your Booking
</h2>

<p className="text-black text-sm font-bold">
  Just a few more details to secure your amazing experience!
</p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Information */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-white rounded-xl shadow-lg border border-black p-8 flex-1">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h3 className="text-xl font-semibold text-black">Your Information</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2 flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      Full name <span className="text-red-600 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-black rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all duration-200 hover:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2 flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                      Email address <span className="text-red-600 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-black rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all duration-200 hover:border-red-600"
                    />
                  </div>
                </div>

                {/* Phone and Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2 flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      Phone number <span className="text-red-600 ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-black rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all duration-200 hover:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Experience Date <span className="text-red-600 ml-1">*</span>
                    </label>
                    <input
                      type="date"
                      name="bookedDate"
                      value={bookingData.bookedDate}
                      onChange={handleInputChange}
                      min={today}
                      max={maxDateString}
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-black rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all duration-200 hover:border-red-600"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={bookingData.description}
                    onChange={handleInputChange}
                    placeholder="Any special requirements or requests..."
                    rows="4"
                    className="w-full px-4 py-3 text-sm border-2 border-black rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none resize-none transition-all duration-200 hover:border-red-600"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-100 border-2 border-red-600 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Cart Review */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h3 className="text-xl font-semibold text-black">Order Summary</h3>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-black p-8 flex-1">
              {/* Cart Items */}
              <div className="space-y-6 mb-8">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 rounded-lg bg-white border border-black hover:shadow-md transition-all duration-200">
                    <div className="w-24 h-24 bg-red-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || `https://via.placeholder.com/96x96?text=${encodeURIComponent(item.title.substring(0, 2))}`}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-black text-sm leading-5 mb-2">{item.title}</h4>
                      <p className="text-xs text-black bg-white px-2 py-1 rounded-full inline-block">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-red-600 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t-2 border-black pt-6 space-y-4 bg-white p-4 rounded-lg">
                <div className="flex justify-between text-black text-sm font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-4 border-t-2 border-black text-red-600">
                  <span>Total</span>
                  <span className="text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Confirm Booking Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full mt-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                  loading
                    ? 'bg-black text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                }`}
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

              {/* Security Notice */}
              <div className="mt-6 flex items-center justify-center text-xs text-black bg-white p-3 rounded-lg border border-black">
                <Lock className="w-4 h-4 mr-2 text-red-600" />
                <span className="font-medium text-red-600">Secure Checkout - SSL Encrypted</span>
              </div>
              <p className="text-center text-xs text-black mt-2">
                Your financial and personal details are secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;