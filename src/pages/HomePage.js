import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulCategories from '../components/PlayfulCategories';
import CategoryService from '../Admin_Pages/CategoryService';
import ExperienceService from '../Admin_Pages/ExperienceService';
import Header from '../components/traveTips';
import ImageSlider from '../components/ImageSlider';
import ModernHero from '../components/modernHero';
import DestinationExplorer from '../components/Destination';
import ContactForm from './contactForm';
import ImageGrid from '../components/imageLayout';

const HomePage = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [specialExperiences, setSpecialExperiences] = useState([]);
  const [mostPopularExperiences, setMostPopularExperiences] = useState([]);
  const [allExperiences, setAllExperiences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const experiences = await ExperienceService.getAllExperiences();
        if (Array.isArray(experiences)) {
          setFeaturedExperiences(experiences.filter(exp => exp.featured) || experiences.slice(0, 6));
          setSpecialExperiences(experiences.filter(exp => exp.special));
          setMostPopularExperiences(experiences.filter(exp => exp.most_popular));
          setAllExperiences(experiences);
        }

        const categories = await CategoryService.getAllCategories();
        setCategories(Array.isArray(categories) ? categories : []);

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
      <div className="pt-16">
        <ModernHero/>
      </div>
      <DestinationExplorer/>
      
      <div className="relative mx-auto overflow-visible bg-white px-6 pt-6">
        <div className="relative mb-16">
          {allExperiences.length > 0 && (
            <ExperienceGrid
              title="All Experiences"
              subtitle="Explore all our amazing experiences"
              experiences={allExperiences}
              columns={3}
              onExperienceClick={handleExperienceClick}
              isLoading={loading}
            />
          )}

          {featuredExperiences.length > 0 && (
            <ExperienceGrid
              title="Featured Experiences"
              subtitle="Explore Our Curated Selection of Exclusive Experiences"
              experiences={featuredExperiences}
              columns={3}
              onExperienceClick={handleExperienceClick}
              isLoading={loading}
            />
          )}

          {specialExperiences.length > 0 && (
            <ExperienceGrid
              title="Special Experiences"
              subtitle="Exclusive offers and unique experiences"
              experiences={specialExperiences}
              columns={3}
              onExperienceClick={handleExperienceClick}
              isLoading={loading}
            />
          )}

          {mostPopularExperiences.length > 0 && (
            <ExperienceGrid
              title="Most Popular Experiences"
              subtitle="Top-rated experiences loved by our community"
              experiences={mostPopularExperiences}
              columns={3}
              onExperienceClick={handleExperienceClick}
              isLoading={loading}
            />
          )}

          <Header/>
        </div>
      </div>

      <div className="relative mx-auto overflow-visible bg-white px-6 pt-6">
        <div className="relative mb-16">
          <ImageGrid/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;