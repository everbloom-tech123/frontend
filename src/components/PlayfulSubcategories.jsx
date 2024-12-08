import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTag } from 'react-icons/fa';
import CategoryService from '../services/CategoryService';

const PlayfulSubcategories = ({ categoryId, onSubcategorySelect, activeSubcategory = null }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const categoryData = await CategoryService.getCategoryById(categoryId);
        // Assuming the category data includes a subcategories array
        // Adjust this based on your actual API response structure
        const subcategoriesData = categoryData.subcategories || [];
        setSubcategories(subcategoriesData);
      } catch (err) {
        setError('Failed to fetch subcategories');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">Loading subcategories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!subcategories.length) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">No subcategories found for this category.</div>
      </div>
    );
  }

  return (
    <motion.div
      className="mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-wrap justify-center gap-4">
        {subcategories.map((subcategory, index) => (
          <motion.button
            // Using index as fallback if subcategory.id is not available
            key={subcategory.id || index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeSubcategory === subcategory.name
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-red-50 shadow-md'
            }`}
            onClick={() => onSubcategorySelect(subcategory)}
          >
            <FaTag className="mr-2" />
            {subcategory.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PlayfulSubcategories;