import React from 'react';
import { motion } from 'framer-motion';
import { FaTag } from 'react-icons/fa';

const PlayfulSubcategories = ({ categoryId, onSubcategorySelect, activeSubcategory, subcategories }) => {
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
            key={subcategory || index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeSubcategory === subcategory
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-red-50 shadow-md'
            }`}
            onClick={() => onSubcategorySelect(subcategory)}
          >
            <FaTag className="mr-2" />
            {subcategory}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PlayfulSubcategories;