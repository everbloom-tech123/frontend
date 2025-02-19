import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ExperienceGrid from '../components/ExperienceGrid';
import CategoryService from '../Admin_Pages/CategoryService';
import ExperienceService from '../Admin_Pages/ExperienceService';
import Header from '../components/traveTips';
import ModernHero from '../components/modernHero';
import DestinationExplorer from '../components/Destination';
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

        // Using the new limited experiences endpoint
        const experiences = await ExperienceService.getLimitedExperiences();
        if (Array.isArray(experiences)) {
          setAllExperiences(experiences);
          setFeaturedExperiences(experiences.filter(exp => exp.featured));
          setSpecialExperiences(experiences.filter(exp => exp.special));
          setMostPopularExperiences(experiences.filter(exp => exp.most_popular));
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
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col items-start">
                  <h1 className="text-5xl font-extrabold mb-2 leading-tight tracking-tight">
                    All Experiences
                    <span className="text-red-200 mx-2">:</span>
                  </h1>
                  <p className="text-sm font-semibold text-gray-500">
                    Explore all our amazing experiences
                  </p>
                </div>
                <button
                  onClick={() => navigate('/viewall')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  View All
                </button>
              </div>
              <ExperienceGrid
                experiences={allExperiences}
                columns={3}
                onExperienceClick={handleExperienceClick}
                isLoading={loading}
                showHeader={false}
              />
            </div>
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

          <Header/>
        </div>
      </div>

      <div className="relative mx-auto overflow-visible bg-white px-6 pt-6">
        <div className="relative mb-16">
          <ImageGrid/>
        </div>

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

      </div>
    </div>
  );
};

export default HomePage;