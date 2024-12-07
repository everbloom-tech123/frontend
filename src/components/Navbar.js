import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt } from 'react-icons/fa';
import * as AuthService from '../services/AuthService';

const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-700 hover:text-red-600 transition-colors px-4 py-2 font-medium"
  >
    {children}
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
        setUser(userData || await AuthService.getUserProfile());
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-red-600">
              Ceylon Bucket
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <NavLink to="/viewall">Experiences</NavLink>
            <NavLink to="/locations">
              <div className="flex items-center space-x-1">
                <FaMapMarkerAlt className="text-red-600" />
                <span>Locations</span>
              </div>
            </NavLink>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search locations & experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-red-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaSearch className="text-gray-400 hover:text-red-600" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Navigation */}
          <div className="hidden lg:flex items-center space-x-6 ml-8">
            <Link to="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 hover:text-red-600"
              >
                <FaShoppingCart className="h-5 w-5" />
              </motion.button>
            </Link>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-600 hover:text-red-600"
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
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                        >
                          Profile
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
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-red-600 focus:outline-none"
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t"
            >
              <div className="px-4 py-3">
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search locations & experiences..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-red-500"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <FaSearch className="text-gray-400 hover:text-red-600" />
                    </button>
                  </div>
                </form>
                <Link
                  to="/viewall"
                  className="block px-3 py-2 text-gray-700 hover:text-red-600"
                >
                  Experiences
                </Link>
                <Link
                  to="/locations"
                  className="block px-3 py-2 text-gray-700 hover:text-red-600"
                >
                  <div className="flex items-center space-x-1">
                    <FaMapMarkerAlt className="text-red-600" />
                    <span>Locations</span>
                  </div>
                </Link>
                <Link
                  to="/cart"
                  className="block px-3 py-2 text-gray-700 hover:text-red-600"
                >
                  Cart
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-gray-700 hover:text-red-600"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-gray-700 hover:text-red-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/signin"
                    className="block px-3 py-2 text-gray-700 hover:text-red-600"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;