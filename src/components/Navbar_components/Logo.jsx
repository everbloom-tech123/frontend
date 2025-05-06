import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center text-xl font-semibold text-red-700 hover:border-l-red-700 transition-colors duration-200"
    >
      <div className="w-8 h-8 bg-red-600 rounded-full mr-2 flex items-center justify-center">
        <span className="text-white text-sm">CB</span>
      </div>
      Ceylon Experience
    </Link>
  );
};

export default Logo;