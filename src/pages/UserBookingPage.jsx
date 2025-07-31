import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as userService from '../services/userService';
import BookingService from '../services/BookingService';
import ReviewService from '../services/reviewService';
import ReviewModal from '../components/ReviewModal';
import ReviewButton from '../components/ReviewButton';

const UserBookingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    bookingId: null,
    productId: null,
    experienceTitle: '',
    isEditMode: false,
    existingReview: null,
    reviewStatus: null
  });

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchUserDataAndBookings();
    } else if (activeTab === 'reviews') {
      fetchUserDataAndReviews();
    }
  }, [isAuthenticated, navigate, location.pathname, activeTab]);

  const fetchUserDataAndBookings = async () => {
    if (!isAuthenticated || !localStorage.getItem('token')) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    try {
      setLoading(true);
      const userData = await userService.getCurrentUserProfile();
      setCurrentUser(userData);

      if (userData && userData.id) {
        const userBookings = await BookingService.getBookingsByUser(userData.id);
        setBookings(userBookings);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch your data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDataAndReviews = async () => {
    if (!isAuthenticated || !localStorage.getItem('token')) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    try {
      setLoading(true);
      const userData = await userService.getCurrentUserProfile();
      setCurrentUser(userData);

      const userReviews = await ReviewService.getMyReviews();
      setReviews(userReviews);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch your data');
    } finally {
      setLoading(false);
    }
  };

  const refreshBookings = async () => {
    try {
      if (currentUser && currentUser.id) {
        const userBookings = await BookingService.getBookingsByUser(currentUser.id);
        setBookings(userBookings);
      }
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    }
  };

  const refreshReviews = async () => {
    try {
      const userReviews = await ReviewService.getMyReviews();
      setReviews(userReviews);
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  const openReviewModal = (bookingId, productId, experienceTitle, existingReview = null, reviewStatus = null) => {
    setReviewModal({
      isOpen: true,
      bookingId,
      productId,
      experienceTitle,
      isEditMode: !!existingReview,
      existingReview,
      reviewStatus
    });
  };

  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      bookingId: null,
      productId: null,
      experienceTitle: '',
      isEditMode: false,
      existingReview: null,
      reviewStatus: null
    });
  };

  const submitReview = async (reviewData) => {
    if (!reviewModal.bookingId) {
      console.error('Missing booking ID');
      return;
    }

    if (!reviewModal.productId) {
      console.error('Missing product ID');
      return;
    }

    try {
      const reviewPayload = reviewModal.isEditMode
        ? {
            rating: reviewData.rating,
            comment: reviewData.comment
          }
        : {
            bookingId: reviewModal.bookingId,
            productId: reviewModal.productId,  // ✅ FIXED: Include productId
            rating: reviewData.rating,
            comment: reviewData.comment
          };

      let response;
      if (reviewModal.isEditMode && reviewModal.existingReview?.id) {
        response = await ReviewService.updateReview(reviewModal.existingReview.id, reviewPayload);
      } else {
        response = await ReviewService.createReview(reviewPayload);
      }

      await refreshBookings();
      alert(reviewModal.isEditMode ? 'Review updated successfully!' : 'Review submitted successfully!');
      return response;
    } catch (error) {
      console.error('Error with review:', error);
      alert('Failed to process review. Please try again.');
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) return;

    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await ReviewService.deleteReview(reviewId);
        await refreshReviews();
        alert('Review deleted successfully!');
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to render booked experiences for both new and old structure
  const renderBookedExperiences = (booking) => {
    // Check if booking has the new structure (bookingDetails array)
    if (booking.bookingDetails && booking.bookingDetails.length > 0) {
      return booking.bookingDetails.map((detail, index) => (
        <div key={index} className="mt-2 p-3 border rounded">
          <p className="font-medium">{detail.productName}</p>
          <p className="text-sm text-gray-500">Quantity: {detail.quantity}</p>
          <ReviewButton
            onClick={() =>
              openReviewModal(
                booking.id,
                detail.productId,  // ✅ FIXED: Use correct productId field
                detail.productName
              )
            }
            hasReview={false} // Add logic if reviews are tracked
            reviewStatus={null}
            disabled={booking.status?.toLowerCase() !== 'confirmed'}
          />
        </div>
      ));
    }
    
    // Fallback to old structure (single product)
    if (booking.productId && booking.productName) {
      return (
        <div className="mt-2 p-3 border rounded">
          <p className="font-medium">{booking.productName}</p>
          <p className="text-sm text-gray-500">Quantity: 1</p>
          <ReviewButton
            onClick={() =>
              openReviewModal(
                booking.id,
                booking.productId,
                booking.productName
              )
            }
            hasReview={false}
            reviewStatus={null}
            disabled={booking.status?.toLowerCase() !== 'confirmed'}
          />
        </div>
      );
    }
    
    // No product information available
    return (
      <div className="mt-2 p-3 border rounded bg-gray-50">
        <p className="text-gray-500">No experience details available</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {reviewModal.isOpen && (
        <ReviewModal
          isOpen={reviewModal.isOpen}
          onClose={closeReviewModal}
          onSubmit={submitReview}
          experienceTitle={reviewModal.experienceTitle}
          isEditMode={reviewModal.isEditMode}
          existingReview={reviewModal.existingReview}
          reviewStatus={reviewModal.reviewStatus}
        />
      )}

      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Travel Dashboard</h1>
          <p className="text-gray-600">Manage your bookings and reviews in one place</p>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Bookings
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Reviews
            </button>
          </nav>
        </div>

        <div className="mb-4">
          <button 
            onClick={activeTab === 'bookings' ? refreshBookings : refreshReviews}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>

            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">You don't have any bookings yet.</p>
                <button 
                  onClick={() => navigate('/viewall')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Explore Experiences
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">Booking #{booking.id}</h3>
                        <div className="flex items-center mt-2">
                          <span className="text-gray-600 mr-2">Status: </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status || 'Processing'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right text-sm text-gray-500">
                        <div className="mb-1">
                          <div className="font-medium">Booked on</div>
                          <div>{formatDate(booking.createdAt)}</div>
                        </div>

                        {booking.bookedDate && (
                          <div>
                            <div className="font-medium">Scheduled for</div>
                            <div>{booking.bookedDate}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-3">Booked Experiences</h4>
                      {renderBookedExperiences(booking)}
                    </div>

                    {booking.description && (
                      <div className="mb-4 p-3 bg-gray-50 rounded">
                        <div className="font-medium text-gray-700 mb-1">Your Request:</div>
                        <p className="text-gray-600">{booking.description}</p>
                      </div>
                    )}

                    {booking.adminResponse && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="font-medium text-blue-800 mb-1">Response:</div>
                        <p className="text-blue-700">{booking.adminResponse}</p>
                        {booking.respondedAt && (
                          <p className="text-sm text-blue-600 mt-1">
                            Responded on: {formatDate(booking.respondedAt)}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      {['confirmed', 'pending'].includes(booking.status?.toLowerCase()) && (
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Reviews</h2>

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">You haven't submitted any reviews yet.</p>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Go to Bookings
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{review.productTitle || 'Experience'}</h3>
                        <div className="flex items-center mt-2">
                          <div className="text-yellow-500 mr-2">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                          <span className="text-gray-600">Rating: {review.rating}/5</span>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(review.status)}`}>
                        Status: {review.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      {review.comment && (
                        <div className="mb-3 p-3 bg-gray-50 rounded">
                          <p className="italic">"{review.comment}"</p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500 space-y-1">
                        {review.createdAt && (
                          <div>
                            <span className="font-medium">Submitted:</span> {formatDate(review.createdAt)}
                          </div>
                        )}

                        {review.updatedAt && review.createdAt !== review.updatedAt && (
                          <div>
                            <span className="font-medium">Updated:</span> {formatDate(review.updatedAt)}
                          </div>
                        )}
                      </div>

                      {review.status?.toLowerCase() === 'rejected' && review.adminFeedback && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="font-medium text-red-800 mb-1">Feedback from admin:</p>
                          <p className="text-red-700">{review.adminFeedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={review.status?.toLowerCase() === 'approved'}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          review.status?.toLowerCase() === 'approved'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        Delete Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookingsPage;