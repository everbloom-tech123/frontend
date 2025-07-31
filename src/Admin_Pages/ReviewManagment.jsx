import React, { useState, useEffect } from 'react';
import ReviewService from '../services/reviewService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    status: 'approved'
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const data = await ReviewService.getAllReviews();
      console.log('Fetched reviews:', data);
      
      // Handle different response formats
      const reviewsArray = Array.isArray(data) ? data : (data.reviews || data.data || []);
      setReviews(reviewsArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to fetch reviews');
      toast.error('Error loading reviews: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await ReviewService.deleteReview(id);
      setReviews(reviews.filter(review => review.id !== id));
      toast.success('Review deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete review: ' + err.message);
    }
  };

  const handleSelectReview = (review) => {
    setSelectedReview(review);
    setFormData({
      rating: review.rating || 1,
      comment: review.comment || '',
      status: review.status ? review.status.toLowerCase() : 'approved'
    });
    setIsEditing(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const reviewToUpdate = reviews.find(review => review.id === id);
      if (!reviewToUpdate) {
        toast.error('Review not found');
        return;
      }

      const actionData = { 
        status: newStatus.toUpperCase(), // Backend expects "APPROVED" or "REJECTED"
        adminFeedback: reviewToUpdate.adminFeedback || '' // Optional feedback
      };
      
      console.log('Updating review status:', { id, actionData });
      const response = await ReviewService.processReview(id, actionData);
      console.log('Process review response:', response);
      
      // Update the local state immediately for better UX
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === id 
            ? { ...review, status: newStatus.toLowerCase() }
            : review
        )
      );
      
      toast.success(`Review ${newStatus.toLowerCase()} successfully`);
      
      // Optionally refetch to ensure consistency
      // await fetchAllReviews();
    } catch (err) {
      console.error('Update status error:', err);
      toast.error('Failed to update review status: ' + err.message);
      
      // Refetch on error to ensure UI consistency
      await fetchAllReviews();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    if (!selectedReview) {
      toast.error('No review selected');
      return;
    }

    try {
      console.log('Updating review:', { id: selectedReview.id, formData });
      
      const updatedReview = await ReviewService.updateReview(selectedReview.id, {
        rating: parseInt(formData.rating),
        comment: formData.comment
      });
      
      console.log('Updated review response:', updatedReview);
      
      // Update local state
      setReviews(reviews.map(review => 
        review.id === selectedReview.id 
          ? { 
              ...review, 
              rating: parseInt(formData.rating),
              comment: formData.comment,
              status: formData.status
            } 
          : review
      ));
      
      // If status was changed, update it separately
      if (formData.status !== (selectedReview.status || '').toLowerCase()) {
        await handleUpdateStatus(selectedReview.id, formData.status);
      }
      
      toast.success('Review updated successfully');
      setIsEditing(false);
      setSelectedReview(null);
    } catch (err) {
      console.error('Edit error:', err);
      toast.error('Failed to update review: ' + err.message);
    }
  };

  const filterReviews = () => {
    if (!Array.isArray(reviews)) return [];
    
    if (filter === 'all') return reviews;
    return reviews.filter(review => {
      const reviewStatus = (review.status || '').toLowerCase();
      return reviewStatus === filter.toLowerCase();
    });
  };

  const renderStatusBadge = (status) => {
    const normalizedStatus = (status || '').toLowerCase();
    let badgeText = '';
    let badgeClass = '';
    
    switch (normalizedStatus) {
      case 'approved':
        badgeText = 'APPROVED';
        badgeClass = 'text-green-600 bg-green-100';
        break;
      case 'pending':
        badgeText = 'PENDING';
        badgeClass = 'text-yellow-600 bg-yellow-100';
        break;
      case 'rejected':
        badgeText = 'REJECTED';
        badgeClass = 'text-red-600 bg-red-100';
        break;
      default:
        badgeText = (status || 'N/A').toUpperCase();
        badgeClass = 'text-gray-600 bg-gray-100';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {badgeText}
      </span>
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseInt(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`text-lg ${i <= numRating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    
    return (
      <div className="flex items-center">
        <span className="font-medium mr-2">{numRating}</span>
        <div className="flex">{stars}</div>
      </div>
    );
  };

  const filteredReviews = filterReviews();

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Review Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredReviews.length} {filter === 'all' ? 'total' : filter} reviews
          </p>
        </div>
        
        <div className="flex space-x-4">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button 
            onClick={fetchAllReviews}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md mb-6">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Reviews Table */}
        <div className={isEditing ? "lg:col-span-3" : "lg:col-span-5"}>
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b font-semibold text-sm text-gray-700">
              <div>User</div>
              <div>Product</div>
              <div>Rating</div>
              <div>Comment</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredReviews.length > 0 ? (
                filteredReviews.map(review => (
                  <div key={review.id} className="grid grid-cols-6 gap-4 p-4 items-start hover:bg-gray-50">
                    <div>
                      <div className="font-medium text-sm">
                        {review.user?.name || review.username || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {review.user?.email || review.userEmail || 'No email'}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        ID: {review.userId || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-medium">
                        {review.product?.title || review.productTitle || 'Unknown Product'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Product ID: {review.productId || 'N/A'}
                      </div>
                      {review.bookingId && (
                        <div className="text-xs text-gray-400">
                          Booking: {review.bookingId}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      {renderStars(review.rating)}
                    </div>
                    
                    <div className="text-sm">
                      <div className="max-w-xs">
                        {review.comment ? (
                          <p className="truncate" title={review.comment}>
                            {review.comment}
                          </p>
                        ) : (
                          <span className="text-gray-400 italic">No comment</span>
                        )}
                      </div>
                      {review.createdAt && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      {renderStatusBadge(review.status)}
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <button 
                        onClick={() => handleSelectReview(review)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      
                      {review.status?.toLowerCase() !== 'approved' && (
                        <button 
                          onClick={() => handleUpdateStatus(review.id, 'approved')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Approve
                        </button>
                      )}
                      
                      {review.status?.toLowerCase() !== 'rejected' && (
                        <button 
                          onClick={() => handleUpdateStatus(review.id, 'rejected')}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Reject
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-lg font-medium">No reviews found</p>
                  <p className="text-sm">
                    {filter !== 'all' 
                      ? `No ${filter} reviews to display.` 
                      : 'No reviews have been submitted yet.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Panel */}
        {isEditing && selectedReview && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Edit Review</h3>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedReview(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmitEdit} className="space-y-6">
                {/* Review Info */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-700">
                    User: {selectedReview.user?.name || selectedReview.username || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Product: {selectedReview.product?.title || selectedReview.productTitle || 'Unknown'}
                  </p>
                </div>
                
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={1}>1 - Poor</option>
                    <option value={2}>2 - Fair</option>
                    <option value={3}>3 - Good</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={5}>5 - Excellent</option>
                  </select>
                </div>
                
                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Comment
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter review comment..."
                  />
                </div>
                
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedReview(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;