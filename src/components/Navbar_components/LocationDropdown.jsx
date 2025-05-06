import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import District from './DistrictList';

const LocationDropdown = ({ districtOpen, handleDistrictEnter, handleDistrictLeave }) => {
  return (
    <div
      className="relative group"
      onMouseEnter={handleDistrictEnter}
      onMouseLeave={handleDistrictLeave}
    >
      <Link
        to="/locations"
        className="flex items-center space-x-1 text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
      >
        <span>Locations</span>
        <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${districtOpen ? 'rotate-180' : ''}`} />
      </Link>
      <AnimatePresence>
        {districtOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 w-80 mt-2 z-50 bg-white shadow-lg rounded-md overflow-hidden"
          >
            <District />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationDropdown;