import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { Loader2 } from 'lucide-react';
import ExperienceService from '../Admin_Pages/ExperienceService';

const ExperienceCard = ({ 
  experience, 
  onExperienceClick, 
  showPrice, 
  showViewDetails,
  itemVariants 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const mainImageUrl = experience.imageUrls?.[0] || experience.imageUrl;
  
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

  const discountedPrice = getDiscountedPrice(experience.price, experience.discount);

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300"
      variants={itemVariants}
      whileHover={{ y: -5 }}
      onClick={() => onExperienceClick && onExperienceClick(experience)}
    >
      <div className="relative aspect-w-16 aspect-h-9">
        {imageLoading && mainImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        )}
        {mainImageUrl && (
          <img 
            src={ExperienceService.getImageUrl(mainImageUrl)}
            alt={experience.title}
            className={`w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
          />
        )}
        {experience.discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            {experience.discount}% OFF
          </div>
        )}
        {experience.category && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm shadow-lg">
            {experience.category}
          </div>
        )}
      </div>

      <div className="p-6 h-[279px]">
        <div className="h-full flex flex-col">
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-1">
              {experience.title}
            </h3>
            
            {experience.description && (
              <p className="text-sm font-semibold text-gray-600 mb-6 line-clamp-2 leading-relaxed min-h-[40px]">
                {experience.description}
              </p>
            )}

            <div className="min-h-[32px] mb-6">
              {experience.tags && experience.tags.length > 0 && (
                <div className="flex gap-2">
                  {experience.tags.slice(0, 2).map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {showPrice && (
            <div className="mt-auto pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-red-600">
                      {formatPrice(discountedPrice)}
                    </span>
                    {experience.discount > 0 && (
                      <span className="text-lg line-through text-gray-400">
                        {formatPrice(experience.price)}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-600 text-sm block mt-1">/per person</span>
                </div>

                {showViewDetails && (
                  <Link 
                    to={`/experience/${experience.id}`}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-full transition duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onExperienceClick) onExperienceClick(experience);
                    }}
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

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

  const renderSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
      <Skeleton variant="rectangular" height={224} />
      <div className="p-6 h-[272px]">
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
          : experiences.map(experience => (
              <ExperienceCard 
                key={experience.id}
                experience={experience}
                onExperienceClick={onExperienceClick}
                showPrice={showPrice}
                showViewDetails={showViewDetails}
                itemVariants={itemVariants}
              />
            ))
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