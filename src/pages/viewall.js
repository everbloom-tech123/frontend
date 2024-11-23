import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import ExperienceGrid from '../components/ExperienceGrid';

const ViewAllExperiencesPage = () => {
  const [filter, setFilter] = useState('All');
  const [experiences, setExperiences] = useState([]);
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
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await api.get('/public/api/products');
        
        if (response.data && Array.isArray(response.data)) {
          setExperiences(response.data);
        }
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Cultural', value: 'Cultural' },
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Culinary', value: 'Culinary' },
    { label: 'Wildlife', value: 'Wildlife' }
  ].map(option => ({
    ...option,
    onClick: () => setFilter(option.value)
  }));

  const filteredExperiences = filter === 'All' 
    ? experiences 
    : experiences.filter(exp => exp.category === filter);

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
        <ExperienceGrid
          title="Discover Unforgettable Experiences"
          subtitle="Embark on a journey of a lifetime..."
          experiences={filteredExperiences}
          isLoading={loading}
          filterOptions={filterOptions}
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