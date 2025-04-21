import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as userService from '../services/userService';
import ReviewService from '../services/reviewService';
import ReviewModal from '../components/ReviewModel';
import ReviewButton from '../components/ReviewButton';

const UserBookingsPage = () => {
  // Navigation and authentication hooks
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

  // Fetch user data and bookings on component mount
  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchUserDataAndBookings();
    } else if (activeTab === 'reviews') {
      fetchUserDataAndReviews();
    }
  }, [isAuthenticated, navigate, location.pathname, activeTab]);

  // Modified to only fetch user data and bookings without reviews
  const fetchUserDataAndBookings = async () => {
    if (!isAuthenticated || !localStorage.getItem('token')) {
      console.log('Not authenticated, redirecting to signin');
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    try {
      setLoading(true);
      // Fetch current user profile
      const userData = await userService.getCurrentUserProfile();
      setCurrentUser(userData);
      
      // Fetch user bookings
      if (userData && userData.id) {
        const userBookings = await fetchUserBookings(userData.id);
        setBookings(userBookings);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch your data');
    } finally {
      setLoading(false);
    }
  };
  
  // New function to fetch user data and reviews
  const fetchUserDataAndReviews = async () => {
    if (!isAuthenticated || !localStorage.getItem('token')) {
      console.log('Not authenticated, redirecting to signin');
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    try {
      setLoading(true);
      // Fetch current user profile
      const userData = await userService.getCurrentUserProfile();
      setCurrentUser(userData);
      
      // Fetch all reviews by this user
      const userReviews = await ReviewService.getMyReviews();
      setReviews(userReviews);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch your data');
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh bookings
  const refreshBookings = async () => {
    try {
      if (currentUser && currentUser.id) {
        const userBookings = await fetchUserBookings(currentUser.id);
        setBookings(userBookings);
      }
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    }
  };

  // Function to refresh reviews
  const refreshReviews = async () => {
    try {
      const userReviews = await ReviewService.getMyReviews();
      setReviews(userReviews);
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  // Function to fetch user bookings
  const fetchUserBookings = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/bookings/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  };
  
  // Handle opening the review modal - modified to NOT fetch review details
  const openReviewModal = (bookingId, productId, experienceTitle, existingReview = null, reviewStatus = null) => {
    // In bookings tab, we don't need to fetch review details
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
  
  // Handle closing the review modal
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
  
  // Handle review submission (for both create and update)
  const submitReview = async (reviewData) => {
    if (!reviewModal.bookingId) {
      console.error('Missing booking ID');
      return;
    }
    
    try {
      // Prepare review data for API
      const reviewPayload = reviewModal.isEditMode
        ? {
            // For updating an existing review
            rating: reviewData.rating,
            comment: reviewData.comment
          }
        : {
            // For creating a new review
            bookingId: reviewModal.bookingId,
            rating: reviewData.rating,
            comment: reviewData.comment
          };
      
      let response;
      
      // If editing an existing review
      if (reviewModal.isEditMode && reviewModal.existingReview?.id) {
        response = await ReviewService.updateReview(reviewModal.existingReview.id, reviewPayload);
      } else {
        // Creating a new review
        response = await ReviewService.createReview(reviewPayload);
      }
      
      // Refresh bookings after submitting a review to ensure UI reflects the change
      await refreshBookings();
      
      alert(reviewModal.isEditMode ? 'Review updated successfully!' : 'Review submitted successfully!');
      return response;
    } catch (error) {
      console.error('Error with review:', error);
      alert('Failed to process review. Please try again.');
      throw error;
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) return;
    
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await ReviewService.deleteReview(reviewId);
        // Refresh reviews after deletion
        await refreshReviews();
        alert('Review deleted successfully!');
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
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
      {/* Review Modal */}
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
        {/* Page Header */}
        <div>
          <h1>My Travel Dashboard</h1>
          <p>Manage your bookings and reviews in one place</p>
        </div>
        
        {/* Tabs Navigation */}
        <div>
          <button onClick={() => setActiveTab('bookings')}>
            My Bookings
          </button>
          <button onClick={() => setActiveTab('reviews')}>
            My Reviews
          </button>
        </div>
        
        {/* Refresh Button */}
        <div>
          <button onClick={activeTab === 'bookings' ? refreshBookings : refreshReviews}>
            Refresh Data
          </button>
        </div>
        
        {/* Bookings Tab Content */}
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
                        <h3>{booking.product?.title || 'Experience'}</h3>
                        <div>
                          <span>Booking ID: #{booking.id}</span>
                          <span>Status: {booking.status || 'Processing'}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div>Booked on</div>
                        <div>{formatDate(booking.createdAt)}</div>
                        
                        {booking.scheduledDate && (
                          <div>
                            <div>Scheduled for</div>
                            <div>{formatDate(booking.scheduledDate)}</div>
                          </div>
                        )}
                      </div>
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
                      <ReviewButton 
                        onClick={() => openReviewModal(
                          booking.id, 
                          booking.product?.id, 
                          booking.product?.title || 'Experience'
                        )}
                        hasReview={false} // We don't know if it has a review in bookings tab
                        reviewStatus={null}
                        disabled={booking.status?.toLowerCase() !== 'confirmed' && 
                                 booking.status?.toLowerCase() !== 'pending'}
                      />
                      
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
        
        {/* Reviews Tab Content */}
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