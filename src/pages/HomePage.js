import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ExperienceGrid from './ExperienceGrid.jsx';
import CategoryGrid from './CategoryGrid.jsx';
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

        // Fetch experiences and categories
        const [experiencesResponse, categoriesResponse] = await Promise.all([
          ExperienceService.getAllExperiences(),
          CategoryService.getAllCategories()
        ]);

        console.log('Experiences fetched:', experiencesResponse);
        console.log('Categories fetched:', categoriesResponse);

        // Set featured experiences (either featured ones or first 6)
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

  const priceRanges = [
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: '$200+', value: '200-plus' }
  ];

  const handleExperienceClick = (experience) => {
    if (experience?.id) {
      console.log('Navigating to experience:', experience.id);
      navigate(`/experience/${experience.id}`);
    }
  };

  const handleCategoryClick = (category) => {
    if (category?.id) {
      console.log('Filtering by category:', category.id);
      navigate(`/experience?category=${category.id}`);
    }
  };

  const handlePriceRangeClick = (range) => {
    console.log('Filtering by price range:', range);
    navigate(`/experience?priceRange=${range}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-cover bg-center h-screen pt-24"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Images/pxfuel.jpg)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Ceylon Bucket
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Discover unforgettable adventures
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <button 
              onClick={() => navigate('/experience')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
            >
              Explore Experiences
            </button>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Grid */}
        {categories.length > 0 && (
          <CategoryGrid
            title="Explore by Category"
            categories={categories}
            columns={4}
            onCategoryClick={handleCategoryClick}
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
          />
        )}

        {/* Shop by Price */}
        <ExperienceGrid
          title="Shop by Price"
          subtitle="Find the perfect experience for your budget"
          className="bg-gradient-to-r from-red-100 to-red-200 rounded-lg shadow-md p-8"
          filterOptions={priceRanges.map(range => ({
            ...range,
            onClick: () => handlePriceRangeClick(range.value)
          }))}
          experiences={[]}
        />

        {/* Newsletter Signup */}
        <motion.section 
          className="mb-16 bg-red-600 text-white rounded-lg shadow-md p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-center">Stay Updated</h2>
          <p className="text-center mb-6">Subscribe to our newsletter for exclusive offers and travel tips</p>
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