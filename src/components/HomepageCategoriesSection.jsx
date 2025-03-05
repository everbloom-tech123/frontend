import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../Admin_Pages/CategoryService';
import HomepageCategoryService from '../services/HomepageCategories';
import ExperienceService from '../Admin_Pages/ExperienceService';
import PlayfulCategories from './PlayfulCategories';
import ExperienceGrid from './ExperienceGrid';

const HomepageCategoriesSection = ({ onCategorySelect: externalOnCategorySelect, activeCategory }) => {
  const navigate = useNavigate();
  const [homepageCategories, setHomepageCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  // Change data structure to store experiences by category
  const [experiencesByCategory, setExperiencesByCategory] = useState({});
  const [loadingExperiencesByCategory, setLoadingExperiencesByCategory] = useState({});
  const [errorByCategory, setErrorByCategory] = useState({});

  // Fetch homepage categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setError(null);
        console.log('Fetching all categories and active homepage categories...');

        const allCategories = await CategoryService.getAllCategories();
        const activeHomepageCategories = await HomepageCategoryService.getActiveHomepageCategories();

        console.log('All categories response:', allCategories);
        console.log('Active homepage categories response:', activeHomepageCategories);

        if (!Array.isArray(allCategories) || !Array.isArray(activeHomepageCategories)) {
          throw new Error('Invalid response format from category services');
        }

        const homepageCats = activeHomepageCategories
          .filter(hc => hc.isActive)
          .map(hc => {
            const categoryInfo = allCategories.find(cat => cat.id === hc.categoryId);
            return categoryInfo ? {
              ...categoryInfo,
              displayOrder: hc.displayOrder
            } : null;
          })
          .filter(Boolean)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        console.log('Processed homepage categories:', homepageCats);
        setHomepageCategories(homepageCats);
        
        // Select all categories by default since selection UI is hidden
        setSelectedCategoryIds(homepageCats.map(cat => cat.id));
        
        // Fetch experiences for each category
        fetchExperiencesForAllCategories(homepageCats);
      } catch (err) {
        console.error('Error fetching homepage categories:', err.message, err.stack);
        setError('Failed to load categories: ' + err.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  
  // Fetch experiences for all categories
  const fetchExperiencesForAllCategories = async (categories) => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      console.warn('No categories provided to fetch experiences for');
      return;
    }
    
    // Initialize loading states for all categories
    const newLoadingStates = {};
    categories.forEach(category => {
      newLoadingStates[category.id] = true;
    });
    setLoadingExperiencesByCategory(newLoadingStates);
    
    // Fetch experiences for each category in parallel
    const fetchPromises = categories.map(category => 
      fetchExperiencesForCategory(category)
    );
    
    // Wait for all fetches to complete
    await Promise.all(fetchPromises);
  };
  
  // Function to fetch experiences for a single category
  const fetchExperiencesForCategory = async (category) => {
    if (!category || !category.id) {
      console.warn('Invalid category provided:', category);
      return;
    }
    
    const categoryId = category.id;
    
    try {
      console.log(`Fetching experiences for category: ${category.name} (ID: ${categoryId})`);
      
      // Update loading state for this category
      setLoadingExperiencesByCategory(prevState => ({
        ...prevState,
        [categoryId]: true
      }));
      
      // Clear any previous errors
      setErrorByCategory(prevState => ({
        ...prevState,
        [categoryId]: null
      }));
      
      // Use getExperiencesByCategories with a single ID since getExperiencesByCategory has issues
      const experiences = await ExperienceService.getExperiencesByCategories([categoryId]);
      
      console.log(`Fetched ${experiences.length} experiences for category ${category.name}`);
      
      // Store experiences for this category
      setExperiencesByCategory(prevState => ({
        ...prevState,
        [categoryId]: experiences || []
      }));
    } catch (err) {
      console.error(`Error fetching experiences for category ${category.name}:`, err.message);
      
      // Store error for this category
      setErrorByCategory(prevState => ({
        ...prevState,
        [categoryId]: `Failed to load ${category.name} experiences: ${err.message}`
      }));
      
      // Initialize with empty array on error
      setExperiencesByCategory(prevState => ({
        ...prevState,
        [categoryId]: []
      }));
    } finally {
      // Update loading state
      setLoadingExperiencesByCategory(prevState => ({
        ...prevState,
        [categoryId]: false
      }));
    }
  };

  // Always display all categories since selection UI is hidden
  const getCategoriesToDisplay = () => {
    return homepageCategories;
  };

  // Handle view all button click - redirect to ViewBySubPage with category ID
  const handleViewAllClick = (categoryId) => {
    navigate(`/viewby/${categoryId}`);
  };

  // Log current state for debugging
  console.log('Rendering HomepageCategoriesSection with:', {
    categories: homepageCategories.length,
    selectedCategoryIds,
    experiencesByCategory,
    loadingExperiencesByCategory,
    errorByCategory
  });

  // Render loading, error, or empty states for the entire component
  if (loadingCategories) {
    return <div className="p-6 text-center">Loading categories...</div>;
  }

  if (error && homepageCategories.length === 0) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (homepageCategories.length === 0) {
    return <div className="p-6 text-center">No categories available</div>;
  }

  // Get categories to display
  const categoriesToDisplay = getCategoriesToDisplay();

  // Main render
  return (
    <div className="relative mx-auto overflow-visible bg-white pt-4">
      {/* PlayfulCategories component hidden per client request */}
      
      {/* Render a separate ExperienceGrid for each category to display */}
      <div className="mt-6 space-y-8">
        {categoriesToDisplay.length === 0 ? (
          <div className="py-4 text-center">No categories available</div>
        ) : (
          categoriesToDisplay.map(category => (
            <div key={category.id} className="category-section">
              {/* Category header with view all button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{category.name} Experiences</h2>
                <button 
                  onClick={() => handleViewAllClick(category.id)}
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
              {loadingExperiencesByCategory[category.id] ? (
                <div className="py-4 text-center">Loading {category.name} experiences...</div>
              ) : errorByCategory[category.id] ? (
                <div className="py-4 text-center text-red-600">{errorByCategory[category.id]}</div>
              ) : !experiencesByCategory[category.id] || experiencesByCategory[category.id].length === 0 ? (
                <div className="py-4 text-center">No experiences found for {category.name}</div>
              ) : (
                <ExperienceGrid
                  title={null} // Remove title as we now have it in the header with view all button
                  experiences={(experiencesByCategory[category.id] || []).slice(0, 5)}
                  showPrice={true}
                  showViewDetails={true}
                  isLoading={false}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomepageCategoriesSection;