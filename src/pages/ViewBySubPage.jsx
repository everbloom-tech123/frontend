import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import ExperienceService from '../Admin_Pages/ExperienceService';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulSubcategories from '../components/PlayfulSubcategories';
import CategoryService from '../Admin_Pages/CategoryService';
import { CircularProgress, Chip, Box } from '@mui/material';

const ViewBySubPage = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const subcategoryParam = searchParams.get('subcategory');
  const [selectedSubcategories, setSelectedSubcategories] = useState(
    subcategoryParam ? [subcategoryParam] : []
  );
  const [experiences, setExperiences] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch category and all experiences
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch category data
        const categoryData = await CategoryService.getCategoryById(categoryId);
        setCategory(categoryData);

        // Fetch all experiences
        const allExperiences = await ExperienceService.getAllExperiences();
        
        // Filter experiences by category
        const categoryExperiences = allExperiences.filter(exp => 
          exp.categoryName === categoryData.name
        );
        
        setExperiences(categoryExperiences);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  // Filter experiences based on selected subcategories
  const filteredExperiences = React.useMemo(() => {
    if (!experiences.length) return [];
    if (!selectedSubcategories.length) return experiences;
    
    return experiences.filter(exp => 
      selectedSubcategories.some(sub => 
        exp.subcategory?.toLowerCase() === sub.toLowerCase()
      )
    );
  }, [experiences, selectedSubcategories]);

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategories(prev => {
      let newSelection;
      if (prev.includes(subcategory)) {
        // Remove subcategory if already selected
        newSelection = prev.filter(sub => sub !== subcategory);
      } else {
        // Add subcategory to selection
        newSelection = [...prev, subcategory];
      }
      
      // Update URL
      if (newSelection.length === 0) {
        navigate(``);
      } else {
        navigate(`?subcategory=${newSelection.join(',')}`);
      }
      
      return newSelection;
    });
  };

  const handleClearFilters = () => {
    setSelectedSubcategories([]);
    navigate(``);
  };

  if (error) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Experiences</h2>
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
    <div className="bg-gray-50 min-h-screen mt-16">
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/experiences')}
          className="mb-6 flex items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Experiences
        </button>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            {category && (
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {category.name} Experiences
              </h1>
            )}

            {category && category.sub && (
              <div className="mb-6">
                <PlayfulSubcategories
                  categoryId={categoryId}
                  onSubcategorySelect={handleSubcategorySelect}
                  activeSubcategories={selectedSubcategories}
                  subcategories={category.sub}
                />
                
                {/* Selected Subcategories Display */}
                {selectedSubcategories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <span className="text-gray-600">Selected Filters:</span>
                    {selectedSubcategories.map(sub => (
                      <Chip
                        key={sub}
                        label={sub}
                        onDelete={() => handleSubcategorySelect(sub)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    <Chip
                      label="Clear All"
                      onClick={handleClearFilters}
                      color="secondary"
                      variant="outlined"
                    />
                  </div>
                )}
              </div>
            )}

            <ExperienceGrid
              title={`Discover ${category?.name || ''} Experiences`}
              subtitle={
                selectedSubcategories.length > 0
                  ? `Exploring ${selectedSubcategories.join(', ')} adventures...`
                  : `Explore all ${category?.name} adventures...`
              }
              experiences={filteredExperiences}
              isLoading={loading}
              columns={3}
              showPrice={true}
              showViewDetails={true}
              className="mt-8"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ViewBySubPage;