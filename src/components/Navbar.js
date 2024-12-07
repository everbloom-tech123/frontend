import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';
import * as AuthService from '../services/AuthService';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
    setupScrollListener();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const setupScrollListener = () => {
    window.addEventListener('scroll', handleScroll);
  };

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  const checkAuthStatus = async () => {
    try {
      if (AuthService.isAuthenticated()) {
        const userData = AuthService.getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          const profile = await AuthService.getUserProfile();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full">
      {/* Top Navigation Bar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/70 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          {/* Upper Section */}
          <div className="flex items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold italic text-red-600 font-serif tracking-wide hover:text-red-700 transition-colors">
                Ceylon Bucket
              </span>
            </Link>

            {/* Search Bar - Center */}
            <div className="hidden lg:flex flex-1 justify-center max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search locations & experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-5 pr-12 py-2.5 rounded-full transition-all duration-300
                      ${scrolled 
                        ? 'bg-gray-100 focus:bg-white' 
                        : 'bg-white/90 focus:bg-white'}
                      border border-transparent focus:border-red-300 focus:ring-2 focus:ring-red-200 focus:outline-none`}
                  />
                  <button 
                    type="submit" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FaSearch className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Navigation Items */}
            <div className="hidden lg:flex items-center ml-auto space-x-12">
              <Link to="/viewall" className="text-gray-700 hover:text-red-600 transition-colors">
                View All
              </Link>

              {/* User Account */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  <FaUser className="h-5 w-5" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-2 text-sm text-gray-500">
                            {user.username}
                          </div>
                          {AuthService.getUserRole() === 'ROLE_ADMIN' && (
                            <Link
                              to="/admin/manage-experiences"
                              className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                            >
                              Admin
                            </Link>
                          )}
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                          >
                            Profile
                          </Link>
                          <Link
                            to="/wishlist"
                            className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                          >
                            Wishlist
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/signin"
                          className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                        >
                          Sign In
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden ml-auto">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-red-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Lower Navigation Bar */}
          <div className="hidden lg:block border-t border-gray-200/50">
            <div className="flex items-center justify-center h-12">
              <div className="flex items-center space-x-24">
                <Link to="/experiences" className="text-gray-700 hover:text-red-600 transition-colors">
                  Experiences
                </Link>
                <Link 
                  to={user ? '/cart' : '/signin'} 
                  className="text-gray-700 hover:text-red-600 transition-colors mx-12"
                >
                  <FaShoppingCart className="h-5 w-5" />
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-red-600 transition-colors">
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-16 left-0 right-0 bg-white shadow-lg z-40"
          >
            <div className="px-4 py-3">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search locations & experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-red-200"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FaSearch className="text-gray-400 hover:text-red-600" />
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                <Link
                  to="/viewall"
                  className="block text-gray-700 hover:text-red-600"
                >
                  View All
                </Link>
                <Link
                  to="/experiences"
                  className="block text-gray-700 hover:text-red-600"
                >
                  Experiences
                </Link>
                <Link
                  to="/about"
                  className="block text-gray-700 hover:text-red-600"
                >
                  About Us
                </Link>
                <Link
                  to={user ? '/cart' : '/signin'}
                  className="block text-gray-700 hover:text-red-600"
                >
                  Cart
                </Link>
                
                {user ? (
                  <>
                    <div className="text-sm text-gray-500">
                      {user.username}
                    </div>
                    {AuthService.getUserRole() === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin/manage-experiences"
                        className="block text-gray-700 hover:text-red-600"
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block text-gray-700 hover:text-red-600"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block text-gray-700 hover:text-red-600"
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-gray-700 hover:text-red-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/signin"
                    className="block text-gray-700 hover:text-red-600"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;