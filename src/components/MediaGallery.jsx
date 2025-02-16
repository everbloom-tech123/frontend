import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import ExperienceService from '../Admin_Pages/ExperienceService';

const MediaGallery = ({ media, activeMedia, onMediaChange, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  const processMediaUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : ExperienceService.getFileUrl(url);
  };

  const allMedia = [
    ...(media.imageUrl ? [processMediaUrl(media.imageUrl)] : []),
    ...(Array.isArray(media.imageUrls) ? media.imageUrls.map(processMediaUrl) : []),
    ...(media.videoUrl ? [processMediaUrl(media.videoUrl)] : [])
  ].filter(Boolean);

  if (allMedia.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No media available</p>
      </div>
    );
  }

  const isVideo = (mediaUrl) => media.videoUrl && processMediaUrl(media.videoUrl) === mediaUrl;

  const handleVideoPlay = () => {
    if (videoRef.current) {
      setIsPlaying(true);
      setError(false);
      videoRef.current.play().catch(error => {
        console.error('Video playback error:', error);
        setError(true);
        setIsPlaying(false);
      });
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeMedia}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isVideo(allMedia[activeMedia]) ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              {error ? (
                <div className="text-white text-center">
                  <p>Error playing video</p>
                  <button 
                    onClick={handleVideoPlay}
                    className="mt-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={allMedia[activeMedia]}
                    className="w-full h-full object-contain"
                    controls={isPlaying}
                    onEnded={handleVideoEnd}
                    onLoadStart={() => setLoading(true)}
                    onLoadedData={() => {
                      setLoading(false);
                      setError(false);
                    }}
                    onError={() => {
                      setLoading(false);
                      setError(true);
                    }}
                  />
                  {!isPlaying && !error && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleVideoPlay}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-all"
                    >
                      <Play className="w-16 h-16 text-white" />
                    </motion.button>
                  )}
                </>
              )}
            </div>
          ) : (
            <img
              src={allMedia[activeMedia]}
              alt={`Media ${activeMedia + 1}`}
              className="w-full h-full object-contain"
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
              onError={(e) => {
                setLoading(false);
                e.target.src = '/api/placeholder/800/600';
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {allMedia.length > 1 && (
        <>
          <button
            onClick={() => onMediaChange((activeMedia - 1 + allMedia.length) % allMedia.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => onMediaChange((activeMedia + 1) % allMedia.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <button
        onClick={onBack}
        className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {allMedia.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
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

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default MediaGallery;