import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaShare } from 'react-icons/fa';

const BookingCard = ({
  experience,
  isUserAuthenticated,
  currentUser,
  isInWishlist,
  onBooking,
  onWishlistToggle
}) => (
  <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Book this experience</h2>
    <div className="flex justify-between items-center mb-6">
      <div>
        <p className="text-3xl font-bold text-gray-800">
          ${experience.price?.toFixed(2)}
        </p>
        {experience.discount > 0 && (
          <p className="text-sm text-gray-500 line-through">
            ${((experience.price || 0) / (1 - (experience.discount || 0) / 100)).toFixed(2)}
          </p>
        )}
      </div>
      {experience.discount > 0 && (
        <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {experience.discount}% OFF
        </div>
      )}
    </div>
    
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onBooking}
      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full text-lg transition duration-300"
    >
      {isUserAuthenticated ? 'Book Now' : 'Login to Book'}
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onWishlistToggle}
      className={`w-full mt-4 border font-bold py-3 px-4 rounded-full text-lg transition duration-300 flex items-center justify-center ${
        isInWishlist
          ? 'bg-red-100 text-red-600 border-red-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      }`}
    >
      <FaHeart className={`mr-2 ${isInWishlist ? 'text-red-600' : 'text-gray-400'}`} />
      {isUserAuthenticated 
        ? (isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')
        : 'Login to Save'
      }
    </motion.button>

    {currentUser && (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Logged in as:</p>
        <p className="font-semibold">{currentUser.username}</p>
        <p className="text-gray-500 text-sm">{currentUser.email}</p>
      </div>
    )}

    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Share this experience</h3>
      <div className="flex space-x-4">
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: experience.title,
                text: experience.description,
                url: window.location.href
              }).catch(console.error);
            }
          }}
          className="text-red-600 hover:text-red-700 transition duration-300"
        >
          <FaShare className="text-2xl" />
        </button>
      </div>
    </div>
  </div>
);

export default BookingCard;