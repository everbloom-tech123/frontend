import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt } from 'react-icons/fa';
import * as AuthService from '../services/AuthService';

const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-700 hover:text-red-800 relative group px-3 py-2"
  >
    <span className="relative">
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
    </span>
  </Link>
);

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

  const userRole = AuthService.getUserRole();

  return (
    <div className="w-full">
      {/* Main Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md' 
          : 'bg-white/70 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <motion.span 
                className="text-2xl font-bold text-red-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ceylon Bucket
              </motion.span>
            </Link>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search locations & experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-4 pr-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                      scrolled 
                        ? 'bg-gray-100' 
                        : 'bg-white/90 backdrop-blur-sm'
                    }`}
                  />
                  <button 
                    type="submit" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <FaSearch className="text-gray-400 hover:text-red-800" />
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <NavLink to="/viewall">
                Experiences
              </NavLink>
              
              <NavLink to="/locations">
                <div className="flex items-center space-x-1">
                  <FaMapMarkerAlt />
                  <span>Locations</span>
                </div>
              </NavLink>

              {userRole === 'ROLE_ADMIN' && (
                <NavLink to="/admin/manage-experiences">
                  Admin
                </NavLink>
              )}

              <Link to={user ? '/cart' : '/signin'}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700 hover:text-red-800"
                >
                  <FaShoppingCart className="h-5 w-5" />
                </motion.button>
              </Link>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-700 hover:text-red-800"
                >
                  <FaUser className="h-5 w-5" />
                </motion.button>

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
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-800"
                          >
                            Profile
                          </Link>
                          <Link
                            to="/wishlist"
                            className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-800"
                          >
                            Wishlist
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-800"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/signin"
                          className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-800"
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
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-red-800 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className={`w-full border-t border-gray-200 mt-16 transition-all duration-300 ${
        scrolled 
          ? 'bg-white' 
          : 'bg-white/70 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 h-12 text-sm overflow-x-auto">
            <NavLink to="/holiday-gifts">
              Holiday Gifts
            </NavLink>
            <NavLink to="/locations">
              Locations
            </NavLink>
            <NavLink to="/experiences">
              Experiences
            </NavLink>
            <NavLink to="/gifts">
              Gifts
            </NavLink>
            <NavLink to="/egift-cards">
              eGift Cards
            </NavLink>
            <NavLink to="/gift-finder">
              Gift Finder
            </NavLink>
            <NavLink to="/for-business">
              For Business
            </NavLink>
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
                    className="w-full pl-4 pr-10 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FaSearch className="text-gray-400 hover:text-red-800" />
                  </button>
                </div>
              </form>

              <div className="space-y-1">
                <Link
                  to="/viewall"
                  className="block px-3 py-2 text-gray-700 hover:text-red-800"
                >
                  Experiences
                </Link>
                <Link
                  to="/locations"
                  className="block px-3 py-2 text-gray-700 hover:text-red-800"
                >
                  <div className="flex items-center space-x-1">
                    <FaMapMarkerAlt />
                    <span>Locations</span>
                  </div>
                </Link>
                {userRole === 'ROLE_ADMIN' && (
                  <Link
                    to="/admin/manage-experiences"
                    className="block px-3 py-2 text-gray-700 hover:text-red-800"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to={user ? '/cart' : '/signin'}
                  className="block px-3 py-2 text-gray-700 hover:text-red-800"
                >
                  Cart
                </Link>
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {user.username}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-gray-700 hover:text-red-800"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-3 py-2 text-gray-700 hover:text-red-800"
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-gray-700 hover:text-red-800"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/signin"
                    className="block px-3 py-2 text-gray-700 hover:text-red-800"
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