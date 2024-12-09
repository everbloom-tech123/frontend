import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';
import * as AuthService from '../services/AuthService';
import Categories from './CategoryList';
import District from './DistrictList';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
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
    setCategoriesOpen(false);
    setDistrictOpen(false);
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

  const handleExperiencesEnter = () => {
    setCategoriesOpen(true);
  };

  const handleExperiencesLeave = () => {
    setCategoriesOpen(false);
  };

  const handleLocationEnter = () => {
    setDistrictOpen(true);
  };

  const handleLocationLeave = () => {
    setDistrictOpen(false);
  };

  return (
    <div className="w-full">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/70 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          {/* Upper Section */}
          <div className="flex items-center h-16">
            {/* Logo - Left */}
            <div className="w-1/4">
              <Link to="/" className="flex-shrink-0">
                <span className="text-2xl font-bold italic text-red-600 font-serif tracking-wide hover:text-red-700 transition-colors">
                  Ceylon Bucket
                </span>
              </Link>
            </div>

            {/* Search Bar - Absolute Center */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-2xl">
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
            </div>

            {/* Right Navigation Items */}
            <div className="w-1/4 flex items-center justify-end space-x-12">
              <Link to="/viewall" className="text-gray-700 hover:text-red-600 transition-colors">
                View All
              </Link>
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
          </div>

          {/* Lower Navigation Bar */}
          <div className="hidden lg:block border-t border-gray-200/50">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-24">
                {/* Experiences Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={handleExperiencesEnter}
                  onMouseLeave={handleExperiencesLeave}
                >
                  <Link to="/experiences" className="text-gray-700 hover:text-red-600 transition-colors">
                    Experiences
                  </Link>
                  <AnimatePresence>
                    {categoriesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 w-80 mt-3 z-50"
                      >
                        <Categories />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Location Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={handleLocationEnter}
                  onMouseLeave={handleLocationLeave}
                >
                  <Link to="/locations" className="text-gray-700 hover:text-red-600 transition-colors">
                    Location
                  </Link>
                  <AnimatePresence>
                    {districtOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 w-80 mt-3 z-50"
                      >
                        <District />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/about" className="text-gray-700 hover:text-red-600 transition-colors">
                  About Us
                </Link>
              </div>
              <Link 
                to={user ? '/cart' : '/signin'} 
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                <FaShoppingCart className="h-5 w-5" />
              </Link>
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
            {/* Mobile menu content remains the same */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;