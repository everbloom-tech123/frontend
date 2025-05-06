import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const NavbarCategories = ({ categoriesOpen, handleCategoriesEnter, handleCategoriesLeave, isLoadingCategories, navbarCategories, setCategoriesOpen }) => {
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
            className="absolute left-0 w-56 mt-2 z-50 bg-white shadow-lg rounded-md overflow-hidden"
          >
            {isLoadingCategories ? (
              <div className="p-4 text-center">Loading categories...</div>
            ) : navbarCategories.length > 0 ? (
              <div className="py-1">
                {navbarCategories.map(category => (
                  <Link
                    key={category.id}
                    to={`/viewby/${category.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-1"></div>
                <Link
                  to="/experiences"
                  className="block px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
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

export default NavbarCategories;