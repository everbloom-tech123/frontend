import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import ExperienceService from '../Admin_Pages/ExperienceService';

const MediaGallery = ({ media, activeMedia, onMediaChange }) => {
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
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

  // Log all media URLs for debugging
  useEffect(() => {
    console.log('All media URLs:', allMedia);
  }, [allMedia]);

  const isVideo = (mediaUrl) => media.videoUrl && processMediaUrl(media.videoUrl) === mediaUrl;

  // Test video URL validity
  const testVideoUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`Video URL ${url} - Status: ${response.status}, Content-Type: ${response.headers.get('Content-Type')}`);
      return response.ok && response.headers.get('Content-Type')?.startsWith('video/');
    } catch (err) {
      console.error('Error testing video URL:', err);
      return false;
    }
  };

  // Check video validity when active media changes
  useEffect(() => {
    if (allMedia.length > 0 && isVideo(allMedia[activeMedia])) {
      testVideoUrl(allMedia[activeMedia]).then(isValid => {
        if (!isValid) {
          setError('Video URL is invalid or not a video file');
        }
      });
    }
  }, [activeMedia, allMedia]);

  const handleVideoPlay = () => {
    if (videoRef.current) {
      setIsPlaying(true);
      setError(null);
      console.log('Attempting to play video:', allMedia[activeMedia]);
      videoRef.current.play()
        .then(() => console.log('Video playing successfully'))
        .catch(error => {
          console.error('Video playback error:', error);
          setError(`Failed to play video: ${error.message}`);
          setIsPlaying(false);
        });
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    console.log('Video playback ended');
  };

  // Early return after all hooks
  if (allMedia.length === 0) {
    return (
      <div className="relative w-full h-[600px] bg-gray-50 flex items-center justify-center rounded-none">
        <p className="text-gray-400 text-lg font-medium">No media available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-50">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeMedia}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isVideo(allMedia[activeMedia]) ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              {error ? (
                <div className="text-white text-center">
                  <p className="text-lg mb-3">{error}</p>
                  <button
                    onClick={handleVideoPlay}
                    className="px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
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
                    controls={true}
                    onEnded={handleVideoEnd}
                    onLoadStart={() => setLoading(true)}
                    onLoadedData={() => {
                      setLoading(false);
                      setError(null);
                      console.log('Video loaded successfully');
                    }}
                    onError={(e) => {
                      setLoading(false);
                      setError(`Video load error: ${e.target.error.message}`);
                      console.error('Video element error:', e.target.error);
                    }}
                  />
                  {!isPlaying && !error && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleVideoPlay}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition-all duration-300"
                    >
                      <Play className="w-20 h-20 text-white" />
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
              onLoad={() => setLoading(false)}
              onError={(e) => {
                setLoading(false);
                console.error('Image load error:', e);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {allMedia.length > 1 && (
        <>
          <button
            onClick={() => onMediaChange((activeMedia - 1 + allMedia.length) % allMedia.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-4 rounded-full hover:bg-white transition-all z-10 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => onMediaChange((activeMedia + 1) % allMedia.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-4 rounded-full hover:bg-white transition-all z-10 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {allMedia.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
          {allMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => onMediaChange(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeMedia === index
                  ? 'bg-white scale-125 shadow-lg'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to media ${index + 1}`}
            />
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-white border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default MediaGallery;