import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomepageService from '../services/HomepageService';
import ExperienceGrid from './ExperienceGrid';

const HomepageCategoriesSection = ({ onCategorySelect: externalOnCategorySelect, activeCategory, categories }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!categories || categories.length === 0);
  const [categoriesData, setCategoriesData] = useState(categories || []);
  const [error, setError] = useState(null);

  // Fetch homepage categories if not passed as props
  useEffect(() => {
    // If categories are already provided through props, use those
    if (categories && categories.length > 0) {
      console.log(`Using ${categories.length} categories passed as props with names:`, 
        categories.map(c => c.categoryName || c.name).join(', '));
      setCategoriesData(categories);
      return;
    }

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching categories from HomepageService...');
        
        // Get categories data from the homepage service
        const categoriesResult = await HomepageService.getCategories();
        
        console.log(`Fetched ${categoriesResult.length} categories from API`);
        setCategoriesData(categoriesResult);
      } catch (err) {
        console.error('Error fetching homepage categories:', err.message, err.stack);
        setError('Failed to load categories. Please try again later.');
        setCategoriesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categories]);

  // Handle view all button click - redirect to ViewBySubPage with category ID
  const handleViewAllClick = (categoryId) => {
    navigate(`/viewby/${categoryId}`);
  };

  // Log current state for debugging
  console.log('Rendering HomepageCategoriesSection with:', {
    categoriesCount: categoriesData?.length || 0,
    hasExperiences: categoriesData?.some(cat => cat.experiences?.length > 0),
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
        {categoriesData.length === 0 ? (
          <div className="py-4 text-center">
            {error ? <p className="text-red-500">{error}</p> : null}
          </div>
        ) : (
          categoriesData.map(category => {
            // Skip rendering categories with no experiences
            if (!category.experiences || category.experiences.length === 0) {
              console.log(`Skipping category ${category.categoryName || category.name} - no experiences`);
              return null;
            }
            
            return (
              <div key={category.id} className="category-section">
                {/* Category header with view all button */}
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                    {category.categoryName || category.name} Experiences
                  </h1>
                  <button 
                    onClick={() => handleViewAllClick(category.categoryId || category.id)}
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
                
                {/* Log the experiences for debugging */}
                {console.log(`Rendering grid for ${category.categoryName || category.name} with ${category.experiences.length} experiences`)}
                
                {/* Experience Grid for this category */}
                <ExperienceGrid
                  title={null} // Remove title as we now have it in the header with view all button
                  experiences={category.experiences || []}
                  showPrice={true}
                  showViewDetails={true}
                  isLoading={false}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HomepageCategoriesSection;