import React, { useState, useEffect } from 'react';
import ReviewService from '../services/reviewService';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { format } from 'date-fns';

const ReviewComponent = ({ experienceId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const fetchedReviews = await ReviewService.getReviewsByProduct(experienceId);
        
        // Filter only approved reviews
        const approvedReviews = fetchedReviews.filter(review => review.status === "APPROVED");
        
        setReviews(approvedReviews);
        setReviewCount(approvedReviews.length);
        
        // Calculate average rating
        if (approvedReviews.length > 0) {
          const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating((totalRating / approvedReviews.length).toFixed(1));
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (experienceId) {
      fetchReviews();
    }
  }, [experienceId]);

  // Generate stars for a given rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy');
    } catch (err) {
      console.error("Date formatting error:", err);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
      <div className="border-b pb-6 mb-6">
        <div className="flex items-center">
          <div className="pr-4">
            <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          </div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-gray-800 mr-2">{averageRating}</span>
            <div className="flex">
              {renderStars(parseFloat(averageRating))}
            </div>
            <span className="ml-2 text-gray-600">{reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}</span>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet for this experience.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center mb-2">
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-2">"{review.title || 'Review'}"</h3>
              
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              <div className="flex items-center text-sm text-gray-500">
                <span>{review.user?.username || 'Verified Guest'}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(review.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;