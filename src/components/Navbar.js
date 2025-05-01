import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { ChevronDown, Menu, X } from 'lucide-react';
import * as AuthService from '../services/AuthService';
import Categories from './CategoryList';
import District from './DistrictList';
import NavbarCategoryService from '../services/NavbarCategoryService';
import LayoutWrapper from './LayoutWrapper';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileDistrictOpen, setMobileDistrictOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [navbarCategories, setNavbarCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isCategoriesClicked, setIsCategoriesClicked] = useState(false); // Track if categories was opened by click
  const [isDistrictClicked, setIsDistrictClicked] = useState(false); // Track if district was opened by click
  const navigate = useNavigate();
  const location = useLocation();
  const categoriesRef = useRef(null); // Ref for categories dropdown
  const districtRef = useRef(null); // Ref for district dropdown
  const categoriesTimeoutRef = useRef(null); // Ref for debouncing mouse leave
  const districtTimeoutRef = useRef(null); // Ref for debouncing mouse leave

  // Cache duration: 30 minutes (in milliseconds)
  const CACHE_DURATION = 30 * 60 * 1000;

  useEffect(() => {
    checkAuthStatus();
    setupScrollListener();
    fetchNavbarCategories();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(categoriesTimeoutRef.current);
      clearTimeout(districtTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setDropdownOpen(false);
    setCategoriesOpen(false);
    setDistrictOpen(false);
    setMobileCategoriesOpen(false);
    setMobileDistrictOpen(false);
    setMobileProfileOpen(false);
    setIsCategoriesClicked(false);
    setIsDistrictClicked(false);
  }, [location]);

  const setupScrollListener = () => {
    window.addEventListener('scroll', handleScroll);
  };

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  const fetchNavbarCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const cachedData = localStorage.getItem('navbarCategories');
      const cachedTimestamp = localStorage.getItem('navbarCategoriesTimestamp');
      const currentTime = Date.now();

      if (cachedData && cachedTimestamp && (currentTime - parseInt(cachedTimestamp, 10)) < CACHE_DURATION) {
        setNavbarCategories(JSON.parse(cachedData));
      } else {
        const categories = await NavbarCategoryService.getNavbarCategories();
        setNavbarCategories(categories);
        localStorage.setItem('navbarCategories', JSON.stringify(categories));
        localStorage.setItem('navbarCategoriesTimestamp', currentTime.toString());
      }
    } catch (error) {
      console.error('Error fetching navbar categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
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
    clearTimeout(categoriesTimeoutRef.current);
    if (!isCategoriesClicked) {
      setCategoriesOpen(true);
      setDistrictOpen(false);
    }
  };

  const handleCategoriesLeave = () => {
    if (!isCategoriesClicked) {
      categoriesTimeoutRef.current = setTimeout(() => {
        setCategoriesOpen(false);
      }, 300); // 300ms delay to prevent blinking
    }
  };

  const handleDistrictEnter = () => {
    clearTimeout(districtTimeoutRef.current);
    if (!isDistrictClicked) {
      setDistrictOpen(true);
      setCategoriesOpen(false);
    }
  };

  const handleDistrictLeave = () => {
    if (!isDistrictClicked) {
      districtTimeoutRef.current = setTimeout(() => {
        setDistrictOpen(false);
      }, 300); // 300ms delay to prevent blinking
    }
  };

  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
    setIsCategoriesClicked(!categoriesOpen);
    setDistrictOpen(false);
    setIsDistrictClicked(false);
  };

  const toggleDistrict = () => {
    setDistrictOpen(!districtOpen);
    setIsDistrictClicked(!districtOpen);
    setCategoriesOpen(false);
    setIsCategoriesClicked(false);
  };

  const handleClickOutside = (event) => {
    if (
      categoriesRef.current && !categoriesRef.current.contains(event.target) &&
      districtRef.current && !districtRef.current.contains(event.target)
    ) {
      setCategoriesOpen(false);
      setIsCategoriesClicked(false);
      setDistrictOpen(false);
      setIsDistrictClicked(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

  const NavbarCategoriesMenu = () => {
    return (
      <div
        className="relative group"
        ref={categoriesRef}
        onMouseEnter={handleCategoriesEnter}
        onMouseLeave={handleCategoriesLeave}
      >
        <button
          onClick={toggleCategories}
          className="flex items-center space-x-1 text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
        >
          <span>Experiences</span>
          <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {categoriesOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 w-80 mt-2 z-50 bg-white shadow-lg rounded-md overflow-hidden"
            >
              <Categories navbarCategories={navbarCategories} isLoading={isLoadingCategories} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const MobileNavbarCategoriesMenu = () => {
    return (
      <div className="py-2">
        <button
          onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-700"
        >
          <span>Experiences</span>
          <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {mobileCategoriesOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 bg-white rounded-md shadow-inner"
            >
              <Categories navbarCategories={navbarCategories} isLoading={isLoadingCategories} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-white/95 z-[60] w-full bg-white shadow-sm transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
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
              Ceylon Experience
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 pl-8">
            <div className="flex items-center space-x-8">
              {/* Dynamic Navbar Categories */}
              <NavbarCategoriesMenu />

              <div
                className="relative group"
                ref={districtRef}
                onMouseEnter={handleDistrictEnter}
                onMouseLeave={handleDistrictLeave}
              >
                <button
                  onClick={toggleDistrict}
                  className="flex items-center space-x-1 text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <span>Locations</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${districtOpen ? 'rotate-180' : ''}`} />
                </button>
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
                to="/sales"
                className="text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200 flex items-center"
              >
                <span>Sales</span>
                <span className="ml-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold">HOT</span>
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
              to={user ? '/My-Booking' : '/signin'}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 relative group"
            >
              <FaShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-200">
                0
              </span>
            </Link>

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
                {/* Mobile Experiences Dropdown with Dynamic Categories */}
                <MobileNavbarCategoriesMenu />

                {/* Mobile Locations Dropdown */}
                <div className="py-2">
                  <button
                    onClick={() => setMobileDistrictOpen(!mobileDistrictOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-700"
                  >
                    <span>Locations</span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${mobileDistrictOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileDistrictOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 bg-white rounded-md shadow-inner"
                      >
                        <District />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/sales"
                  className="flex items-center px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 transition-colors duration-200 mx-2"
                >
                  <span>Sales</span>
                  <span className="ml-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold">HOT</span>
                </Link>

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

                {!user && (
                  <Link
                    to="/signin"
                    className="block px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 transition-colors duration-200"
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