import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Paper } from '@mui/material';
import { LocationOn, AccessTime, Info, Star } from '@mui/icons-material';

const ExperienceContent = ({ experience }) => {
  const {
    description,
    additionalInfo,
    address,
    latitude,
    longitude,
    duration,
    sub_category,
    special,
    rating
  } = experience;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <section>
        <Typography variant="h5" className="font-bold mb-4 text-gray-900">
          About This Experience
        </Typography>
        <Paper elevation={0} className="p-8 bg-white rounded-xl shadow-sm">
          <Typography className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
            {description}
          </Typography>
        </Paper>
      </section>

      <section>
        <Typography variant="h5" className="font-bold mb-4 text-gray-900">
          Experience Details
        </Typography>
        <Paper elevation={0} className="p-8 bg-white rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Box className="flex items-start gap-4">
              <AccessTime className="text-gray-400 mt-1" />
              <div>
                <Typography variant="subtitle1" className="font-semibold text-gray-900 mb-1">
                  Duration
                </Typography>
                <Typography className="text-gray-600 text-lg">
                  {duration || 'Duration not specified'}
                </Typography>
              </div>
            </Box>
            
            {sub_category && sub_category.length > 0 && (
              <Box className="flex items-start gap-4">
                <div className="w-full">
                  <Typography variant="subtitle1" className="font-semibold text-gray-900 mb-3">
                    Categories
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {sub_category.map(sub => (
                      <span
                        key={sub.id}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Box>
            )}
            
            {special && (
              <Box className="flex items-start gap-4">
                <Star className="text-amber-400 mt-1" />
                <div>
                  <Typography variant="subtitle1" className="font-semibold text-gray-900 mb-1">
                    Premium Experience
                  </Typography>
                  <Typography className="text-gray-600 text-lg">
                    Exclusive features and benefits included
                  </Typography>
                </div>
              </Box>
            )}
          </div>
        </Paper>
      </section>

      <section>
        <Typography variant="h5" className="font-bold mb-4 text-gray-900">
          Location
        </Typography>
        <Paper elevation={0} className="p-8 bg-white rounded-xl shadow-sm space-y-6">
          <Box className="flex items-center gap-4">
            <LocationOn className="text-red-500" />
            <Typography variant="subtitle1" className="font-medium text-gray-900">
              {address}
            </Typography>
          </Box>
          <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-100">
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
          <Typography variant="caption" className="text-gray-500 block">
            Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Typography>
        </Paper>
      </section>

      {additionalInfo && (
        <section>
          <Typography variant="h5" className="font-bold mb-4 text-gray-900">
            Additional Information
          </Typography>
          <Paper elevation={0} className="p-8 bg-white rounded-xl shadow-sm">
            <Box className="flex items-start gap-4">
              <Info className="text-gray-400 mt-1" />
              <div
                className="text-gray-700 leading-relaxed prose max-w-none text-lg"
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