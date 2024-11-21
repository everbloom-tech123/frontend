import React from 'react';
import { FaStar, FaEye } from 'react-icons/fa';

const RatingInfo = ({ rating, reviewCount, viewCount }) => (
  <div className="flex items-center mb-4 space-x-4">
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={`${
            index < (rating || 0) ? 'text-yellow-400' : 'text-gray-300'
          } text-xl`}
        />
      ))}
      <span className="ml-2 text-gray-600">({reviewCount || 0} reviews)</span>
    </div>
    <div className="flex items-center text-gray-600">
      <FaEye className="mr-2" />
      {viewCount?.toLocaleString() || 0} views
    </div>
  </div>
);

export default RatingInfo;