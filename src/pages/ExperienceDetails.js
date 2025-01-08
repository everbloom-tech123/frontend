import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../contexts/AuthContext';
import * as AuthService from '../services/AuthService';
import * as userService from '../services/userService';
import MediaGallery from '../components/MediaGallery';
import RatingInfo from '../components/RatingInfo';
import ExperienceContent from '../components/ExperienceContent';
import BookingCard from '../components/BookingCard';
import ExperienceService from '../Admin_Pages/ExperienceService';

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [experience, setExperience] = useState(null);
  const [activeMedia, setActiveMedia] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const api = useMemo(() => {
    return axios.create({
      baseURL: config.API_BASE_URL || 'https://3.83.93.102.nip.io',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
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
          comment: 'Thank you for your feedback!',
          date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString()
        }] : []
      });
    }
    return reviews;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchExperience = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await ExperienceService.getExperience(id);
        
        if (!isMounted) return;

        if (!response) {
          throw new Error('No data received from server');
        }

        const enhancedExperience = {
          ...response,
          viewCount: Math.floor(Math.random() * 10000) + 1000,
          reviews: generateFakeReviews(5),
          imageUrl: response.imageUrl ? ExperienceService.getImageUrl(response.imageUrl) : null,
          imageUrls: response.imageUrls ? response.imageUrls.map(url => 
            ExperienceService.getImageUrl(url)
          ) : [],
          videoUrl: response.videoUrl ? ExperienceService.getVideoUrl(response.videoUrl) : null
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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userDetails = await userService.getCurrentUserProfile();
        setCurrentUser({
          id: userDetails.id,
          username: userDetails.username,
          email: userDetails.email,
          roles: userDetails.roles,
          enabled: userDetails.enabled,
          createdAt: userDetails.createdAt,
          updatedAt: userDetails.updatedAt
        });
      } catch (error) {
        console.error('Error fetching current user details:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleMediaChange = useCallback((index) => {
    setActiveMedia(index);
  }, []);

  const handleVideoClick = useCallback(() => {
    // Video playback handling remains unchanged
  }, []);

  const handleBooking = () => {
    if (!currentUser) {
      navigate('/signin', { 
        state: { from: `/experience/${id}` }
      });
      return;
    }

    navigate('/booking', {
      state: {
        userId: currentUser.id,
        userEmail: currentUser.email,
        experienceId: id,
        experienceDetails: {
          title: experience.title,
          price: experience.price,
          imageUrl: experience.imageUrl,
        }
      }
    });
    /* navigate('/booking', {
      state: {
        userId: currentUser.id,
        userEmail: currentUser.email,
        experienceDetails: {
          id: experience.id,        // Add this
          title: experience.title,
          price: experience.price,
          imageUrl: experience.imageUrl,
        }
      }
    }); */
  };

  const handleWishlistToggle = async () => {
    if (!currentUser) {
      navigate('/signin', { 
        state: { from: `/experience/${id}` }
      });
    } else {
      setIsInWishlist(prev => !prev);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600 mb-4"></div>
        </div>
      </div>
    );
  }

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
    <div className="bg-gray-50 min-h-screen">
      <MediaGallery
          media={experience}
          activeMedia={activeMedia}
          onMediaChange={handleMediaChange}
          onVideoClick={handleVideoClick}
          onBack={() => navigate(-1)}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{experience.title}</h1>
                <RatingInfo
                    rating={experience.rating}
                    reviewCount={experience.reviews?.length}
                    viewCount={experience.viewCount}
                    className="mb-6"
                />
                <ExperienceContent
                    experience={experience}
                />
              </div>
            </div>
          </div>

          <div className="lg:w-1/4 mt-6 lg:mt-0">
            <div className="sticky top-6">
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
    </div>
    );
    };

    export default ExperienceDetails;