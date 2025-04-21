import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomepageCategoryService from '../services/HomepageCategories';
import ExperienceGrid from './ExperienceGrid';

const HomepageCategoriesSection = ({ onCategorySelect: externalOnCategorySelect, activeCategory }) => {
  const navigate = useNavigate();
  const [categoriesWithExperiences, setCategoriesWithExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch homepage categories with their experiences on mount
  useEffect(() => {
    const fetchCategoriesWithExperiences = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching active homepage categories with experiences...');
        
        // Using the new optimized endpoint - only ONE API call
        const result = await HomepageCategoryService.getActiveHomepageCategoriesWithExperiences(5);
        
        if (!Array.isArray(result)) {
          console.error('Invalid response format from category service');
          setCategoriesWithExperiences([]);
          setError('Invalid data received from server');
          return;
        }
        
        console.log('Processed homepage categories with experiences:', result);
        setCategoriesWithExperiences(result);
      } catch (err) {
        console.error('Error fetching homepage categories with experiences:', err.message, err.stack);
        setError('Failed to load content. Please try again later.');
        setCategoriesWithExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithExperiences();
  }, []);

  // Handle view all button click - redirect to ViewBySubPage with category ID
  const handleViewAllClick = (categoryId) => {
    navigate(`/viewby/${categoryId}`);
  };

  // Log current state for debugging
  console.log('Rendering HomepageCategoriesSection with:', {
    categoriesCount: categoriesWithExperiences.length,
    loading,
    error
  });

  // Render loading state for the entire component
  if (loading) {
    return <div className="p-6 text-center">Loading categories...</div>;
  }

  // Main render with fallback for empty state that doesn't show error messages
  return (
    <div className="relative mx-auto overflow-visible bg-white pt-4">
      {/* Render a separate ExperienceGrid for each category to display */}
      <div className="mt-6 space-y-8">
        {categoriesWithExperiences.length === 0 ? (
          <div className="py-4 text-center"></div>
        ) : (
          categoriesWithExperiences.map(category => (
            <div key={category.id} className="category-section">
              {/* Category header with view all button */}
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">{category.categoryName} Experiences</h1>
                <button 
                  onClick={() => handleViewAllClick(category.categoryId)}
                  className="text-red-600 hover:text-red-800 font-medium flex items-center"
                >
                  View All
                  <svg 
                    className="w-5 h-5 ml-1" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Experience Grid for this category - using experiences directly from our optimized endpoint */}
              <ExperienceGrid
                title={null} // Remove title as we now have it in the header with view all button
                experiences={category.experiences || []}
                showPrice={true}
                showViewDetails={true}
                isLoading={false}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomepageCategoriesSection;