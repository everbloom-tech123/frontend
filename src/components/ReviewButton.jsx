import React from 'react';
import { FaStar, FaEdit, FaExclamationTriangle } from 'react-icons/fa';

const ReviewButton = ({ onClick, hasReview, reviewStatus, disabled }) => {
  // Determine button text and icon based on review status
  let buttonText = 'Write a Review';
  let ButtonIcon = FaStar;
  let buttonClass = 'text-blue-600 hover:text-blue-800';

  if (hasReview) {
    if (reviewStatus?.toLowerCase() === 'rejected') {
      buttonText = 'Update Rejected Review';
      ButtonIcon = FaExclamationTriangle;
      buttonClass = 'text-red-600 hover:text-red-800';
    } else {
      buttonText = 'Edit Your Review';
      ButtonIcon = FaEdit;
      buttonClass = 'text-green-600 hover:text-green-800';
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center text-sm font-medium mt-2 ${buttonClass} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <ButtonIcon className="mr-1" />
      {buttonText}
      {disabled && (
        <span className="ml-1 text-xs text-gray-500">
          (Available after confirmation)
        </span>
      )}
    </button>
  );
};

export default ReviewButton;