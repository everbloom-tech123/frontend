import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';

const MediaGallery = ({ media, activeMedia, onMediaChange, onVideoClick, isVideoPlaying, onBack }) => {
  const allMedia = [...(media.imageUrls || []), media.videoUrl].filter(Boolean);

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
          {activeMedia === allMedia.length - 1 && media.videoUrl ? (
            <div className="w-full h-full bg-black flex items-center justify-center">
              {isVideoPlaying ? (
                <video
                  src={`/public/api/products/files/${media.videoUrl}`}
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
              src={`/public/api/products/files/${allMedia[activeMedia]}`}
              alt={`Experience ${activeMedia + 1}`}
              className="w-full h-full object-contain"
            />
          )}
        </motion.div>
      </AnimatePresence>

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
      <button
        onClick={onBack}
        className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
      >
        <FaArrowLeft />
      </button>
    </div>
  );
};

export default MediaGallery;