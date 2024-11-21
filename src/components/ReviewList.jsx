import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewList = ({ reviews }) => (
  <div className="space-y-6">
    {reviews?.map((review) => (
      <div key={review.id} className="border-b pb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <img src={review.avatar} alt={review.user} className="w-12 h-12 rounded-full mr-4" />
            <div>
              <p className="font-semibold text-lg">{review.user}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`${
                      index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    } text-sm`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">{review.date}</p>
        </div>
        <p className="mt-2 text-gray-600">{review.comment}</p>
        {review.replies.map((reply, index) => (
          <div key={index} className="ml-12 mt-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img src={reply.avatar} alt={reply.user} className="w-10 h-10 rounded-full mr-3" />
                <p className="font-semibold">{reply.user}</p>
              </div>
              <p className="text-sm text-gray-500">{reply.date}</p>
            </div>
            <p className="mt-1 text-gray-600">{reply.comment}</p>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default ReviewList;