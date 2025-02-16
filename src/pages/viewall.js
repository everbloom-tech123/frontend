import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulCategories from '../components/PlayfulCategories';

const ITEMS_PER_PAGE = 15;

const ViewAllExperiencesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  
  const [filter, setFilter] = useState(categoryParam || 'All');
  const [experiences, setExperiences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const [experiencesResponse, categoriesResponse] = await Promise.all([
          api.get('/public/api/products'),
          api.get('/public/api/categories')
        ]);

        setExperiences(experiencesResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam !== filter) {
      setFilter(categoryParam || 'All');
    }
  }, [categoryParam]);

  const filteredExperiences = filter === 'All' 
    ? experiences 
    : experiences.filter(exp => exp.categoryName === filter);

  const totalPages = Math.ceil(filteredExperiences.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExperiences = filteredExperiences.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    if (filter !== 'All') {
      params.set('category', filter);
    }
    setSearchParams(params);
  };

  const handleCategorySelect = (category) => {
    const params = new URLSearchParams();
    if (category !== 'All') {
      params.set('category', category);
    }
    params.set('page', '1');
    setSearchParams(params);
    setFilter(category);
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
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 py-8">
        <PlayfulCategories
          categories={categories}
          onCategorySelect={handleCategorySelect}
          activeCategory={filter}
        />
        <ExperienceGrid
          title="Discover Unforgettable Experiences"
          subtitle="Embark on a journey of a lifetime..."
          experiences={paginatedExperiences}
          isLoading={loading}
          columns={3}
          showPrice={true}
          showViewDetails={true}
          className="mt-8"
        />
        
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              First
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                return <span key={pageNumber}>...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllExperiencesPage;