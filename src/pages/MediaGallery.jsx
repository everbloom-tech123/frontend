import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';

const MediaGallery = ({ media, activeMedia, onMediaChange, onVideoClick, isVideoPlaying, onBack }) => {
  // Combine all media sources into one array
  const allMedia = [
    ...(media.imageUrls ? (Array.isArray(media.imageUrls) ? media.imageUrls : [media.imageUrls]) : []),
    ...(media.imageUrl ? [media.imageUrl] : []),
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
                  src={`${process.env.REACT_APP_API_URL}/public/api/products/files/${allMedia[activeMedia]}`}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
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
            <img
              src={`${process.env.REACT_APP_API_URL}/public/api/products/files/${allMedia[activeMedia]}`}
              alt={`Experience ${activeMedia + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

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

      <button
        onClick={onBack}
        className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
      >
        <FaArrowLeft />
      </button>

      {/* Thumbnail navigation */}
      {allMedia.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {allMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => onMediaChange(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeMedia === index ? 'bg-red-600 scale-125' : 'bg-white opacity-60 hover:opacity-100'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;