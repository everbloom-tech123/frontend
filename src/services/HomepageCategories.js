import React from 'react';
import ExperienceGrid from '../components/ExperienceGrid';

// Converted to a pure UI component - all data fetching logic moved to HomePage
const HomepageCategoriesSection = ({ 
  onCategorySelect, 
  activeCategory,
  categoriesWithExperiences = [],
  loading = false,
  error = null,
  onViewAllClick
}) => {
  
  // Render loading state
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
                  onClick={() => onViewAllClick(category.categoryId)}
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
              
              {/* Experience Grid for this category */}
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