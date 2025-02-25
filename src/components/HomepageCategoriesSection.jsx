import React, { useState, useEffect } from 'react';
import CategoryService from '../Admin_Pages/CategoryService';
import HomepageCategoryService from '../services/HomepageCategories';
import ExperienceService from '../Admin_Pages/ExperienceService';
import PlayfulCategories from './PlayfulCategories';
import ExperienceGrid from './ExperienceGrid';

const HomepageCategoriesSection = ({ onCategorySelect: externalOnCategorySelect, activeCategory }) => {
  const [homepageCategories, setHomepageCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  
  // Add experience state
  const [experiences, setExperiences] = useState([]);
  const [loadingExperiences, setLoadingExperiences] = useState(false);
  const [experienceError, setExperienceError] = useState(null);

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
        
        // Extract category IDs for fetching experiences
        const categoryIds = homepageCats.map(cat => cat.id);
        
        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
          console.log('Extracted category IDs for fetching experiences:', categoryIds);
          fetchExperiencesByCategories(categoryIds);
        } else {
          console.warn('No valid category IDs found, skipping experience fetch');
        }
      } catch (err) {
        console.error('Error fetching homepage categories:', err.message, err.stack);
        setError('Failed to load categories: ' + err.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  
  // Function to fetch experiences by category IDs
  const fetchExperiencesByCategories = async (categoryIds) => {
    try {
      // Validate inputs
      if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        console.warn('Invalid category IDs provided to fetchExperiencesByCategories:', categoryIds);
        return;
      }

      // Make sure all IDs are numbers
      const validIds = categoryIds.filter(id => id !== undefined && id !== null && !isNaN(parseInt(id)))
                                 .map(id => parseInt(id));
      
      if (validIds.length === 0) {
        console.warn('No valid category IDs after filtering, skipping fetch');
        return;
      }
      
      setLoadingExperiences(true);
      setExperienceError(null);
      
      console.log('Fetching experiences for category IDs:', validIds);
      
      const fetchedExperiences = await ExperienceService.getExperiencesByCategories(validIds);
      console.log('Fetched experiences:', fetchedExperiences);
      
      if (Array.isArray(fetchedExperiences)) {
        setExperiences(fetchedExperiences);
      } else {
        console.error('Invalid response format:', fetchedExperiences);
        setExperienceError('Received invalid data format from server');
        setExperiences([]);
      }
    } catch (err) {
      console.error('Error fetching experiences:', err.message, err.stack);
      setExperienceError('Failed to load experiences: ' + err.message);
      setExperiences([]);
    } finally {
      setLoadingExperiences(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    if (!category || !category.id) {
      console.error('Invalid category object received in handleCategorySelect:', category);
      return;
    }
    
    const categoryId = category.id;
    console.log('Category selected/deselected:', category.name, categoryId);

    let newSelectedIds = [];
    
    // Toggle category selection
    if (selectedCategoryIds.includes(categoryId)) {
      newSelectedIds = selectedCategoryIds.filter(id => id !== categoryId);
    } else {
      newSelectedIds = [...selectedCategoryIds, categoryId];
    }

    setSelectedCategoryIds(newSelectedIds);
    console.log('New selected category IDs:', newSelectedIds);

    if (externalOnCategorySelect) {
      externalOnCategorySelect(category);
    }
    
    // Fetch experiences based on selection
    if (newSelectedIds.length > 0) {
      fetchExperiencesByCategories(newSelectedIds);
    } else if (homepageCategories.length > 0) {
      // If no categories selected, show all homepage category experiences
      const allCategoryIds = homepageCategories.map(cat => cat.id);
      fetchExperiencesByCategories(allCategoryIds);
    }
  };

  // Get the title for the experience grid
  const getExperienceGridTitle = () => {
    if (selectedCategoryIds.length === 1) {
      const selectedCategory = homepageCategories.find(cat => cat.id === selectedCategoryIds[0]);
      return selectedCategory ? `${selectedCategory.name} Experiences` : "Experiences";
    } else if (selectedCategoryIds.length > 1) {
      return "Selected Experiences";
    } else {
      return "All Experiences";
    }
  };

  // Log current state for debugging
  console.log('Rendering HomepageCategoriesSection with:', {
    categories: homepageCategories.length,
    selectedCategoryIds,
    loadingCategories,
    error,
    experiences: experiences.length,
    loadingExperiences
  });

  // Render loading, error, or empty states
  if (loadingCategories) {
    return <div className="p-6 text-center">Loading categories...</div>;
  }

  if (error && homepageCategories.length === 0) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (homepageCategories.length === 0) {
    return <div className="p-6 text-center">No categories available</div>;
  }

  // Main render
  return (
    <div className="relative mx-auto overflow-visible bg-white px-6 pt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
          Explore Experiences
        </h1>
      </div>

      <PlayfulCategories
        categories={homepageCategories}
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
        selectedCategoryIds={selectedCategoryIds}
      />
      
      {/* Experience Grid for all experiences */}
      {loadingExperiences ? (
        <div className="py-8 text-center">Loading experiences...</div>
      ) : experienceError ? (
        <div className="py-8 text-center text-red-600">{experienceError}</div>
      ) : experiences.length === 0 ? (
        <div className="py-8 text-center">No experiences found for selected categories</div>
      ) : (
        <ExperienceGrid
          title={getExperienceGridTitle()}
          experiences={experiences}
          showPrice={true}
          showViewDetails={true}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default HomepageCategoriesSection;