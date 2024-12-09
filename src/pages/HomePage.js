import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulCategories from '../components/PlayfulCategories';
import CategoryService from '../Admin_Pages/CategoryService';
import ExperienceService from '../Admin_Pages/ExperienceService';

const HomePage = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [experiencesResponse, categoriesResponse] = await Promise.all([
          ExperienceService.getAllExperiences(),
          CategoryService.getAllCategories()
        ]);

        const featured = Array.isArray(experiencesResponse) ? 
          (experiencesResponse.filter(exp => exp.featured).length > 0 ? 
            experiencesResponse.filter(exp => exp.featured) : 
            experiencesResponse.slice(0, 6)
          ) : [];

        setFeaturedExperiences(featured);
        setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : []);

      } catch (err) {
        console.error('Error loading homepage data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategorySelect = (categoryName) => {
    if (categoryName === 'All') {
      navigate('/viewall');
    } else {
      navigate(`/viewall?category=${encodeURIComponent(categoryName)}`);
    }
  };

  const handleExperienceClick = (experience) => {
    navigate(`/experience/${experience.id}`);
  };

  if (error) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Data</h2>
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
    <div className="bg-gray-50 min-h-screen">
      {/* Custom Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left side - Text Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-4">
              Make Beautiful Travel
              <br />
              <span className="flex items-center gap-2">
                in the <span className="italic">world!</span>
              </span>
            </h1>
            
            <p className="text-gray-500 mb-8">
              If diving has always been your dream, then you are in the right
              place. We will help your dreams come true by opening the
              wonderful in the world!
            </p>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/explore')}
                className="bg-gray-800 text-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-gray-700 transition-all duration-300 flex items-center"
              >
                Explore
              </button>
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-teal-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right side - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <div className="col-span-2">
                <img
                  src="/images/building.jpg"
                  alt="Historical Building"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
              
              {/* Two smaller images */}
              <div>
                <img
                  src="/images/bridge.jpg"
                  alt="Spiral viaduct Brusio"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="mt-2 text-sm text-gray-600">
                  Spiral viaduct Brusio
                  <br />
                  Switzerland
                </p>
              </div>
              <div>
                <img
                  src="/images/golden-gate.jpg"
                  alt="Golden Gate Bridge"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="mt-2 text-sm text-gray-600">
                  Golden Gate Bridge
                  <br />
                  France
                </p>
              </div>

              {/* Navigation arrows */}
              <button className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-400 text-white rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories Section */}
        {categories.length > 0 && (
          <PlayfulCategories
            categories={categories}
            onCategorySelect={handleCategorySelect}
            activeCategory="All"
          />
        )}
        
        {/* Featured Experiences */}
        {featuredExperiences.length > 0 && (
          <ExperienceGrid
            title="Featured Experiences"
            subtitle="Discover our most popular adventures"
            experiences={featuredExperiences}
            columns={3}
            onExperienceClick={handleExperienceClick}
            isLoading={loading}
          />
        )}

        {/* Newsletter Section */}
        <motion.section 
          className="mb-16 bg-red-600 text-white rounded-lg shadow-md p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-center">Stay Updated</h2>
          <p className="text-center mb-6">
            Subscribe to our newsletter for exclusive offers and travel tips
          </p>
          <form className="flex justify-center">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-2 rounded-l-full w-64 focus:outline-none text-gray-800"
            />
            <button 
              type="submit" 
              className="bg-white text-red-600 hover:bg-gray-100 px-6 py-2 rounded-r-full font-semibold transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;