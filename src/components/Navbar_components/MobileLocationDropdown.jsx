import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import District from './DistrictList';

const MobileLocationDropdown = ({ mobileDistrictOpen, setMobileDistrictOpen }) => {
  return (
    <div className="py-2">
      <button
        onClick={() => setMobileDistrictOpen(!mobileDistrictOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-700"
      >
        <span>Locations</span>
        <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${mobileDistrictOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {mobileDistrictOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 bg-white rounded-md shadow-inner"
          >
            <District />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileLocationDropdown;