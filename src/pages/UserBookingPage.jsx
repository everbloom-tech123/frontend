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

    try {
      const reviewPayload = reviewModal.isEditMode
        ? {
            rating: reviewData.rating,
            comment: reviewData.comment
          }
        : {
            bookingId: reviewModal.bookingId,
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
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

      <div>
        <div>
          <h1>My Travel Dashboard</h1>
          <p>Manage your bookings and reviews in one place</p>
        </div>

        <div>
          <button onClick={() => setActiveTab('bookings')}>
            My Bookings
          </button>
          <button onClick={() => setActiveTab('reviews')}>
            My Reviews
          </button>
        </div>

        <div>
          <button onClick={activeTab === 'bookings' ? refreshBookings : refreshReviews}>
            Refresh Data
          </button>
        </div>

        {activeTab === 'bookings' && (
          <div>
            <h2>My Bookings</h2>

            {bookings.length === 0 ? (
              <div>
                <p>You don't have any bookings yet.</p>
                <button onClick={() => navigate('/viewall')}>
                  Explore Experiences
                </button>
              </div>
            ) : (
              <div>
                {bookings.map((booking) => (
                  <div key={booking.id}>
                    <div>
                      <div>
                        <h3>Booking #{booking.id}</h3>
                        <div>
                          <span>Status: </span>
                          <span className={`px-2 py-1 rounded ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status || 'Processing'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div>Booked on</div>
                        <div>{formatDate(booking.createdAt)}</div>

                        {booking.bookedDate && (
                          <div>
                            <div>Scheduled for</div>
                            <div>{booking.bookedDate}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold">Booked Experiences</h4>
                      {booking.bookingDetails?.map((detail, index) => (
                        <div key={index} className="mt-2">
                          <p>{detail.productName}</p>
                          <p className="text-sm text-gray-500">Quantity: {detail.quantity}</p>
                          <ReviewButton
                            onClick={() =>
                              openReviewModal(
                                booking.id,
                                detail.product?.id || detail.productId,
                                detail.productName
                              )
                            }
                            hasReview={false} // Add logic if reviews are tracked
                            reviewStatus={null}
                            disabled={booking.status?.toLowerCase() !== 'confirmed'}
                          />
                        </div>
                      ))}
                    </div>

                    {booking.description && (
                      <div>
                        <div>Your Request:</div>
                        <p>{booking.description}</p>
                      </div>
                    )}

                    {booking.adminResponse && (
                      <div>
                        <div>Response:</div>
                        <p>{booking.adminResponse}</p>
                        {booking.respondedAt && (
                          <p>
                            Responded on: {formatDate(booking.respondedAt)}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      {['confirmed', 'pending'].includes(booking.status?.toLowerCase()) && (
                        <button>
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
            <h2>My Reviews</h2>

            {reviews.length === 0 ? (
              <div>
                <p>You haven't submitted any reviews yet.</p>
                <button onClick={() => setActiveTab('bookings')}>
                  Go to Bookings
                </button>
              </div>
            ) : (
              <div>
                {reviews.map((review) => (
                  <div key={review.id}>
                    <div>
                      <div>
                        <h3>{review.productTitle || 'Experience'}</h3>
                        <div>
                          <div>Rating: {review.rating}/5</div>
                        </div>
                      </div>

                      <span>Status: {review.status}</span>
                    </div>

                    <div>
                      {review.comment && (
                        <div>
                          <p>"{review.comment}"</p>
                        </div>
                      )}

                      <div>
                        {review.createdAt && (
                          <div>
                            Submitted: {formatDate(review.createdAt)}
                          </div>
                        )}

                        {review.updatedAt && review.createdAt !== review.updatedAt && (
                          <div>
                            Updated: {formatDate(review.updatedAt)}
                          </div>
                        )}
                      </div>

                      {review.status?.toLowerCase() === 'rejected' && review.adminFeedback && (
                        <div>
                          <p>Feedback from admin:</p>
                          <p>{review.adminFeedback}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={review.status?.toLowerCase() === 'approved'}
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