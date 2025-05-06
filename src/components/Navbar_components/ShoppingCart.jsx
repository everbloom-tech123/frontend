import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const ShoppingCart = ({ user }) => {
  return (
    <Link
      to={user ? '/My-Booking' : '/signin'}
      className="text-gray-700 hover:text-red-600 transition-colors duration-200 relative group"
    >
      <FaShoppingCart className="w-5 h-5" />
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-200">
        0
      </span>
    </Link>
  );
};

export default ShoppingCart;