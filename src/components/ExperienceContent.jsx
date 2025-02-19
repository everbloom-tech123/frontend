import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { LocationOn, AccessTime, Category, Info, Star } from '@mui/icons-material';

const ExperienceContent = ({ experience }) => {
  const {
    description,
    additionalInfo,
    address,
    latitude,
    longitude,
    duration,
    subcategoryDetails,
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
                Subcategories
              </Typography>
              <Typography className="text-gray-600">
                {subcategoryDetails ? subcategoryDetails.map(sub => sub.name).join(', ') : 'Not specified'}
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
    </motion.div>
  );
};

export default ExperienceContent;