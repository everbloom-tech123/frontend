import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CategoryService from '../Admin_Pages/CategoryService';
import HomepageCategoryService from '../services/HomepageCategories';
import ExperienceService from '../Admin_Pages/ExperienceService';
import apiCache from './ApiCacheService';
import apiThrottle from './ApiThrottleService';

// Create context
const DataContext = createContext();

// Custom hook to use the data context
export const useData = () => useContext(DataContext);

// Provider component
export const DataProvider = ({ children }) => {
  // State for all categories
  const [allCategories, setAllCategories] = useState([]);
  const [homepageCategories, setHomepageCategories] = useState([]);
  const [experiencesByCategory, setExperiencesByCategory] = useState({});
  const [allExperiences, setAllExperiences] = useState([]);
  
  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingHomepageCategories, setLoadingHomepageCategories] = useState(true);
  const [loadingExperiencesByCategory, setLoadingExperiencesByCategory] = useState({});
  const [loadingAllExperiences, setLoadingAllExperiences] = useState(true);
  
  // Error states
  const [errors, setErrors] = useState({
    categories: null,
    homepageCategories: null,
    experiences: null
  });

  // Function to fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      
      // Use cache and throttling
      const categories = await apiThrottle.throttleRequest(
        'categories/all',
        async () => {
          return await apiCache.getOrFetch(
            'categories/all',
            () => CategoryService.getAllCategories(),
            10 * 60 * 1000 // Cache for 10 minutes
          );
        }
      );
      
      if (Array.isArray(categories)) {
        setAllCategories(categories);
      } else {
        throw new Error('Invalid categories response format');
      }
      
      setErrors(prev => ({ ...prev, categories: null }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrors(prev => ({ ...prev, categories: error.message }));
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // Function to fetch active homepage categories
  const fetchHomepageCategories = useCallback(async () => {
    try {
      setLoadingHomepageCategories(true);
      
      // Use cache and throttling
      const homepageCats = await apiThrottle.throttleRequest(
        'homepage-categories/active',
        async () => {
          return await apiCache.getOrFetch(
            'homepage-categories/active',
            () => HomepageCategoryService.getActiveHomepageCategories(),
            5 * 60 * 1000 // Cache for 5 minutes
          );
        }
      );
      
      if (Array.isArray(homepageCats)) {
        setHomepageCategories(homepageCats);
      } else {
        console.warn('Invalid homepage categories response format', homepageCats);
        setHomepageCategories([]);
      }
      
      setErrors(prev => ({ ...prev, homepageCategories: null }));
    } catch (error) {
      console.error('Error fetching homepage categories:', error);
      setErrors(prev => ({ ...prev, homepageCategories: error.message }));
      
      // Fallback to empty array on error to prevent UI breaks
      setHomepageCategories([]);
    } finally {
      setLoadingHomepageCategories(false);
    }
  }, []);

  // Function to fetch all experiences
  const fetchAllExperiences = useCallback(async () => {
    try {
      setLoadingAllExperiences(true);
      
      // Use cache and throttling
      const experiences = await apiThrottle.throttleRequest(
        'experiences/limited',
        async () => {
          return await apiCache.getOrFetch(
            'experiences/limited',
            () => ExperienceService.getLimitedExperiences(),
            5 * 60 * 1000 // Cache for 5 minutes
          );
        }
      );
      
      if (Array.isArray(experiences)) {
        setAllExperiences(experiences);
      } else {
        throw new Error('Invalid experiences response format');
      }
      
      setErrors(prev => ({ ...prev, experiences: null }));
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setErrors(prev => ({ ...prev, experiences: error.message }));
    } finally {
      setLoadingAllExperiences(false);
    }
  }, []);

  // Function to fetch experiences for a specific category
  const fetchExperiencesForCategory = useCallback(async (categoryId, categoryName) => {
    if (!categoryId) return;
    
    try {
      // Update loading state for this category
      setLoadingExperiencesByCategory(prev => ({
        ...prev,
        [categoryId]: true
      }));
      
      // Use cache and throttling
      const experiences = await apiThrottle.throttleRequest(
        `experiences/categories/${categoryId}`,
        async () => {
          return await apiCache.getOrFetch(
            `experiences/categories/${categoryId}`,
            () => ExperienceService.getExperiencesByCategories([categoryId]),
            5 * 60 * 1000 // Cache for 5 minutes
          );
        },
        {
          // Add debounce time to space out requests
          debounceMs: 500 * (Math.random() + 0.5) // Random debounce between 250ms and 750ms
        }
      );
      
      console.log(`Fetched ${experiences?.length || 0} experiences for category ${categoryName || categoryId}`);
      
      // Store experiences for this category
      setExperiencesByCategory(prev => ({
        ...prev,
        [categoryId]: experiences || []
      }));
    } catch (error) {
      console.error(`Error fetching experiences for category ${categoryName || categoryId}:`, error);
      
      // Initialize with empty array on error
      setExperiencesByCategory(prev => ({
        ...prev,
        [categoryId]: []
      }));
    } finally {
      // Update loading state
      setLoadingExperiencesByCategory(prev => ({
        ...prev,
        [categoryId]: false
      }));
    }
  }, []);

  // Process homepage categories - combine category info with homepage settings
  const processedHomepageCategories = useCallback(() => {
    if (loadingCategories || loadingHomepageCategories) {
      return [];
    }
    
    // Check if we have homepage categories data
    if (!homepageCategories || homepageCategories.length === 0) {
      console.log('No homepage categories available, using fallback');
      // If no homepage categories data is available, default to using the first few general categories
      // as a fallback so the UI still shows something useful
      return allCategories.slice(0, 3).map((cat, index) => ({
        ...cat,
        displayOrder: index
      }));
    }
    
    // Normal processing of homepage categories
    return homepageCategories
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
  }, [allCategories, homepageCategories, loadingCategories, loadingHomepageCategories]);

  // Fetch experiences for all homepage categories
  const fetchExperiencesForHomepageCategories = useCallback(() => {
    const categories = processedHomepageCategories();
    
    if (!categories || categories.length === 0) {
      return;
    }
    
    // Initialize loading states for all categories
    const newLoadingStates = {};
    categories.forEach(category => {
      newLoadingStates[category.id] = true;
    });
    setLoadingExperiencesByCategory(prev => ({ ...prev, ...newLoadingStates }));
    
    // Fetch experiences for each category with a small delay between requests
    categories.forEach((category, index) => {
      // Stagger requests to prevent rate limiting
      setTimeout(() => {
        fetchExperiencesForCategory(category.id, category.name);
      }, index * 300); // 300ms delay between each request
    });
  }, [processedHomepageCategories, fetchExperiencesForCategory]);

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
    fetchHomepageCategories();
    fetchAllExperiences();
  }, [fetchCategories, fetchHomepageCategories, fetchAllExperiences]);

  // Fetch experiences when homepage categories are processed
  useEffect(() => {
    // Only proceed if we have categories and they're not loading
    if (!loadingCategories && !loadingHomepageCategories) {
      fetchExperiencesForHomepageCategories();
    }
  }, [loadingCategories, loadingHomepageCategories, fetchExperiencesForHomepageCategories]);

  // Create the context value
  const contextValue = {
    // Data
    allCategories,
    homepageCategories: processedHomepageCategories(),
    experiencesByCategory,
    allExperiences,
    
    // Loading states
    loadingCategories,
    loadingHomepageCategories,
    loadingExperiencesByCategory,
    loadingAllExperiences,
    
    // Error states
    errors,
    
    // Actions
    refreshCategories: fetchCategories,
    refreshHomepageCategories: fetchHomepageCategories,
    refreshExperiences: fetchAllExperiences,
    refreshExperiencesForCategory: fetchExperiencesForCategory
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;