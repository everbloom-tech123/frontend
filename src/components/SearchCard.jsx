import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Loader2 } from 'lucide-react';
import ExperienceService from '../Admin_Pages/ExperienceService';

const SearchCard = ({ experience, onClick }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const mainImageUrl = experience.imageUrls?.[0] || experience.imageUrl;
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative flex items-center gap-4 p-4 cursor-pointer rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-all"
      onClick={() => onClick(experience)}
    >
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-600">
        {imageLoading && mainImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Loader2 className="w-4 h-4 text-red-600 animate-spin"/>
          </div>
        )}
        {mainImageUrl && (
          <img
            src={ExperienceService.getImageUrl(mainImageUrl)}
            alt={experience.title}
            className={`h-full w-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoading(false)}
          />
        )}
        {experience.discount > 0 && (
          <div className="absolute top-0 right-0 bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{experience.discount}%
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white truncate">
            {experience.title}
          </h3>
          <span className="flex-shrink-0 text-xl font-bold text-white">
            {formatPrice(experience.price)}
          </span>
        </div>
        
        <p className="mt-1.5 text-sm text-gray-300 line-clamp-2">
          {experience.description}
        </p>
        
        {experience.location && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{experience.location.city}</span>
            <ChevronRight className="ml-auto h-5 w-5 text-red-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export { SearchCard };