import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an auth context

const ReviewComponent = ({ experienceId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const { isAuthenticated } = useAuth(); // Get authentication status
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log(`Fetching reviews for experience ID: ${experienceId}`);
        setLoading(true);
        setError(null);
        
        // Include authentication token
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await axios.get(
          `${config.API_BASE_URL}/public/api/reviews/products/${experienceId}`,
          { headers }
        );
        
        // Process successful response
        if (response.data) {
          console.log("Reviews data received:", response.data.length, "reviews");
          
          // Filter only approved reviews
          const approvedReviews = response.data.filter(review => 
            review.status === "APPROVED"
          );
          
          setReviews(approvedReviews);
          setReviewCount(approvedReviews.length);
          
          // Calculate average rating
          if (approvedReviews.length > 0) {
            const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
            setAverageRating((totalRating / approvedReviews.length).toFixed(1));
          }
        } else {
          setReviews([]);
          setReviewCount(0);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        
        if (err.response && err.response.status === 403) {
          if (!isAuthenticated) {
            // User is not logged in
            setError("Please sign in to view reviews for this experience.");
          } else {
            // User is logged in but doesn't have permission
            setError("You don't have permission to view these reviews.");
          }
        } else if (err.response && err.response.status === 404) {
          setError("No reviews found for this experience.");
        } else {
          setError("Unable to load reviews at this time.");
        }
        
        setReviews([]);
        setReviewCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (experienceId) {
      fetchReviews();
    }
  }, [experienceId, isAuthenticated]);

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

  return (
    <div>
      {/* Reviews Header */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex items-center">
          <div className="pr-4">
            <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          </div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-gray-800 mr-2">{averageRating || "0.0"}</span>
            <div className="flex">
              {renderStars(parseFloat(averageRating) || 0)}
            </div>
            <span className="ml-2 text-gray-600">{reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}</span>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
            <p>{error}</p>
            
            {!isAuthenticated && (
              <div className="mt-3">
                <a 
                  href={`/signin?redirectTo=/experience/${experienceId}`}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300 inline-block"
                >
                  Sign In to View Reviews
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Reviews Content */}
      {!error && reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet for this experience.</p>
          <button
            onClick={() => window.location.href = `/booking?experienceId=${experienceId}`}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
          >
            Book Now to Be the First to Review
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center mb-2">
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-2">"{review.productTitle || 'Experience Review'}"</h3>
              
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              <div className="flex items-center text-sm text-gray-500">
                <span>{review.username || 'Verified Guest'}</span>
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