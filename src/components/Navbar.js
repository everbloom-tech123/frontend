import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { Search, Twitter, Instagram, Facebook, Rss } from 'lucide-react';
import * as AuthService from '../services/AuthService';
import Categories from './CategoryList';
import District from './DistrictList';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('home');
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

  return (

    
    <div className={`w-full bg-white shadow-sm ${scrolled ? 'shadow-md' : ''}`}>
      {/* Logo - Centered */}
      <div className="flex justify-center py-8">
          <Link to="/" className="text-3xl font-bold italic">
            Ceylon Bucket
            <div className="text-sm text-red-400 font-normal mt-1">Your Travel Guide</div>
          </Link>
        </div>
      <div className="max-w-7xl mx-auto px-4">
        {/* Combined navigation bar */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          {/* Social icons - Left side */}
          <div className="flex items-center space-x-3">
            <Twitter className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700 cursor-pointer font-semibold" />
            <Facebook className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700 cursor-pointer font-semibold" />
            <Instagram className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700 cursor-pointer font-semibold" />
            <Rss className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700 cursor-pointer font-semibold" />
          </div>

          {/* Navigation Links - Center */}
          <div className="flex items-center space-x-8">
            <div 
              className="relative group"
              onMouseEnter={handleCategoriesEnter}
              onMouseLeave={handleCategoriesLeave}
            >
              <Link 
                to="/experiences"
                className="text-xs font-bold tracking-wider hover:text-red-400 transition-colors duration-200"
              >
                Experiences
              </Link>
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 w-80 mt-2 z-50"
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
                className="text-xs font-bold tracking-wider hover:text-red-400 transition-colors duration-200"
              >
                Location
              </Link>
              <AnimatePresence>
                {districtOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 w-80 mt-2 z-50"
                  >
                    <District />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/about"
              className="text-xs font-bold tracking-wider hover:text-red-400 transition-colors duration-200"
            >
              About Us
            </Link>

            <Link 
              to="/viewall"
              className="text-xs font-bold tracking-wider hover:text-red-400 transition-colors duration-200"
            >
              View All
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="absolute right-0 top-0 w-0 opacity-0 group-hover:w-48 group-hover:opacity-100 transition-all duration-300"
              />
              <button type="submit" className="hover:text-red-400 transition-colors duration-200">
                <Search className="w-4 h-4" />
              </button>
            </form>
            
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="hover:text-red-400 transition-colors duration-200"
                >
                  <FaUser className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link to="/signin">
                  <FaUser className="w-3.5 h-3.5 hover:text-red-400 transition-colors duration-200" />
                </Link>
              )}
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    <div className="px-4 py-2 text-sm text-gray-500">
                      {user?.username}
                    </div>
                    {AuthService.getUserRole() === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin/manage-experiences"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-400"
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-400"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-400"
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-400"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link 
              to={user ? '/cart' : '/signin'}
              className="hover:text-red-400 transition-colors duration-200"
            >
              <FaShoppingCart className="w-3.5 h-3.5" />
            </Link>
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
              {/* Mobile menu content */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;