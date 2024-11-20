import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { 
  getCurrentUser, 
  isAuthenticated, 
  getToken,
  refreshToken
} from '../services/AuthService';
import MediaGallery from './MediaGallery.jsx';
import RatingInfo from './RatingInfo.jsx';
import TabContent from './TabContent.jsx';
import BookingCard from './BookingCard.jsx';

const API_BASE_URL = `${config.API_BASE_URL}/public/api/products`;
const API_BASE_URL2 = `${config.API_BASE_URL}/public/api/wishlist`;

const ExperienceDetails = () => {
  const { id } = useParams();
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

  useEffect(() => {
    initializeAuth();
  }, []);

  const authenticatedAxios = axios.create();
  
  authenticatedAxios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

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
          navigate('/login', { state: { from: `/experience/${id}` } });
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const handleErrorResponse = useCallback((error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400: return 'Bad request. Please try again.';
        case 401: return 'Authentication error. Please log in again.';
        case 404: return 'Experience not found.';
        default: return `An error occurred: ${error.response.data.message || 'Unknown error'}`;
      }
    }
    if (error.request) return 'No response received from the server. Please check your internet connection.';
    return `Error: ${error.message}`;
  }, []);

  const generateFakeReviews = useCallback((count) => {
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
  }, []);

  const fetchExperienceDetails = useCallback(async () => {
    if (!id) {
      setError('Experience ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await authenticatedAxios.get(`${API_BASE_URL}/${id}`);
      if (!response.data) {
        throw new Error('Experience not found');
      }

      setExperience({
        ...response.data,
        viewCount: Math.floor(Math.random() * 10000) + 1000,
        reviews: generateFakeReviews(5)
      });

      if (isUserAuthenticated) {
        try {
          const wishlistResponse = await authenticatedAxios.get(`${API_BASE_URL2}/check/${id}`);
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
  }, [id, isUserAuthenticated, generateFakeReviews, handleErrorResponse]);

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
      navigate('/login', { state: { from: `/experience/${id}` } });
      return;
    }

    try {
      if (isInWishlist) {
        await authenticatedAxios.delete(`${API_BASE_URL2}/${id}`);
      } else {
        await authenticatedAxios.post(`${API_BASE_URL2}`, { experienceId: id });
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: `/experience/${id}` } });
      } else {
        setError(handleErrorResponse(error));
      }
    }
  };

  const handleBooking = () => {
    if (!isUserAuthenticated) {
      navigate('/login', { state: { from: `/experience/${id}` } });
      return;
    }
    navigate(`/booking/${id}`);
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
          onClick={() => navigate('/login', { state: { from: `/experience/${id}` } })} 
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

  if (!experience) return (
    <div className="text-center mt-8">No experience found.</div>
  );

  return (
    <div className="bg-white min-h-screen">
      <MediaGallery
        media={experience}
        activeMedia={activeMedia}
        onMediaChange={handleMediaChange}
        onVideoClick={handleVideoClick}
        isVideoPlaying={isVideoPlaying}
        onBack={() => navigate(-1)}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{experience.title}</h1>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <RatingInfo
                rating={experience.rating}
                reviewCount={experience.reviews?.length}
                viewCount={experience.viewCount}
              />

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

                <TabContent
                  selectedTab={selectedTab}
                  experience={experience}
                />
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <BookingCard
              experience={experience}
              isUserAuthenticated={isUserAuthenticated}
              currentUser={currentUser}
              isInWishlist={isInWishlist}
              onBooking={handleBooking}
              onWishlistToggle={handleWishlistToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;