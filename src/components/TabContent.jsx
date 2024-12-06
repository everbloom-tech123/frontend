import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewList from './ReviewList';
import { Box, Typography, Paper } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

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
      {selectedTab === 'location' && (
        <div className="space-y-4">
          <Paper elevation={1} className="p-4">
            <Box className="flex items-center space-x-2">
              <LocationOn color="primary" />
              <Typography variant="subtitle1" className="font-medium">
                {experience.address}
              </Typography>
            </Box>
          </Paper>
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <iframe
              title="Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${experience.longitude-0.01}%2C${experience.latitude-0.01}%2C${experience.longitude+0.01}%2C${experience.latitude+0.01}&layer=mapnik&marker=${experience.latitude}%2C${experience.longitude}`}
            />
          </div>
        </div>
      )}
    </motion.div>
  </AnimatePresence>
);

export default TabContent;