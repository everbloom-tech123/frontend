import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import * as AuthService from '../services/AuthService';

const ProfileDropdown = ({ user, dropdownOpen, setDropdownOpen, handleLogout }) => {
  const ProfileContent = () => (
    <div className="bg-white rounded-md shadow-lg py-1">
      <div className="px-4 py-2 text-sm text-gray-500">{user?.username}</div>
      {AuthService.getUserRole() === 'ROLE_ADMIN' && (
        <Link
          to="/admin/manage-experiences"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          Admin
        </Link>
      )}
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
      >
        Profile
      </Link>
      <Link
        to="/wishlist"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
      >
        Wishlist
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
      >
        Sign Out
      </button>
    </div>
  );

  return (
    <div className="relative">
      {user ? (
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-gray-700 hover:text-red-600 transition-colors duration-200"
        >
          <FaUser className="w-5 h-5" />
        </button>
      ) : (
        <Link
          to="/signin"
          className="text-gray-700 hover:text-red-600 transition-colors duration-200"
        >
          <FaUser className="w-5 h-5" />
        </Link>
      )}

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 z-50"
          >
            <ProfileContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;