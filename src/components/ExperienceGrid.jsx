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
      className="relative bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300"
      variants={itemVariants}
      whileHover={{ y: -5 }}
      onClick={() => onExperienceClick && onExperienceClick(experience)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black/80 z-10"/>
      
      <div className="relative aspect-[4/5]">
        {imageLoading && mainImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
          </div>
        )}
        {mainImageUrl && (
          <img 
            src={ExperienceService.getImageUrl(mainImageUrl)}
            alt={experience.title}
            className={`absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
          />
        )}

        <div className="relative z-20 h-full">
          {experience.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
              {experience.discount}% OFF
            </div>
          )}
          {experience.category && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs shadow-lg">
              {experience.category}
            </div>
          )}

          <div className="absolute bottom-0 w-full p-3">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white line-clamp-1">
                {experience.title}
              </h3>
              
              {experience.description && (
                <p className="text-xs font-medium text-white/80 line-clamp-2 leading-relaxed">
                  {experience.description}
                </p>
              )}

              <div className="min-h-[24px]">
                {experience.tags && experience.tags.length > 0 && (
                  <div className="flex gap-1">
                    {experience.tags.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {showPrice && (
                <div className="pt-2 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white">
                          {formatPrice(discountedPrice)}
                        </span>
                        {experience.discount > 0 && (
                          <span className="text-xs line-through text-white/60">
                            {formatPrice(experience.price)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/80 block">/per person</span>
                    </div>

                    {showViewDetails && (
                      <Link 
                        to={`/experience/${experience.id}`}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-2 py-1 rounded-full text-xs shadow-sm hover:shadow transition-all"
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
  columns = 4,
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

  return (
    <motion.section 
      className={`mb-12 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {title && (
        <div className="flex flex-col items-start mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {title}
              <span className="text-red-200 mx-2">:</span>
            </h2>
            {subtitle && (
              <p className="text-sm font-semibold max-w-xl text-gray-500 leading-snug hover:text-black-600 transition-colors duration-300">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div 
        className={`
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
          ${layout === 'scroll' ? 'flex overflow-x-auto space-x-4 pb-4 hide-scrollbar' : ''}
        `}
      >
        {isLoading
          ? Array(8).fill(0).map((_, index) => (
              <div key={index}>
                <Skeleton variant="rectangular" className="aspect-[4/5]" />
              </div>
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
        <div className="text-center py-4">
          <p className="text-gray-600">No experiences found</p>
        </div>
      )}
    </motion.section>
  );
};

export default ExperienceGrid;