import React from 'react';
import { motion } from 'framer-motion';
import { FaCompass, FaUtensils, FaMountain, FaTree, FaLandmark } from 'react-icons/fa';

const PlayfulCategories = ({ categories, onCategorySelect, activeCategory = 'All' }) => {
  // Icon mapping for categories
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Cultural': FaLandmark,
      'Adventure': FaCompass,
      'Culinary': FaUtensils,
      'Wildlife': FaTree,
      'All': FaMountain,
      // Add more mappings as needed
    };
    
    const IconComponent = iconMap[categoryName] || FaCompass;
    return <IconComponent className="mr-2" />;
  };

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
        <motion.button
          key="all"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            activeCategory === 'All'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-red-50 shadow-md'
          }`}
          onClick={() => onCategorySelect('All')}
        >
          {getCategoryIcon('All')}
          All Experiences
        </motion.button>

        {categories.map((category) => (
          <motion.button
            key={category.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeCategory === category.name
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-red-50 shadow-md'
            }`}
            onClick={() => onCategorySelect(category.name)}
          >
            {getCategoryIcon(category.name)}
            {category.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PlayfulCategories; 