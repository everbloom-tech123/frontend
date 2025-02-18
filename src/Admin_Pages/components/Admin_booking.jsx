import React, { useState, useEffect } from 'react';
import BookingService from '../../services/BookingService';

const BookingManagement = () => {
  // State management
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Fetch bookings based on active tab
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      switch (activeTab) {
        case 'pending':
          result = await BookingService.getPendingBookings();
          break;
        case 'confirmed':
          result = await BookingService.getBookingsByStatus('CONFIRMED', 
            dateRange.startDate, 
            dateRange.endDate);
          break;
        case 'declined':
          result = await BookingService.getBookingsByStatus('DECLINED',
            dateRange.startDate, 
            dateRange.endDate);
          break;
        default:
          result = await BookingService.getAllBookings();
      }
      setBookings(result);
    } catch (err) {
      showNotification(err.message, 'error');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab, dateRange]);

  const handleResponse = async (status) => {
    if (!responseMessage.trim()) {
      showNotification('Please provide a response message', 'error');
      return;
    }

    setLoading(true);
    try {
      await BookingService.respondToBooking(selectedBooking.id, {
        status,
        message: responseMessage.trim()
      });
      setShowResponseModal(false);
      setResponseMessage('');
      fetchBookings();
      showNotification('Response sent successfully', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000);
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'DECLINED': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          {['all', 'pending', 'confirmed', 'declined'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.product.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.bookedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.status === 'PENDING' && (
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowResponseModal(true);
                        }}
                      >
                        Respond
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Respond to Booking</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Message
                </label>
                <textarea
                  className="w-full border rounded-lg p-2"
                  rows="4"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Enter your response message..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                  onClick={() => setShowResponseModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                  onClick={() => handleResponse('DECLINED')}
                >
                  Decline
                </button>
                <button
                  className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                  onClick={() => handleResponse('CONFIRMED')}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div 
          className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-50`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;