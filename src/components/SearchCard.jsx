import React from 'react';
import { motion } from 'framer-motion';

const SearchCard = ({ experience, onClick }) => {
    // Function to truncate description while preserving whole words
    const truncateDescription = (text, maxLength = 100) => {
        if (!text || text.length <= maxLength) return text;
        const truncated = text.substr(0, maxLength);
        return truncated.substr(0, truncated.lastIndexOf(' ')) + '...';
    };

    // Format price to always show 2 decimal places
    const formatPrice = (price) => {
        return typeof price === 'number' ? `$${price.toFixed(2)}` : 'Price unavailable';
    };

    return (
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group cursor-pointer rounded-xl bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => onClick(experience)}
        >
            <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                <img
                    src={`/public/api/products/files/${experience.firstImageUrl}`}
                    alt={experience.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg'; // Fallback image
                        e.target.onerror = null;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                    {experience.title}
                </h3>
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {truncateDescription(experience.description)}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">
                        {formatPrice(experience.price)}
                    </span>
                    <span className="text-sm text-ceylon-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View Details →
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default SearchCard;