import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaStar, FaEye } from 'react-icons/fa';
import axios from 'axios';
import config from '../config';

const ViewAllExperiencesPage = () => {
  console.log('ViewAllExperiencesPage mounting');
  
  const [filter, setFilter] = useState('All');
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});
  const navigate = useNavigate();

  const handleViewDetails = (experienceId) => {
    navigate(`/experience/${experienceId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const api = axios.create({
    baseURL: config.API_BASE_URL || 'https://3.83.93.102.nip.io',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        console.log('Fetching experiences...');
        setLoading(true);
        const response = await api.get('/public/api/products');
        
        console.log('API Response:', response);
        
        if (response.data && Array.isArray(response.data)) {
          const enhancedExperiences = response.data.map(exp => ({
            ...exp,
            viewCount: Math.floor(Math.random() * 10000) + 1000,
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviews: generateFakeReviews(),
            imageUrls: exp.imageUrls ? exp.imageUrls.map(url => 
              `${config.API_BASE_URL}/public/api/products/files/${url}`
            ) : []
          }));
          setExperiences(enhancedExperiences);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching experiences:', {
          message: err.message,
          response: err.response,
          stack: err.stack
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const generateFakeReviews = () => {
    const reviewCount = Math.floor(Math.random() * 5) + 1;
    return Array.from({ length: reviewCount }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      author: `User${Math.floor(Math.random() * 1000)}`,
      content: "This experience was absolutely amazing! I highly recommend it to everyone.",
      rating: Math.floor(Math.random() * 2) + 4,
      replies: Math.random() > 0.5 ? [{
        author: "Experience Provider",
        content: "Thank you for your kind words! We're glad you enjoyed the experience."
      }] : []
    }));
  };

  const filteredExperiences = filter === 'All' 
    ? experiences 
    : experiences.filter(exp => exp.category === filter);

  const getImageUrl = (filename) => {
    if (!filename) return '/placeholder-image.jpg';
    return `${config.API_BASE_URL}/public/api/products/files/${filename}`;
  };

  const ImageWithFallback = ({ src, alt, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);

    const onError = () => {
      console.warn(`Error loading image: ${imgSrc}`);
      setImgSrc('/placeholder-image.jpg');
    };

    useEffect(() => {
      setImgSrc(src);
    }, [src]);

    return <img src={imgSrc} alt={alt} onError={onError} {...props} />;
  };

  const toggleReviews = (experienceId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [experienceId]: !prev[experienceId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Experiences</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen mt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Discover Unforgettable Experiences</h1>
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 italic mb-4 md:mb-0">Embark on a journey of a lifetime...</p>
          <div className="relative w-full md:w-auto">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-red-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Cultural</option>
              <option>Adventure</option>
              <option>Culinary</option>
              <option>Wildlife</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaFilter />
            </div>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredExperiences.length > 0 ? (
            filteredExperiences.map((experience) => (
              <motion.div 
                key={experience.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden group transform transition duration-300 hover:scale-105"
                variants={itemVariants}
              >
                <div className="relative">
                  {experience.imageUrls && experience.imageUrls.length > 0 ? (
                    <ImageWithFallback 
                      src={getImageUrl(experience.imageUrls[0])} 
                      alt={experience.title} 
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-200 flex items-center justify-center">No Image</div>
                  )}
                  {experience.discount > 0 && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-2 m-2 rounded-md text-sm font-bold transform rotate-3">
                      {experience.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">{experience.title}</h3>
                  <p className="text-gray-600 mb-4">{experience.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600 font-bold text-lg">
                      ${experience.price ? experience.price.toFixed(2) : 'N/A'}
                      {experience.discount > 0 && experience.price && (
                        <span className="line-through text-gray-400 ml-2 text-sm">
                          ${(experience.price / (1 - experience.discount / 100)).toFixed(2)}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-bold">{experience.rating}</span>
                      <span className="text-gray-500 ml-2">({experience.reviews.length} reviews)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center text-gray-500">
                      <FaEye className="mr-1" />
                      <span>{experience.viewCount} views</span>
                    </div>
                    <button 
                      className="text-red-600 hover:text-red-700 font-semibold"
                      onClick={() => toggleReviews(experience.id)}
                    >
                      {expandedReviews[experience.id] ? 'Hide Reviews' : 'Show Reviews'}
                    </button>
                  </div>
                  <AnimatePresence>
                    {expandedReviews[experience.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                      >
                        {experience.reviews.map(review => (
                          <div key={review.id} className="mb-2 p-2 bg-gray-50 rounded">
                            <div className="flex justify-between">
                              <span className="font-semibold">{review.author}</span>
                              <div className="flex">
                                {[...Array(review.rating)].map((_, i) => (
                                  <FaStar key={i} className="text-yellow-400 text-sm" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{review.content}</p>
                            {review.replies.map((reply, index) => (
                              <div key={index} className="ml-4 mt-1 p-1 bg-white rounded text-sm">
                                <span className="font-semibold">{reply.author}: </span>
                                {reply.content}
                              </div>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full text-sm transition duration-300 transform hover:scale-105"
                    onClick={() => handleViewDetails(experience.id)}
                  >
                    Explore This Experience
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">No experiences found.</div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ViewAllExperiencesPage;