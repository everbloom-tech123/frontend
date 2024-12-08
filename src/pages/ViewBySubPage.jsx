import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulSubcategories from '../components/PlayfulSubcategories';
import CategoryService from '../Admin_Pages/CategoryService';

const ViewBySubPage = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const subcategoryParam = searchParams.get('subcategory');
  const [filter, setFilter] = useState(subcategoryParam || 'All');
  const [experiences, setExperiences] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: config.API_BASE_URL || 'https://3.83.93.102.nip.io',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch category data
        const categoryData = await CategoryService.getCategoryById(categoryId);
        setCategory(categoryData);

        // Fetch all experiences for this category
        const experiencesResponse = await api.get('/public/api/products');
        if (experiencesResponse.data && Array.isArray(experiencesResponse.data)) {
          // Filter experiences by category ID first
          const categoryExperiences = experiencesResponse.data.filter(
            exp => exp.category?.id === parseInt(categoryId)
          );
          setExperiences(categoryExperiences);
        }
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
  }, [categoryId]); // Remove filter from dependencies since we're filtering in render

  useEffect(() => {
    setFilter(subcategoryParam || 'All');
  }, [subcategoryParam]);

  // Filter experiences based on selected subcategory
  const filteredExperiences = React.useMemo(() => {
    if (!experiences.length) return [];
    if (filter === 'All') return experiences;
    
    return experiences.filter(exp => 
      exp.subcategory?.toLowerCase() === filter.toLowerCase()
    );
  }, [experiences, filter]);

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

        {category && (
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {category.name} Experiences
          </h1>
        )}

        {category && category.sub && (
          <PlayfulSubcategories
            categoryId={categoryId}
            onSubcategorySelect={(subcategory) => {
              setFilter(subcategory);
              navigate(`?subcategory=${subcategory}`);
            }}
            activeSubcategory={filter}
            subcategories={category.sub} // Using the correct field name 'sub'
          />
        )}

        {/* Debug info - can be removed in production */}
        <div className="text-sm text-gray-500 mb-4">
          <p>Active Filter: {filter}</p>
          <p>Total Experiences: {experiences.length}</p>
          <p>Filtered Experiences: {filteredExperiences.length}</p>
        </div>

        <ExperienceGrid
          title={`Discover ${category?.name || ''} Experiences`}
          subtitle={`Explore amazing ${filter === 'All' ? category?.name : filter} adventures...`}
          experiences={filteredExperiences}
          isLoading={loading}
          columns={3}
          showPrice={true}
          showViewDetails={true}
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default ViewBySubPage;