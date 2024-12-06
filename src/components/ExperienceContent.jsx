/* import React from 'react';
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

export default TabContent; */

import React from 'react';
import { motion } from 'framer-motion';
import ReviewList from './ReviewList';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { LocationOn, AccessTime, Category, Info, Star } from '@mui/icons-material';

const ExperienceContent = ({ experience }) => {
  const {
    description,
    additionalInfo,
    reviews,
    address,
    latitude,
    longitude,
    duration,
    category,
    subcategory,
    special,
    rating
  } = experience;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Overview Section */}
      <section className="space-y-4">
        <Typography variant="h5" className="font-bold">
          Experience Overview
        </Typography>
        <Paper elevation={1} className="p-6">
          <Typography className="text-gray-700 leading-relaxed whitespace-pre-line">
            {description}
          </Typography>
        </Paper>
      </section>

      {/* Key Details Section */}
      <section className="space-y-4">
        <Typography variant="h5" className="font-bold">
          Key Details
        </Typography>
        <Paper elevation={1} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Box className="flex items-start space-x-3">
            <AccessTime className="text-gray-500" />
            <div>
              <Typography variant="subtitle2" className="font-semibold">
                Duration
              </Typography>
              <Typography className="text-gray-600">
                {duration || 'Duration not specified'}
              </Typography>
            </div>
          </Box>
          <Box className="flex items-start space-x-3">
            <Category className="text-gray-500" />
            <div>
              <Typography variant="subtitle2" className="font-semibold">
                Category
              </Typography>
              <Typography className="text-gray-600">
                {category} {subcategory && `- ${subcategory}`}
              </Typography>
            </div>
          </Box>
          {special && (
            <Box className="flex items-start space-x-3">
              <Star className="text-yellow-500" />
              <div>
                <Typography variant="subtitle2" className="font-semibold">
                  Special Experience
                </Typography>
                <Typography className="text-gray-600">
                  This is a featured experience with exclusive benefits
                </Typography>
              </div>
            </Box>
          )}
        </Paper>
      </section>

      {/* Location Section */}
      <section className="space-y-4">
        <Typography variant="h5" className="font-bold">
          Location
        </Typography>
        <Paper elevation={1} className="p-6 space-y-4">
          <Box className="flex items-center space-x-3">
            <LocationOn className="text-red-500" />
            <Typography variant="subtitle1" className="font-medium">
              {address}
            </Typography>
          </Box>
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <iframe
              title="Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01}%2C${latitude-0.01}%2C${longitude+0.01}%2C${latitude+0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`}
              allowFullScreen
            />
          </div>
          <Typography variant="caption" className="text-gray-500 block mt-2">
            View location on map: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Typography>
        </Paper>
      </section>

      {/* Additional Information Section */}
      {additionalInfo && (
        <section className="space-y-4">
          <Typography variant="h5" className="font-bold">
            Additional Information
          </Typography>
          <Paper elevation={1} className="p-6">
            <Box className="flex items-start space-x-3">
              <Info className="text-gray-500 mt-1" />
              <div
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: additionalInfo }}
              />
            </Box>
          </Paper>
        </section>
      )}

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <section className="space-y-4">
          <Typography variant="h5" className="font-bold">
            Reviews
          </Typography>
          <Paper elevation={1} className="p-6">
            <Box className="flex items-center space-x-2 mb-4">
              <Star className="text-yellow-500" />
              <Typography variant="h6">
                {rating} out of 5
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                ({reviews.length} reviews)
              </Typography>
            </Box>
            <Divider className="mb-4" />
            <ReviewList reviews={reviews} />
          </Paper>
        </section>
      )}
    </motion.div>
  );
};

export default ExperienceContent;