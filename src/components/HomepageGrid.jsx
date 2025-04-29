// Just keep the original HomepageGrid component with minimal changes
// DO NOT rewrite it to use ExperienceGrid

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { Loader2 } from 'lucide-react';
import ExperienceService from '../Admin_Pages/ExperienceService';

// Keep the original styles
const styles = `
  .ribbon-container {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 120px;
    height: 120px;
    overflow: hidden;
    pointer-events: none;
  }

  .ribbon {
    position: absolute;
    top: 32px;
    right: -35px;
    background: linear-gradient(45deg, #d62828 0%, #ff3333 100%);
    color: white;
    padding: 5px 0;
    width: 150px;
    text-align: center;
    font-size: 11px;
    font-weight: bold;
    transform: rotate(45deg);
    box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
    text-shadow: 0 1px 1px rgba(0,0,0,0.2);
    letter-spacing: 0.5px;
  }

  .ribbon::before {
    content: '';
    position: absolute;
    left: 0px;
    top: 100%;
    z-index: -1;
    border-left: 2px solid #8c1c1c;
    border-right: 2px solid transparent;
    border-bottom: 2px solid transparent;
    border-top: 2px solid #8c1c1c;
    box-shadow: -1px -1px 1px rgba(0,0,0,0.1);
  }

  .ribbon::after {
    content: '';
    position: absolute;
    right: 0px;
    top: 100%;
    z-index: -1;
    border-left: 2px solid transparent;
    border-right: 2px solid #8c1c1c;
    border-bottom: 2px solid transparent;
    border-top: 2px solid #8c1c1c;
    box-shadow: 1px -1px 1px rgba(0,0,0,0.1);
  }
`;

// Keep the ExperienceCard component mostly the same
const ExperienceCard = ({ 
  experience, 
  onExperienceClick, 
  showPrice, 
  showViewDetails,
  itemVariants 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  
  // Use imageUrls[0] with a fallback placeholder
  const mainImageUrl = experience.imageUrls?.[0] || 'https://via.placeholder.com/400x500?text=No+Image';
  
  // Parse tags to handle stringified "[]" or invalid formats
  const parsedTags = (() => {
    try {
      if (!experience.tags || experience.tags.length === 0) return [];
      // Handle case where tags is ["[]"]
      if (experience.tags[0] === '[]') return [];
      // Assume tags are already an array of strings
      return experience.tags.filter(tag => typeof tag === 'string' && tag.trim() !== '');
    } catch (e) {
      console.warn('Error parsing tags:', experience.tags, e);
      return [];
    }
  })();

  // Use first subcategory name as category, or fallback
  const category = experience.sub_category?.[0]?.name || 'General';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  };

  const getDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * (discount / 100));
  };

  const discountedPrice = getDiscountedPrice(experience.price, experience.discount);

  return (
    <>
      <style>{styles}</style>
      <motion.div
        className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300"
        variants={itemVariants}
        whileHover={{y: -5}}
        onClick={() => onExperienceClick && onExperienceClick(experience)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black/80 z-10"/>

        <div className="relative aspect-[4/5]">
          {imageLoading && mainImageUrl && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Loader2 className="w-4 h-4 text-red-600 animate-spin"/>
            </div>
          )}
          <img
            src={ExperienceService.getImageUrl(mainImageUrl)}
            alt={experience.title}
            className={`absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)} // Handle image load errors
          />

          <div className="relative z-20 h-full">
            {/* Most Popular Ribbon */}
            {experience.most_popular && (
              <div className="ribbon-container">
                <div className="ribbon">MOST POPULAR</div>
              </div>
            )}

            {/* Discount Badge */}
            {experience.discount > 0 && (
              <div className="absolute top-14 left-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
                {experience.discount}% OFF
              </div>
            )}
            
            {category && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs shadow-lg">
                {category}
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
                  {parsedTags.length > 0 ? (
                    <div className="flex gap-1">
                      {parsedTags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
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
                          View
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
    </>
  );
};

// Keep the original HomepageGrid component but fix the props issue
const HomepageGrid = ({
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
  isLoading = false,
  maxDisplay = 6,
  viewAllLink
}) => {
  const navigate = useNavigate();
  
  // Safety check for experiences array
  const validExperiences = Array.isArray(experiences) ? experiences : [];
  
  // Use maxDisplay prop to determine how many experiences to show
  const showViewAll = viewAllLink && validExperiences.length > maxDisplay;
  const displayedExperiences = maxDisplay ? validExperiences.slice(0, maxDisplay) : validExperiences;

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

  // Simple check to hide empty sections when not loading
  if (!isLoading && validExperiences.length === 0) {
    return null;
  }

  return (
    <motion.section
      className={`mb-12 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-start">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm font-semibold max-w-xl text-gray-500 leading-snug hover:text-black-600 transition-colors duration-300">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {showViewAll && (
          <button
            onClick={() => navigate(viewAllLink)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            View All
          </button>
        )}
      </div>

      <div
        className={`
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4
          ${layout === 'scroll' ? 'flex overflow-x-auto space-x-4 pb-4 hide-scrollbar' : ''}
        `}
      >
        {isLoading
          ? Array(8).fill(0).map((_, index) => (
              <div key={index} className="w-full">
                <Skeleton variant="rectangular" className="aspect-[4/5] w-full h-full rounded-2xl"/>
              </div>
            ))
          : displayedExperiences.map(experience => (
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
    </motion.section>
  );
};

export default HomepageGrid;