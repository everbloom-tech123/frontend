import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';

const MediaGallery = ({ media, activeMedia, onMediaChange, onVideoClick, isVideoPlaying, onBack }) => {
  const [loading, setLoading] = useState(false);

  // Combine all media sources into one array
  const allMedia = [
    ...(media.imageUrl ? [media.imageUrl] : []),
    ...(Array.isArray(media.imageUrls) ? media.imageUrls : []),
    ...(media.videoUrl ? [media.videoUrl] : [])
  ].filter(Boolean);

  // Don't render if no media available
  if (allMedia.length === 0) {
    return (
      <div className="relative w-full h-[70vh] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-600">No media available</p>
      </div>
    );
  }

  const isVideo = (mediaUrl) => media.videoUrl === mediaUrl;

  return (
    <div className="relative w-full h-[70vh] bg-gray-200">
      <AnimatePresence initial={false}>
        <motion.div
          key={activeMedia}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isVideo(allMedia[activeMedia]) ? (
            <div className="w-full h-full bg-black flex items-center justify-center">
              {isVideoPlaying ? (
                <video
                  src={allMedia[activeMedia]}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  onLoadStart={() => setLoading(true)}
                  onLoadedData={() => setLoading(false)}
                  onError={(e) => {
                    console.error('Video loading error:', e);
                    setLoading(false);
                  }}
                />
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onVideoClick}
                  className="text-white text-6xl hover:text-red-600 transition duration-300"
                >
                  <FaPlay />
                </motion.button>
              )}
            </div>
          ) : (
            <motion.img
              src={allMedia[activeMedia]}
              alt={`Experience ${activeMedia + 1}`}
              className="w-full h-full object-contain"
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
              onError={(e) => {
                console.error('Image loading error:', e);
                setLoading(false);
                // Fixed: Use the correct placeholder API endpoint
                e.target.src = '/api/placeholder/800/600';
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Rest of the component remains the same */}
      {/* Navigation controls */}
      {allMedia.length > 1 && (
        <>
          <button
            onClick={() => onMediaChange((activeMedia - 1 + allMedia.length) % allMedia.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-300"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => onMediaChange((activeMedia + 1) % allMedia.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-300"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300 z-10"
      >
        <FaArrowLeft />
      </button>

      {/* Media indicators */}
      {allMedia.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {allMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => onMediaChange(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeMedia === index ? 'bg-red-600 scale-125' : 'bg-white opacity-60 hover:opacity-100'
              }`}
              aria-label={`Go to media ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Loading state indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default MediaGallery;