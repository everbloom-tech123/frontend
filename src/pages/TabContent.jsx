import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewList from './ReviewList';

const TabContent = ({ selectedTab, experience }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={selectedTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="mt-4"
    >
      {selectedTab === 'description' && (
        <p className="text-gray-600 leading-relaxed">{experience.description}</p>
      )}
      {selectedTab === 'additional info' && (
        <div
          className="text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: experience.additionalInfo }}
        />
      )}
      {selectedTab === 'reviews' && <ReviewList reviews={experience.reviews} />}
    </motion.div>
  </AnimatePresence>
);

export default TabContent;