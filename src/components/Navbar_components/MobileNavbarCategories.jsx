import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const MobileNavbarCategories = ({ mobileCategoriesOpen, setMobileCategoriesOpen, isLoadingCategories, navbarCategories, setIsMenuOpen }) => {
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
            {isLoadingCategories ? (
              <div className="p-4 text-center">Loading categories...</div>
            ) : navbarCategories.length > 0 ? (
              <div className="py-1">
                {navbarCategories.map(category => (
                  <Link
                    key={category.id}
                    to={`/viewby/${category.id}`}
                    className="block px-4 py-2 ml-4 text-sm text-gray-700 hover:text-red-600 transition-colors duration-200"
                    onClick={() => {
                      setMobileCategoriesOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {category.name}
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-1"></div>
                <Link
                  to="/experiences"
                  className="block px-4 py-2 ml-4 text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                  onClick={() => {
                    setMobileCategoriesOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  View All Experiences
                </Link>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No categories available
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavbarCategories;