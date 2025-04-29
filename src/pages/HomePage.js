import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomepageGrid from '../components/HomepageGrid';
import ExperienceService from '../Admin_Pages/ExperienceService';
import Header from '../components/traveTips';
import ModernHero from '../components/modernHero';
import DestinationExplorer from '../components/Destination';
import ImageGrid from '../components/imageLayout';
import HomepageCategoriesSection from '../components/HomepageCategoriesSection';
import config from '../config';

const HomePage = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [specialExperiences, setSpecialExperiences] = useState([]);
  const [mostPopularExperiences, setMostPopularExperiences] = useState([]);
  const [allExperiences, setAllExperiences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cache key and TTL (30 minutes in milliseconds)
  const CACHE_KEY = 'homepage_data';
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  // Direct API call for homepage data
  const fetchHomepageData = async (categoriesLimit = 5) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = `${config.API_BASE_URL}/public/api/homepage/data?categoriesLimit=${categoriesLimit}`;
      
      console.log('Fetching homepage data from:', API_URL);
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch homepage data';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('API error details:', errorData);
        } catch (e) {
          console.error('Could not parse error response');
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Homepage data fetched successfully:', {
        specialProducts: data.specialProducts?.length || 0,
        popularProducts: data.popularProducts?.length || 0, 
        categories: data.categories?.length || 0
      });
      
      // Cache the data with timestamp
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      
      return data;
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      throw error;
    }
  };

  // Check if cached data is valid
  const getCachedData = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    try {
      const { data, timestamp } = JSON.parse(cached);
      const isValid = Date.now() - timestamp < CACHE_TTL;
      return isValid ? data : null;
    } catch (e) {
      console.error('Error parsing cached data:', e);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        // Check for valid cached data first
        const cachedData = getCachedData();
        let homepageData;

        if (cachedData) {
          console.log('Using cached homepage data');
          homepageData = cachedData;
        } else {
          console.log('Fetching fresh homepage data...');
          homepageData = await fetchHomepageData(5);
        }
        
        if (!homepageData || typeof homepageData !== 'object') {
          throw new Error('Invalid data structure received');
        }
        
        // Extract data with proper fallbacks to empty arrays
        const specialProducts = Array.isArray(homepageData.specialProducts) 
          ? homepageData.specialProducts 
          : [];
          
        const popularProducts = Array.isArray(homepageData.popularProducts) 
          ? homepageData.popularProducts 
          : [];
          
        const categoriesData = Array.isArray(homepageData.categories) 
          ? homepageData.categories 
          : [];
        
        console.log('Processing data:', {
          special: specialProducts.length,
          popular: popularProducts.length, 
          categories: categoriesData.length
        });
        
        // Set state with the fetched/cached data
        if (isMounted) {
          setSpecialExperiences(specialProducts);
          setMostPopularExperiences(popularProducts);
          setCategories(categoriesData);
          
          // Collect all experiences from categories
          const allCategoryExperiences = [];
          categoriesData.forEach(category => {
            if (category.experiences && Array.isArray(category.experiences)) {
              console.log(`Category "${category.categoryName}" has ${category.experiences.length} experiences`);
              allCategoryExperiences.push(...category.experiences);
            }
          });
          
          // Combine all experiences and remove duplicates by ID
          const combinedExperiences = [
            ...specialProducts, 
            ...popularProducts,
            ...allCategoryExperiences
          ];
          
          const uniqueExperiences = Array.from(
            new Map(combinedExperiences.map(item => [item.id, item])).values()
          );
          
          console.log(`Combined ${uniqueExperiences.length} unique experiences`);
          
          setAllExperiences(uniqueExperiences);
          setFilteredExperiences(uniqueExperiences);
          
          // Set featured experiences (either with featured flag or special flag)
          const featured = uniqueExperiences.filter(exp => exp.featured || exp.special);
          setFeaturedExperiences(featured);
        }
        
      } catch (err) {
        console.error('Error loading homepage data:', err);
        if (isMounted) {
          setError('Failed to load data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategorySelect = (categoryName) => {
    setActiveCategory(categoryName);
    
    if (categoryName === 'All') {
      setFilteredExperiences(allExperiences);
    } else {
      const selectedCategory = categories.find(cat => 
        cat.categoryName === categoryName
      );
      
      if (selectedCategory && selectedCategory.experiences) {
        setFilteredExperiences(selectedCategory.experiences);
      } else {
        console.warn(`Category "${categoryName}" not found or has no experiences`);
        setFilteredExperiences([]);
      }
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
          {/* Featured/Special Experiences Section */}
          <HomepageGrid
            title="Featured Experiences :"
            subtitle="Exclusive offers and unique experiences"
            experiences={specialExperiences}
            columns={3}
            onExperienceClick={handleExperienceClick}
            isLoading={loading}
            maxDisplay={6}
            viewAllLink="/featured"
          />

          {/* Categories Section */}
          <div className="relative mb-16">
            <HomepageCategoriesSection 
              onCategorySelect={handleCategorySelect}
              activeCategory={activeCategory}
              categories={categories}
            /> 
          </div>

          {/* Most Popular Experiences Section */}
          <HomepageGrid
            title="Most Popular Experiences"
            subtitle="Top-rated experiences loved by our community"
            experiences={mostPopularExperiences}
            columns={3}
            onExperienceClick={handleExperienceClick}
            isLoading={loading}
            maxDisplay={6}
            viewAllLink="/popular"
          />

          <Header/>
        </div>
      </div>

      {/* All/Filtered Experiences Section */}
      {filteredExperiences.length > 0 && (
        <div className="relative mx-auto overflow-visible bg-white px-6 pt-6">
          <div className="relative mb-16">
            <HomepageGrid
              title={activeCategory === 'All' ? 'All Experiences' : `${activeCategory} Experiences`}
              subtitle={activeCategory === 'All' 
                ? 'Explore all our amazing experiences' 
                : `Discover our ${activeCategory.toLowerCase()} experiences`}
              experiences={filteredExperiences}
              columns={3}
              onExperienceClick={handleExperienceClick}
              isLoading={loading}
              maxDisplay={6}
              viewAllLink="/viewall"
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