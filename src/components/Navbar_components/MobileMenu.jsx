import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MobileNavbarCategories from './MobileNavbarCategories';
import MobileLocationDropdown from './MobileLocationDropdown';

const MobileMenu = ({
  isMenuOpen,
  mobileCategoriesOpen,
  setMobileCategoriesOpen,
  isLoadingCategories,
  navbarCategories,
  setIsMenuOpen,
  mobileDistrictOpen,
  setMobileDistrictOpen,
  user
}) => {
  return (
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
            <MobileNavbarCategories 
              mobileCategoriesOpen={mobileCategoriesOpen}
              setMobileCategoriesOpen={setMobileCategoriesOpen}
              isLoadingCategories={isLoadingCategories}
              navbarCategories={navbarCategories}
              setIsMenuOpen={setIsMenuOpen}
            />

            <MobileLocationDropdown
              mobileDistrictOpen={mobileDistrictOpen}
              setMobileDistrictOpen={setMobileDistrictOpen}
            />

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
  );
};

export default MobileMenu;