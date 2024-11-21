import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../contexts/AuthContext';
import MediaGallery from '../components/MediaGallery';
import RatingInfo from '../components/RatingInfo';
import TabContent from '../components/TabContent';
import BookingCard from '../components/BookingCard';

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, getToken } = useAuth();
  const [experience, setExperience] = useState(null);
  const [activeMedia, setActiveMedia] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('description');
  const [isInWishlist, setIsInWishlist] = useState(false); // Just for UI state
  const [currentUser, setCurrentUser] = useState(null);

  // Create memoized API instance
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: config.API_BASE_URL || 'https://3.83.93.102.nip.io',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    instance.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [getToken]);

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
          comment: 'Thank you for your feedback!',
          date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString()
        }] : []
      });
    }
    return reviews;
  }, []);

  // Fetch experience details
  useEffect(() => {
    let isMounted = true;

    const fetchExperience = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/public/api/products/${id}`);
        
        if (!isMounted) return;

        if (!response.data) {
          throw new Error('No data received from server');
        }

        const enhancedExperience = {
          ...response.data,
          viewCount: Math.floor(Math.random() * 10000) + 1000,
          reviews: generateFakeReviews(5),
          imageUrl: response.data.imageUrl ? `${config.API_BASE_URL}/public/api/products/files/${response.data.imageUrl}` : null,
          imageUrls: response.data.imageUrls ? response.data.imageUrls.map(url => 
            `${config.API_BASE_URL}/public/api/products/files/${url}`
          ) : [],
          videoUrl: response.data.videoUrl ? `${config.API_BASE_URL}/public/api/products/files/${response.data.videoUrl}` : null
        };

        setExperience(enhancedExperience);

      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to load experience details');
          console.error('Error fetching experience details:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExperience();

    return () => {
      isMounted = false;
    };
  }, [id, api, generateFakeReviews]);

  const handleMediaChange = useCallback((index) => {
    setActiveMedia(index);
    setIsVideoPlaying(false);
  }, []);

  const handleVideoClick = useCallback(() => {
    setIsVideoPlaying(prev => !prev);
  }, []);

  // Mock wishlist toggle function
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/experience/${id}` } });
      return;
    }
    // Just toggle the UI state
    setIsInWishlist(prev => !prev);
  };

  const handleBooking = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/experience/${id}` } });
      return;
    }
    navigate(`/booking/${id}`);
  }, [id, isAuthenticated, navigate]);

  // Render loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Oops!</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Render not found state
  if (!experience) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">Experience Not Found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

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
              isAuthenticated={isAuthenticated}
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