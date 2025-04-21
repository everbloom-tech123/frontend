import React from 'react';

const ReviewButton = ({ onClick, hasReview, reviewStatus, disabled = false }) => {
  // Different button states based on review status
  const getButtonStyle = () => {
    if (!hasReview) {
      return 'bg-red-600 text-white hover:bg-red-700 shadow-md';
    }
    
    switch (reviewStatus) {
      case 'approved':
        return 'bg-white text-red-600 border-red-600 hover:bg-red-50 shadow-md';
      case 'pending':
        return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 shadow-md';
      case 'rejected':
        return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 shadow-md';
      default:
        return 'bg-white text-red-600 border-red-600 hover:bg-red-50 shadow-md';
    }
  };
  
  // Button text based on review status
  const getButtonText = () => {
    if (!hasReview) return 'Leave Review';
    
    switch (reviewStatus) {
      case 'approved':
        return 'View Review';
      case 'pending':
        return 'Edit Review';
      case 'rejected':
        return 'Review Rejected';
      default:
        return 'View Review';
    }
  };
  
  // Get icon based on review status
  const getIcon = () => {
    if (!hasReview) {
      return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    switch (reviewStatus) {
      case 'approved':
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 border rounded-md font-medium flex items-center justify-center transition-all duration-200 ${
        getButtonStyle()
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || (hasReview && reviewStatus === 'rejected')}
    >
      {getIcon()}
      {getButtonText()}
    </button>
  );
};

export default ReviewButton;