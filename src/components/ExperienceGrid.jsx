import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import ExperienceService from '../Admin_Pages/ExperienceService';

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
  filterOptions = null,
  isLoading = false
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * (discount / 100));
  };

  const renderExperienceCard = (experience) => {
    const discountedPrice = getDiscountedPrice(experience.price, experience.discount);
    const mainImageUrl = experience.imageUrls?.[0] || experience.imageUrl;
    
    return (
      <motion.div 
        key={experience.id}
        className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300"
        variants={itemVariants}
        whileHover={{ y: -5 }}
        onClick={() => onExperienceClick && onExperienceClick(experience)}
      >
        <div className="relative aspect-w-16 aspect-h-9">
          <img 
            src={ExperienceService.getImageUrl(mainImageUrl)} 
            alt={experience.title}
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          {experience.discount > 0 && (
            <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 m-2 rounded-md text-sm font-bold">
              {experience.discount}% OFF
            </div>
          )}
          {experience.category && (
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 m-2 rounded-md text-sm">
              {experience.category}
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {experience.title}
          </h3>
          
          {experience.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">
              {experience.description}
            </p>
          )}

          {showPrice && (
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-600">
                  {experience.discount > 0 && (
                    <span className="line-through text-gray-400 mr-2">
                      {formatPrice(experience.price)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(discountedPrice)}
                  </span>
                </p>
              </div>
              {experience.tags && experience.tags.length > 0 && (
                <div className="flex gap-1">
                  {experience.tags.slice(0, 2).map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {showViewDetails && (
            // In ExperienceGrid.jsx, change the Link like this:
            <Link 
            to={`/experience/${experience.id}`}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300 inline-block w-full text-center"
            onClick={() => {
              console.log('Clicking experience with ID:', experience.id);
              if (onExperienceClick) onExperienceClick(experience);
            }}
          >
            View Details
          </Link>
          )}
        </div>
      </motion.div>
    );
  };

  const renderSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton variant="rectangular" height={200} />
      <div className="p-6">
        <Skeleton variant="text" height={32} width="80%" />
        <Skeleton variant="text" height={20} width="60%" />
        <div className="mt-4">
          <Skeleton variant="rectangular" height={36} width="100%" />
        </div>
      </div>
    </div>
  );

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

      <div 
        className={`
          ${layout === 'grid' ? `grid ${gridClass} gap-8` : 'flex overflow-x-auto space-x-6 pb-4'}
          ${layout === 'scroll' ? 'hide-scrollbar' : ''}
        `}
      >
        {isLoading
          ? Array(6).fill(0).map((_, index) => (
              <div key={index}>{renderSkeleton()}</div>
            ))
          : experiences.map(experience => renderExperienceCard(experience))
        }
      </div>

      {experiences.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No experiences found</p>
        </div>
      )}
    </motion.section>
  );
};

export default ExperienceGrid;