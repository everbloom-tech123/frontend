import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/outline';

const PlayfulCities = ({ districtId, onCitySelect, activeCity, cities }) => {
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
        {cities.map((city, index) => (
          <motion.button
            key={city.id || index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeCity === city.name
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md'
            }`}
            onClick={() => onCitySelect(city.name)}
          >
            <MapPinIcon className="w-5 h-5 mr-2" />
            {city.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PlayfulCities;