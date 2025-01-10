import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { ChevronDown, Bell, Menu, X } from 'lucide-react';
import * as AuthService from '../services/AuthService';
import Categories from './CategoryList';
import District from './DistrictList';
import LayoutWrapper from './LayoutWrapper';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
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
    setNotificationDropdownOpen(false);
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
  };

  const handleCategoriesLeave = () => {
    setCategoriesOpen(false);
  };

  const handleDistrictEnter = () => {
    setDistrictOpen(true);
  };

  const handleDistrictLeave = () => {
    setDistrictOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-white/95 z-50 w-full bg-white shadow-sm transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-xl font-semibold text-red-700 hover:border-l-red-700 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-red-600 rounded-full mr-2 flex items-center justify-center">
                <span className="text-white text-sm">CB</span>
              </div>
              Ceylon Bucket
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 pl-8">
            <div className="flex items-center space-x-8">
              <div
                className="relative group"
                onMouseEnter={handleCategoriesEnter}
                onMouseLeave={handleCategoriesLeave}
              >
                <Link
                  to="/experiences"
                  className="flex items-center space-x-1 text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <span>Experiences</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
                </Link>
                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 w-80 mt-2 z-50 bg-white shadow-lg rounded-md overflow-hidden"
                    >
                      <Categories />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className="relative group"
                onMouseEnter={handleDistrictEnter}
                onMouseLeave={handleDistrictLeave}
              >
                <Link
                  to="/locations"
                  className="flex items-center space-x-1 text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <span>Locations</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${districtOpen ? 'rotate-180' : ''}`} />
                </Link>
                <AnimatePresence>
                  {districtOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 w-80 mt-2 z-50 bg-white shadow-lg rounded-md overflow-hidden"
                    >
                      <District />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/viewall"
                className="text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
              >
                View All
              </Link>

              <Link
                to="/about-us"
                className="text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
              >
                About Us
              </Link>

              <Link
                to="/contact-us"
                className="text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link
              to={user ? '/cart' : '/signin'}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 relative group"
            >
              <FaShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-200">
                0
              </span>
            </Link>

            {/* Notification Icon - Only shown when user is authenticated */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200 relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    2
                  </span>
                </button>

                <AnimatePresence>
                  {notificationDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                          <p className="text-sm text-gray-600">Your booking for "Adventure Trek" has been confirmed.</p>
                          <span className="text-xs text-gray-400 mt-1">2 hours ago</span>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                          <p className="text-sm text-gray-600">New experience added in your wishlist location!</p>
                          <span className="text-xs text-gray-400 mt-1">1 day ago</span>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link
                          to="/notifications"
                          className="text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

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
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                <div className="py-2">
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-700"
                  >
                    <span>Experiences</span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${districtOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {districtOpen && (
                    <div className="mt-2 bg-gray-50 rounded-md">
                      <District />
                    </div>
                  )}
                </div>

                <Link
                  to="/viewall"
                  className="block px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  View All
                </Link>

                <Link
                  to="/about-us"
                  className="block px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  About Us
                </Link>

                <Link
                  to="/contact-us"
                  className="block px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;