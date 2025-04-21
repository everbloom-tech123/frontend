import React, { useState, useEffect } from 'react';
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
  // Add missing state variables for districts
  const [districtsOpen, setDistrictsOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileDistrictOpen, setMobileDistrictOpen] = useState(false);
  const [mobileDistrictsOpen, setMobileDistrictsOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [navbarCategories, setNavbarCategories] = useState([]);
  // Add state for district data
  const [navbarDistricts, setNavbarDistricts] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
    setupScrollListener();
    fetchNavbarCategories();
    fetchNavbarDistricts(); // Add function to fetch districts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setDropdownOpen(false);
    setCategoriesOpen(false);
    setDistrictOpen(false);
    setDistrictsOpen(false); // Reset districtsOpen state
    setMobileCategoriesOpen(false);
    setMobileDistrictOpen(false);
    setMobileDistrictsOpen(false); // Reset mobileDistrictsOpen state
    setMobileProfileOpen(false);
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
      const categories = await NavbarCategoryService.getNavbarCategories();
      setNavbarCategories(categories);
    } catch (error) {
      console.error('Error fetching navbar categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Add function to fetch districts
  const fetchNavbarDistricts = async () => {
    setIsLoadingDistricts(true);
    try {
      // Replace this with your actual service call
      // For example: const districts = await DistrictService.getDistricts();
      const districts = []; // Placeholder, replace with actual data fetching
      setNavbarDistricts(districts);
    } catch (error) {
      console.error('Error fetching navbar districts:', error);
    } finally {
      setIsLoadingDistricts(false);
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
    setCategoriesOpen(true);
  };

  const handleCategoriesLeave = () => {
    setCategoriesOpen(false);
  };

  // Add missing handler functions for districts
  const handleDistrictsEnter = () => {
    setDistrictsOpen(true);
  };

  const handleDistrictsLeave = () => {
    setDistrictsOpen(false);
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

  // Add missing NavbarCategoriesMenu component
  const NavbarCategoriesMenu = () => {
    return (
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
    );
  };

  // Add missing MobileNavbarCategoriesMenu component
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
              <Categories />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Desktop Navbar Districts Menu
  const NavbarDistrictsMenu = () => {
    return (
      <div
        className="relative group"
        onMouseEnter={handleDistrictsEnter}
        onMouseLeave={handleDistrictsLeave}
      >
        <Link
          to="/districts"
          className="flex items-center space-x-1 text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
        >
          <span>Districts</span>
          <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${districtsOpen ? 'rotate-180' : ''}`} />
        </Link>
        <AnimatePresence>
          {districtsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 w-56 mt-2 z-50 bg-white shadow-lg rounded-md overflow-hidden"
            >
              {isLoadingDistricts ? (
                <div className="p-4 text-center">Loading districts...</div>
              ) : navbarDistricts.length > 0 ? (
                <div className="py-1">
                  {navbarDistricts.map(district => (
                    <Link
                      key={district.id}
                      to={`/district/${district.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => setDistrictsOpen(false)}
                    >
                      {district.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    to="/districts"
                    className="block px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    View All Districts
                  </Link>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No districts available
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Mobile Navbar Districts Menu
  const MobileNavbarDistrictsMenu = () => {
    return (
      <div className="py-2">
        <button
          onClick={() => setMobileDistrictsOpen(!mobileDistrictsOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-700"
        >
          <span>Districts</span>
          <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${mobileDistrictsOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {mobileDistrictsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 bg-white rounded-md shadow-inner"
            >
              {isLoadingDistricts ? (
                <div className="p-4 text-center">Loading districts...</div>
              ) : navbarDistricts.length > 0 ? (
                <div className="py-1">
                  {navbarDistricts.map(district => (
                    <Link
                      key={district.id}
                      to={`/district/${district.id}`}
                      className="block px-4 py-2 ml-4 text-sm text-gray-700 hover:text-red-600 transition-colors duration-200"
                      onClick={() => {
                        setMobileDistrictsOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      {district.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    to="/districts"
                    className="block px-4 py-2 ml-4 text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                    onClick={() => {
                      setMobileDistrictsOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    View All Districts
                  </Link>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No districts available
                </div>
              )}
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
              
              {/* Add NavbarDistrictsMenu component */}
              <NavbarDistrictsMenu />

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
                to="/sales"
                className="text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200 flex items-center"
              >
                <span>Sales</span>
                <span className="ml-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold">HOT</span>
              </Link>

              <Link
                to="/My-Booking"
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
                
                {/* Add MobileNavbarDistrictsMenu */}
                <MobileNavbarDistrictsMenu />

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

                {/* Sales button with tag */}
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