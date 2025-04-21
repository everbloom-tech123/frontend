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
      setReviews(data);
      setError(null);
    } catch (err) {
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
      toast.error('Failed to delete review: ' + err.message);
    }
  };

  const handleSelectReview = (review) => {
    setSelectedReview(review);
    setFormData({
      rating: review.rating,
      comment: review.comment || '',
      status: review.status || 'approved'
    });
    setIsEditing(true);
  };

  // ReviewManagement.jsx
const handleUpdateStatus = async (id, newStatus) => {
  try {
    const reviewToUpdate = reviews.find(review => review.id === id);
    const actionData = { 
      status: newStatus.toUpperCase(), // Backend expects "APPROVED" or "REJECTED"
      adminFeedback: reviewToUpdate.adminFeedback || '' // Optional feedback
    };
    
    const response = await ReviewService.processReview(id, actionData);
    console.log('Process review response:', response);
    
    // Refetch reviews to ensure UI matches server state
    await fetchAllReviews();
    toast.success(`Review ${newStatus.toLowerCase()} successfully`);
  } catch (err) {
    console.error('Update error:', err);
    toast.error('Failed to update review status: ' + err.message);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await ReviewService.updateReview(selectedReview.id, formData);
      setReviews(reviews.map(review => 
        review.id === selectedReview.id ? { ...review, ...formData } : review
      ));
      toast.success('Review updated successfully');
      setIsEditing(false);
      setSelectedReview(null);
    } catch (err) {
      toast.error('Failed to update review: ' + err.message);
    }
  };

  const filterReviews = () => {
    if (filter === 'all') return reviews;
    return reviews.filter(review => review.status === filter);
  };

  const renderStatusBadge = (status) => {
    let badgeText = status;
    let badgeClass = '';
    
    switch (status) {
      case 'approved':
        badgeText = 'APPROVED';
        badgeClass = 'text-green-600';
        break;
      case 'pending':
        badgeText = 'PENDING';
        badgeClass = 'text-yellow-600';
        break;
      case 'rejected':
        badgeText = 'REJECTED';
        badgeClass = 'text-red-600';
        break;
      default:
        badgeText = status?.toUpperCase() || 'N/A';
    }
    
    return (
      <span className={`font-medium ${badgeClass}`}>
        {badgeText}
      </span>
    );
  };

  const filteredReviews = filterReviews();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review Management</h1>
        
        <div className="flex space-x-4">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button 
            onClick={fetchAllReviews}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Reviews Table - Takes 3 columns when editing, otherwise 5 */}
          <div className={isEditing ? "md:col-span-3" : "md:col-span-5"}>
            <div className="bg-white rounded-lg shadow">
              <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 font-semibold uppercase text-sm text-gray-600">
                <div>User</div>
                <div>Experience</div>
                <div>Rating</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              <div className="divide-y">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map(review => (
                    <div key={review.id} className="grid grid-cols-5 gap-4 p-4 items-center">
                      <div>
                        <div className="font-medium">{review.username || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{review.userEmail || 'No email'}</div>
                      </div>
                      <div className="truncate">
                        {review.productTitle || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{review.rating}</span>
                        <span className="ml-1 text-yellow-400">★</span>
                      </div>
                      <div>
                        {renderStatusBadge(review.status)}
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleSelectReview(review)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        {review.status !== 'approved' && (
                          <button 
                            onClick={() => handleUpdateStatus(review.id, 'approved')}
                            className="text-green-600 hover:text-green-800"
                          >
                            Approve
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button 
                            onClick={() => handleUpdateStatus(review.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reject
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No reviews found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Panel - Shows up when editing */}
          {isEditing && (
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 h-full">
                <h3 className="text-lg font-medium mb-6">Edit Review</h3>
                <form onSubmit={handleSubmitEdit} className="h-full flex flex-col">
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="rating">
                      Rating
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  
                  <div className="mb-6 flex-grow">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="comment">
                      Review Content
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md h-80 min-h-80"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedReview(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;