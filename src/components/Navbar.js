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

  // Keep all your existing effects and handlers
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

  const navItems = {
    'Experiences': [],
    'Location': [],
    'About Us': [],
    'View All': []
  };

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar with social icons */}
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
          <div className="flex space-x-4">
            <Twitter className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
            <Facebook className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
            <Instagram className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
            <Rss className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <FaUser className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)} />
            ) : (
              <Link to="/signin" className="text-gray-500 hover:text-gray-700">Sign In</Link>
            )}
            <Link to={user ? '/cart' : '/signin'}>
              <FaShoppingCart className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
            </Link>
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center py-8">
          <Link to="/" className="text-3xl font-bold italic">
            Ceylon Bucket
            <div className="text-sm text-red-400 font-normal mt-1">Your Travel Guide</div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex justify-between items-center py-4">
          <div className="flex-1 flex justify-center space-x-8">
            <div className="relative group">
              <Link 
                to="/experiences"
                className="text-xs font-bold tracking-wider hover:text-red-400 transition-colors duration-200"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
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

            <div className="relative group">
              <Link 
                to="/locations"
                className="text-xs font-bold tracking-wider hover:text-red-400 transition-colors duration-200"
                onMouseEnter={() => setDistrictOpen(true)}
                onMouseLeave={() => setDistrictOpen(false)}
              >
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
          
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hidden"
            />
            <button type="submit" className="p-2 hover:text-red-400 transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </nav>

        {/* User Dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <div className="px-4 py-2 text-sm text-gray-500">{user?.username}</div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;