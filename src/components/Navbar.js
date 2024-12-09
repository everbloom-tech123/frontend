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

  // Keep all your existing useEffect and handlers
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

  const handleCategoriesEnter = () => {
    setCategoriesOpen(true);
    setDistrictOpen(true);
  };

  const handleCategoriesLeave = () => {
    setCategoriesOpen(false);
    setDistrictOpen(false);
  };

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Social Icons Section - Hidden on Mobile */}
        <div className="hidden md:flex justify-end items-center py-2 border-b border-gray-100">
          <div className="flex space-x-4">
            <Link to="/viewall" className="text-xs text-gray-500 hover:text-red-400 transition-colors">
              View All
            </Link>
          </div>
        </div>

        {/* Logo and Search Section */}
        <div className="flex flex-col md:flex-row items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold italic mb-4 md:mb-0">
            Ceylon Bucket
            <div className="text-sm text-red-400 font-normal mt-1">Your Travel Guide</div>
          </Link>

          {/* Search Bar */}
          <div className="w-full md:w-1/2 max-w-2xl px-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search locations & experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full bg-gray-50 border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-200 focus:outline-none"
              />
              <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <FaSearch className="h-4 w-4 text-gray-400 hover:text-red-400" />
              </button>
            </form>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 hover:text-red-400 transition-colors"
              >
                <FaUser className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-500">{user.username}</div>
                        {AuthService.getUserRole() === 'ROLE_ADMIN' && (
                          <Link to="/admin/manage-experiences" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-400">
                            Admin
                          </Link>
                        )}
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-400">
                          Profile
                        </Link>
                        <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-400">
                          Wishlist
                        </Link>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-400">
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link to="/signin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-400">
                        Sign In
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to={user ? '/cart' : '/signin'} className="p-2 hover:text-red-400 transition-colors">
              <FaShoppingCart className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-red-400"
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

        {/* Navigation - Desktop */}
        <div className="hidden md:block border-t border-gray-100">
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-12">
              <div
                className="relative"
                onMouseEnter={handleCategoriesEnter}
                onMouseLeave={handleCategoriesLeave}
              >
                <Link to="/experiences" className="text-sm font-bold text-gray-700 hover:text-red-400">
                  Experiences
                </Link>
                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 w-80 mt-2 z-50"
                    >
                      <Categories />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className="relative"
                onMouseEnter={handleCategoriesEnter}
                onMouseLeave={handleCategoriesLeave}
              >
                <Link to="/locations" className="text-sm font-bold text-gray-700 hover:text-red-400">
                  Location
                </Link>
                <AnimatePresence>
                  {districtOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 w-80 mt-2 z-50"
                    >
                      <District />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/about" className="text-sm font-bold text-gray-700 hover:text-red-400">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-4 py-2 space-y-4">
              <Link to="/experiences" className="block py-2 text-gray-700 hover:text-red-400">
                Experiences
              </Link>
              <Link to="/locations" className="block py-2 text-gray-700 hover:text-red-400">
                Location
              </Link>
              <Link to="/about" className="block py-2 text-gray-700 hover:text-red-400">
                About Us
              </Link>
              {user ? (
                <>
                  <div className="py-2 text-sm text-gray-500">{user.username}</div>
                  {AuthService.getUserRole() === 'ROLE_ADMIN' && (
                    <Link to="/admin/manage-experiences" className="block py-2 text-gray-700 hover:text-red-400">
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="block py-2 text-gray-700 hover:text-red-400">
                    Profile
                  </Link>
                  <Link to="/wishlist" className="block py-2 text-gray-700 hover:text-red-400">
                    Wishlist
                  </Link>
                  <Link to="/cart" className="block py-2 text-gray-700 hover:text-red-400">
                    Cart
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left py-2 text-gray-700 hover:text-red-400">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/signin" className="block py-2 text-gray-700 hover:text-red-400">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;