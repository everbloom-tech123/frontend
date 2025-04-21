import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../contexts/AuthContext';
import * as userService from '../services/userService';
import MediaGallery from '../components/MediaGallery';
import ExperienceContent from '../components/ExperienceContent';
import BookingCard from '../components/BookingCard';
import ReviewComponent from '../components/ReviewComponent';
import ExperienceService from '../Admin_Pages/ExperienceService';
import { FaMapMarkerAlt, FaClock, FaUsers, FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

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
  const [selectedTab, setSelectedTab] = useState('details');

  const api = useMemo(() => {
    return axios.create({
      baseURL: config.API_BASE_URL || 'http://localhost:8080',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
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
          imageUrl: response.imageUrl ? ExperienceService.getImageUrl(response.imageUrl) : null,
          imageUrls: response.imageUrls ? response.imageUrls.map(url =>
            ExperienceService.getImageUrl(url)
          ) : [],
          videoUrl: response.videoUrl ? ExperienceService.getVideoUrl(response.videoUrl) : null,
          subcategoryDetails: response.subcategories?.map(sub => ({
            id: sub.id,
            name: sub.name,
            categoryId: sub.categoryId,
            categoryName: sub.categoryName
          })) || []
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
  }, [id]);

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

    if (isAuthenticated) {
      fetchCurrentUser();
    }
  }, [isAuthenticated]);

  const handleMediaChange = useCallback((index) => {
    setActiveMedia(index);
  }, []);

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/signin', {
        state: { from: `/experience/${id}` }
      });
      return;
    }

    navigate('/booking', {
      state: {
        userId: currentUser?.id,
        userEmail: currentUser?.email,
        experienceId: id,
        experienceDetails: {
          title: experience?.title,
          price: experience?.price,
          imageUrl: experience?.imageUrl,
        }
      }
    });
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/signin', {
        state: { from: `/experience/${id}` }
      });
    } else {
      setIsInWishlist(prev => !prev);
      // Here you would call an API to actually update the wishlist
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: experience?.title,
        text: `Check out this amazing experience: ${experience?.title}`,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy link:', err));
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className="text-white text-xl">Loading amazing experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 px-4 py-12 bg-white rounded-xl shadow-sm max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-red-600">Oops!</h2>
        <p className="text-gray-600 mb-6 text-lg">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Media Gallery */}
      <div className="relative">
        <MediaGallery
          media={experience}
          activeMedia={activeMedia}
          onMediaChange={handleMediaChange}
        />
        
        {/* Quick Actions Floating Panel */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button 
            onClick={handleWishlistToggle}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
          >
            {isInWishlist ? 
              <FaHeart className="text-red-500 text-xl" /> : 
              <FaRegHeart className="text-gray-700 text-xl" />
            }
          </button>
          <button 
            onClick={handleShare}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
          >
            <FaShare className="text-gray-700 text-xl" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-3/4">
            {/* Title and Basic Info Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{experience.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  {experience.location && (
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-red-500" />
                      <span>{experience.location}</span>
                    </div>
                  )}
                  {experience.duration && (
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-blue-500" />
                      <span>{experience.duration}</span>
                    </div>
                  )}
                  {experience.maxParticipants && (
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-green-500" />
                      <span>Up to {experience.maxParticipants} people</span>
                    </div>
                  )}
                  {experience.verified && (
                    <div className="flex items-center text-green-600">
                      <MdVerified className="mr-1" />
                      <span className="text-sm font-medium">Verified Experience</span>
                    </div>
                  )}
                </div>
                
                {/* Quick highlight */}
                {experience.highlights && experience.highlights.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="font-medium text-blue-800">{experience.highlights[0]}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tabs for Details and Reviews */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="border-b">
                <nav className="flex">
                  <button
                    className={`px-6 py-4 text-sm font-medium ${selectedTab === 'details' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setSelectedTab('details')}
                  >
                    Experience Details
                  </button>
                  <button
                    className={`px-6 py-4 text-sm font-medium ${selectedTab === 'reviews' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setSelectedTab('reviews')}
                  >
                    Reviews
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {selectedTab === 'details' ? (
                  <ExperienceContent experience={experience} />
                ) : (
                  <ReviewComponent experienceId={id} />
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-1/4 mt-6 lg:mt-0">
            <div className="sticky top-24">
              {/* Enhanced Booking Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Book this Experience</h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      ${experience.price}
                      <span className="text-lg font-normal text-gray-600"> per person</span>
                    </div>
                    {experience.discountedPrice && (
                      <div className="flex items-center">
                        <span className="line-through text-gray-500 mr-2">${experience.discountedPrice}</span>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          {Math.round((1 - experience.price / experience.discountedPrice) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {experience.features?.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-2 text-gray-600">{feature}</p>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleBooking}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 mb-4"
                  >
                    Book Now
                  </button>
                  
                  <button
                    onClick={handleWishlistToggle}
                    className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-300 flex items-center justify-center"
                  >
                    {isInWishlist ? (
                      <>
                        <FaHeart className="text-red-500 mr-2" />
                        Saved to Wishlist
                      </>
                    ) : (
                      <>
                        <FaRegHeart className="mr-2" />
                        Add to Wishlist
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Host Information (if available) */}
              {experience.host && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">About Your Host</h3>
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-3">
                        {experience.host.name ? experience.host.name.charAt(0) : 'H'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{experience.host.name || 'Experience Host'}</p>
                        <p className="text-sm text-gray-600">Host since {experience.host.since || 'Recently'}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{experience.host.description || 'This host is ready to provide you with an unforgettable experience.'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;