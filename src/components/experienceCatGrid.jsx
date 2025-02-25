import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { Loader2 } from 'lucide-react';
import ExperienceService from '../Admin_Pages/ExperienceService'; // Ensure correct path

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
        whileHover={{ y: -5 }}
        onClick={() => onExperienceClick && onExperienceClick(experience)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black/80 z-10"/>

        <div className="relative aspect-[4/5]">
          {imageLoading && mainImageUrl && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Loader2 className="w-4 h-4 text-red-600 animate-spin"/>
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
            {experience.most_popular && (
              <div className="ribbon-container">
                <div className="ribbon">MOST POPULAR</div>
              </div>
            )}

            {experience.discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
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

// Main ExperienceCatGrid component
const ExperienceCatGrid = ({
  title,
  subtitle,
  experiences = [], // Use this as the source of truth
  layout = 'grid',
  columns = 4,
  showPrice = true,
  showViewDetails = true,
  className = '',
  onExperienceClick,
  filterOptions = null,
  isLoading = false,
  categoryIds = [], // This is only used if we need to fetch data directly
  fetchData = false // New prop to decide if this component should fetch data itself
}) => {
  const navigate = useNavigate();
  const [displayExperiences, setDisplayExperiences] = useState(experiences);
  const [loading, setLoading] = useState(isLoading);
  const [error, setError] = useState(null);

  console.log(`ExperienceCatGrid rendering with ${experiences.length} experiences`);

  // Animation variants
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

  // Only fetch if explicitly told to do so via the fetchData prop
  useEffect(() => {
    // Always update state with the experiences passed as props
    setDisplayExperiences(experiences);
    
    // Only fetch data if explicitly instructed to do so and categoryIds are provided
    if (fetchData && categoryIds && categoryIds.length > 0) {
      const fetchExperiences = async () => {
        setLoading(true);
        setError(null);
        try {
          console.log('Component is fetching experiences for categories:', categoryIds);
          const data = await ExperienceService.getExperiencesByCategories(categoryIds);
          setDisplayExperiences(data);
          console.log('Component fetched experiences:', data.length);
        } catch (err) {
          setError('Failed to load experiences');
          console.error('Error fetching experiences in component:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchExperiences();
    }
  }, [experiences, categoryIds, fetchData]);

  // Update loading state based on prop changes
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

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
      </div>

      {error && (
        <div className="text-center py-4 text-red-600">
          {error}
        </div>
      )}

      <div
        className={`
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-4
          ${layout === 'scroll' ? 'flex overflow-x-auto space-x-4 pb-4 hide-scrollbar' : ''}
        `}
      >
        {loading ? (
          // Show skeleton loaders while loading
          Array(8).fill(0).map((_, index) => (
            <div key={index}>
              <Skeleton variant="rectangular" className="aspect-[4/5]" />
            </div>
          ))
        ) : (
          // Show the experiences
          displayExperiences && displayExperiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onExperienceClick={onExperienceClick}
              showPrice={showPrice}
              showViewDetails={showViewDetails}
              itemVariants={itemVariants}
            />
          ))
        )}
      </div>

      {displayExperiences && displayExperiences.length === 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">No experiences found</p>
        </div>
      )}
    </motion.section>
  );
};

export default ExperienceCatGrid;