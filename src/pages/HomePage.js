import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperienceGrid from '../components/ExperienceGrid';
import ExperienceService from '../Admin_Pages/ExperienceService';
import Header from '../components/traveTips';
import ModernHero from '../components/modernHero';
import DestinationExplorer from '../components/Destination';
import ImageGrid from '../components/imageLayout';
import HomepageCategoriesSection from '../components/HomepageCategoriesSection'; // Import the component

const HomePage = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [specialExperiences, setSpecialExperiences] = useState([]);
  const [mostPopularExperiences, setMostPopularExperiences] = useState([]);
  const [allExperiences, setAllExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
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
          setFilteredExperiences(experiences); // Initialize filtered experiences with all
          setFeaturedExperiences(experiences.filter(exp => exp.featured));
          setSpecialExperiences(experiences.filter(exp => exp.special));
          setMostPopularExperiences(experiences.filter(exp => exp.most_popular));
        }
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
    setActiveCategory(categoryName);
    
    if (categoryName === 'All') {
      setFilteredExperiences(allExperiences);
    } else {
      const filtered = allExperiences.filter(exp => 
        exp.categories?.some(cat => cat.name === categoryName)
      );
      setFilteredExperiences(filtered);
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
          {specialExperiences.length > 0 && (
            <ExperienceGrid
              title="Featured Experiences :"
              subtitle="Exclusive offers and unique experiences"
              experiences={specialExperiences}
              columns={3}
              onExperienceClick={handleExperienceClick}
              isLoading={loading}
            />
          )}

          <div className="relative mb-16">
            <HomepageCategoriesSection 
              onCategorySelect={handleCategorySelect}
              activeCategory={activeCategory}
            /> 
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

          <Header/>
        </div>
      </div>

      {filteredExperiences.length > 0 && (
        <div className="relative mx-auto overflow-visible bg-white px-6 pt-6">
          <div className="relative mb-16">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col items-start">
                <h1 className="text-5xl font-extrabold mb-2 leading-tight tracking-tight">
                  {activeCategory === 'All' ? 'All Experiences' : `${activeCategory} Experiences`}
                  <span className="text-red-200 mx-2"></span>
                </h1>
                <p className="text-sm font-semibold text-gray-500">
                  {activeCategory === 'All' 
                    ? 'Explore all our amazing experiences' 
                    : `Discover our ${activeCategory.toLowerCase()} experiences`}
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
              experiences={filteredExperiences}
              columns={3}
              onExperienceClick={handleExperienceClick}
              isLoading={loading}
              showHeader={false}
            />
          </div>
        </div>
      )}

      <div className="relative mx-auto overflow-visible bg-white px-6 pt-6">
        <div className="relative mb-16">
          <ImageGrid/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;