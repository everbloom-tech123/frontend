import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulCategories from '../components/PlayfulCategories';
import CategoryService from '../Admin_Pages/CategoryService';
import ExperienceService from '../Admin_Pages/ExperienceService';
import Header from '../components/Header'; // Import the Header component
import ImageSlider from '../components/ImageSlider';

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

      <ImageSlider images={sampleImages} />
      
      {/* Header Component */}
      <Header />

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