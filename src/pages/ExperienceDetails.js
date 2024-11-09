import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaPlay, FaArrowLeft, FaEye, FaHeart, FaShare, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import config from '../config';
import { 
  getCurrentUser, 
  isAuthenticated, 
  getToken,
  refreshToken
} from '../services/AuthService';

const API_BASE_URL = `${config.API_BASE_URL}/public/api/products`;
const API_BASE_URL2 = `${config.API_BASE_URL}/public/api/wishlist`;

const ExperienceDetails = () => {
  const { experienceId } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [activeMedia, setActiveMedia] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('description');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authenticated = isAuthenticated();
        setIsUserAuthenticated(authenticated);
        if (authenticated) {
          const user = getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();
  }, []);

  // Axios instance with authentication
  const authenticatedAxios = axios.create();
  authenticatedAxios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle token refresh
  authenticatedAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshToken();
          const token = getToken();
          authenticatedAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return authenticatedAxios(originalRequest);
        } catch (refreshError) {
          navigate('/login', { state: { from: `/experience/${experienceId}` } });
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const handleErrorResponse = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return 'Bad request. Please try again.';
        case 401:
          return 'Authentication error. Please log in again.';
        case 404:
          return 'Experience not found.';
        default:
          return `An error occurred: ${error.response.data.message || 'Unknown error'}`;
      }
    } else if (error.request) {
      return 'No response received from the server. Please check your internet connection.';
    } else {
      return `Error: ${error.message}`;
    }
  };

  const generateFakeReviews = (count) => {
    const reviews = [];
    for (let i = 0; i < count; i++) {
      reviews.push({
        id: i + 1,
        user: `User${i + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `This experience was ${['amazing', 'fantastic', 'wonderful', 'great', 'superb'][Math.floor(Math.random() * 5)]}! I would definitely recommend it to others.`,
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
        replies: Math.random() > 0.5 ? [{
          user: 'Host',
          avatar: 'https://i.pravatar.cc/150?img=66',
          comment: 'Thank you for your feedback! We are glad you enjoyed the experience.',
          date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString()
        }] : []
      });
    }
    return reviews;
  };

  const fetchExperienceDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch experience details
      const response = await authenticatedAxios.get(`${API_BASE_URL}/${experienceId}`);
      setExperience({
        ...response.data,
        viewCount: Math.floor(Math.random() * 10000) + 1000,
        reviews: generateFakeReviews(5)
      });

      // Check wishlist status if authenticated
      if (isUserAuthenticated) {
        try {
          const wishlistResponse = await authenticatedAxios.get(`${API_BASE_URL2}/check/${experienceId}`);
          setIsInWishlist(wishlistResponse.data);
        } catch (wishlistError) {
          console.error('Error checking wishlist status:', wishlistError);
        }
      }
    } catch (err) {
      console.error('Error fetching experience details:', err);
      setError(handleErrorResponse(err));
    } finally {
      setLoading(false);
    }
  }, [experienceId, isUserAuthenticated]);

  useEffect(() => {
    fetchExperienceDetails();
  }, [fetchExperienceDetails]);

  const handleMediaChange = (index) => {
    setActiveMedia(index);
    setIsVideoPlaying(false);
  };

  const handleVideoClick = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleWishlistToggle = async () => {
    if (!isUserAuthenticated) {
      navigate('/login', { state: { from: `/experience/${experienceId}` } });
      return;
    }

    try {
      if (isInWishlist) {
        await authenticatedAxios.delete(`${API_BASE_URL2}/${experienceId}`);
      } else {
        await authenticatedAxios.post(`${API_BASE_URL2}`, { experienceId });
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: `/experience/${experienceId}` } });
      } else {
        setError(handleErrorResponse(error));
      }
    }
  };

  const handleBooking = () => {
    if (!isUserAuthenticated) {
      navigate('/login', { state: { from: `/experience/${experienceId}` } });
      return;
    }
    navigate(`/booking/${experienceId}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center mt-8 text-red-600">
      <h2 className="text-2xl font-bold mb-4">Error</h2>
      <p>{error}</p>
      {error.includes('Authentication error') && (
        <button 
          onClick={() => navigate('/login', { state: { from: `/experience/${experienceId}` } })} 
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Login
        </button>
      )}
      <button 
        onClick={() => navigate(-1)} 
        className="mt-4 ml-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
      >
        Go Back
      </button>
    </div>
  );

  if (!experience) return <div className="text-center mt-8">No experience found.</div>;

  const allMedia = [...(experience.imageUrls || []), experience.videoUrl].filter(Boolean);

  return (
    <div className="bg-white min-h-screen">
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
            {activeMedia === allMedia.length - 1 && experience.videoUrl ? (
              <div className="w-full h-full bg-black flex items-center justify-center">
                {isVideoPlaying ? (
                  <video
                    src={`/public/api/products/files/${experience.videoUrl}`}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleVideoClick}
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
          onClick={() => handleMediaChange((activeMedia - 1 + allMedia.length) % allMedia.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-300"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => handleMediaChange((activeMedia + 1) % allMedia.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-300"
        >
          <FaChevronRight />
        </button>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
        >
          <FaArrowLeft />
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{experience.title}</h1>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center mb-4 space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`${
                        index < (experience.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                      } text-xl`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">({experience.reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaEye className="mr-2" />
                  {experience.viewCount?.toLocaleString() || 0} views
                </div>
              </div>

              <div className="mb-6">
                <div className="flex border-b">
                  {['description', 'additional info', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 font-semibold ${
                        selectedTab === tab
                          ? 'text-red-600 border-b-2 border-red-600'
                          : 'text-gray-600 hover:text-red-600'
                      }`}
                      onClick={() => setSelectedTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

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
                    {selectedTab === 'reviews' && (
                      <div className="space-y-6">
                        {experience.reviews?.map((review) => (
                          <div key={review.id} className="border-b pb-6">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <img src={review.avatar} alt={review.user} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                  <p className="font-semibold text-lg">{review.user}</p>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                      <FaStar
                                        key={index}
                                        className={`${
                                          index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                        } text-sm`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div><p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                            <p className="mt-2 text-gray-600">{review.comment}</p>
                            {review.replies.map((reply, index) => (
                              <div key={index} className="ml-12 mt-4 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <img src={reply.avatar} alt={reply.user} className="w-10 h-10 rounded-full mr-3" />
                                    <p className="font-semibold">{reply.user}</p>
                                  </div>
                                  <p className="text-sm text-gray-500">{reply.date}</p>
                                </div>
                                <p className="mt-1 text-gray-600">{reply.comment}</p>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Book this experience</h2>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    ${experience.price?.toFixed(2)}
                  </p>
                  {experience.discount > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      ${((experience.price || 0) / (1 - (experience.discount || 0) / 100)).toFixed(2)}
                    </p>
                  )}
                </div>
                {experience.discount > 0 && (
                  <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {experience.discount}% OFF
                  </div>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBooking}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full text-lg transition duration-300"
              >
                {isUserAuthenticated ? 'Book Now' : 'Login to Book'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlistToggle}
                className={`w-full mt-4 border font-bold py-3 px-4 rounded-full text-lg transition duration-300 flex items-center justify-center ${
                  isInWishlist
                    ? 'bg-red-100 text-red-600 border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <FaHeart className={`mr-2 ${isInWishlist ? 'text-red-600' : 'text-gray-400'}`} />
                {isUserAuthenticated 
                  ? (isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')
                  : 'Login to Save'
                }
              </motion.button>

              {currentUser && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Logged in as:</p>
                  <p className="font-semibold">{currentUser.username}</p>
                  <p className="text-gray-500 text-sm">{currentUser.email}</p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Share this experience</h3>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: experience.title,
                          text: experience.description,
                          url: window.location.href
                        }).catch(console.error);
                      }
                    }}
                    className="text-red-600 hover:text-red-700 transition duration-300"
                  >
                    <FaShare className="text-2xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;