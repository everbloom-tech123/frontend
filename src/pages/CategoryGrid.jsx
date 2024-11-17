import React from 'react';
import { motion } from 'framer-motion';

const CategoryGrid = ({ 
  title,
  categories,
  columns = 4,
  className = '',
  onCategoryClick
}) => {
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

  const gridClass = {
    2: 'grid-cols-2 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }[columns] || 'grid-cols-2 md:grid-cols-4';

  return (
    <motion.section 
      className={`mb-16 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        </div>
      )}

      <div className={`grid ${gridClass} gap-8`}>
        {categories.map((category) => (
          <motion.div 
            key={category.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            onClick={() => onCategoryClick(category)}
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
              {category.experienceCount !== undefined && (
                <p className="text-red-600 font-medium">
                  {category.experienceCount} Experiences
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CategoryGrid;