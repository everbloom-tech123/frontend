import React, { useState, useEffect } from 'react';

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  experienceTitle, 
  isEditMode = false,
  existingReview = null,
  reviewStatus = null
}) => {
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update form when existing review data is provided
  useEffect(() => {
    if (existingReview) {
      setReviewData({
        rating: existingReview.rating || 5,
        comment: existingReview.comment || '',
      });
    }
  }, [existingReview]);
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(reviewData);
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error submitting review:', error);
      // You could add error handling UI here
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;

  // Get header color based on status
  const getStatusHeaderColor = () => {
    if (!isEditMode) return 'bg-red-600';
    
    switch (reviewStatus?.toLowerCase()) {
      case 'approved':
        return 'bg-red-700';
      case 'pending':
        return 'bg-red-500';
      case 'rejected':
        return 'bg-gray-700';
      default:
        return 'bg-red-600';
    }
  };

  // Display status badge if viewing/editing an existing review
  const StatusBadge = () => {
    if (!isEditMode || !reviewStatus) return null;
    
    const styles = {
      approved: 'bg-white text-red-700 border border-red-300',
      pending: 'bg-red-100 text-red-800 border border-red-300',
      rejected: 'bg-gray-100 text-gray-800 border border-gray-300'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[reviewStatus?.toLowerCase()] || ''}`}>
        {reviewStatus?.charAt(0).toUpperCase() + reviewStatus?.slice(1)}
      </span>
    );
  };

  // Determine if review fields should be disabled
  const isReadOnly = isEditMode && reviewStatus?.toLowerCase() !== 'pending';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className={`${getStatusHeaderColor()} px-6 py-4 text-white`}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium" id="modal-title">
                {isEditMode ? 'Your Review' : 'Write a Review'}
              </h3>
              <StatusBadge />
            </div>
          </div>
          
          <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <p className="text-sm text-gray-700 mb-4 font-medium">
                  {experienceTitle}
                </p>
                
                {/* Star Rating */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Rating</p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`focus:outline-none ${isReadOnly ? 'cursor-default' : 'transform hover:scale-110 transition-transform'}`}
                        onClick={() => !isReadOnly && setReviewData({...reviewData, rating: star})}
                        disabled={isReadOnly}
                      >
                        <svg 
                          className={`w-8 h-8 ${reviewData.rating >= star ? 'text-red-500' : 'text-gray-300'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Comment Textarea */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border ${
                      isReadOnly ? 'bg-gray-50' : ''
                    }`}
                    placeholder="Share your experience with this booking..."
                    value={reviewData.comment}
                    onChange={(e) => !isReadOnly && setReviewData({...reviewData, comment: e.target.value})}
                    readOnly={isReadOnly}
                  />
                </div>
                
                {/* Admin Feedback - Only shown if review was rejected */}
                {isEditMode && reviewStatus?.toLowerCase() === 'rejected' && existingReview?.adminFeedback && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      Reason for Rejection:
                    </p>
                    <p className="text-sm text-gray-700">
                      {existingReview.adminFeedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
            {!isReadOnly && (
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-md px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Review' : 'Submit Review'}
              </button>
            )}
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-md px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;