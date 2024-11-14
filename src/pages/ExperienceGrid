import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ExperienceGrid = ({ 
  title,
  subtitle,
  experiences,
  layout = 'grid',
  columns = 3,
  showPrice = true,
  showViewDetails = true,
  className = '',
  onExperienceClick,
  filterOptions = null
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
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }[columns] || 'grid-cols-1 md:grid-cols-3';

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
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>
      )}

      {filterOptions && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filterOptions.map((option) => (
            <motion.button
              key={option.value}
              className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => option.onClick(option.value)}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      )}

      <div className={`${layout === 'grid' ? `grid ${gridClass} gap-8` : 'flex overflow-x-auto space-x-6 pb-4'}`}>
        {experiences.map((experience) => (
          <motion.div 
            key={experience.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="relative">
              <img 
                src={experience.imageUrl} 
                alt={experience.title} 
                className="w-full h-48 object-cover"
              />
              {experience.badge && (
                <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 m-2 rounded-md text-sm font-bold">
                  {experience.badge}
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{experience.title}</h3>
              {showPrice && (
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    Starting from ${experience.price}
                  </p>
                </div>
              )}
              {showViewDetails && (
                <Link 
                  to={`/experience/${experience.id}`}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300 inline-block"
                >
                  View Details
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ExperienceGrid;