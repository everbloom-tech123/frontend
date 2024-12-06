import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import ExperienceGrid from '../components/ExperienceGrid';
import PlayfulCategories from '../components/PlayfulCategories';

const ViewAllExperiencesPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [filter, setFilter] = useState(categoryParam || 'All');
  const [experiences, setExperiences] = useState([]);
  const [categories, setCategories] = useState([]);
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
        const [experiencesResponse, categoriesResponse] = await Promise.all([
          api.get('/public/api/products'),
          api.get('/public/api/categories')
        ]);

        if (experiencesResponse.data && Array.isArray(experiencesResponse.data)) {
          setExperiences(experiencesResponse.data);
        }

        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilter(categoryParam || 'All');
  }, [categoryParam]);

  const filteredExperiences = filter === 'All' 
    ? experiences 
    : experiences.filter(exp => exp.categoryName === filter);

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
        {/* <PlayfulCategories
          categories={categories}
          onCategorySelect={setFilter}
          activeCategory={filter}
        /> */}
        <ExperienceGrid
          title="Discover Unforgettable Experiences"
          subtitle="Embark on a journey of a lifetime..."
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

export default ViewAllExperiencesPage;