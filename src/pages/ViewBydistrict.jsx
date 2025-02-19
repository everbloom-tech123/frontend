import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import districtService from '../services/districtService';
import ExperienceService from '../Admin_Pages/ExperienceService';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import ExperienceGrid from '../components/ExperienceGrid';

const ITEMS_PER_PAGE = 20;

const ExperienceByLocation = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();
  
  const [district, setDistrict] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const districtsData = await districtService.getAllDistricts();
        
        if (!districtsData || !Array.isArray(districtsData)) {
          throw new Error('Invalid districts data received');
        }

        const parsedDistrictId = parseInt(districtId, 10);
        const currentDistrict = districtsData.find(d => d.id === parsedDistrictId);
        
        if (!currentDistrict) {
          throw new Error(`District with ID ${districtId} not found`);
        }
        
        setDistrict(currentDistrict);
        const experienceData = await ExperienceService.filterByLocation(currentDistrict.id);

        if (!experienceData || !Array.isArray(experienceData)) {
          throw new Error('Invalid experience data received');
        }

        setExperiences(experienceData);
      } catch (err) {
        setError(err.message || 'Failed to load district information');
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    if (districtId) {
      fetchDistrictData();
    }
  }, [districtId]);

  const totalPages = Math.ceil(experiences.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExperiences = experiences.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (error) {
    return (
      <Card className="m-4">
        <CardContent>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <button
            onClick={() => navigate('/districts')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Districts
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-16 pb-8">
      <ExperienceGrid
        title={district?.name}
        subtitle={`Explore experiences in ${district?.name}`}
        experiences={paginatedExperiences}
        isLoading={loading}
        columns={3}
        showPrice={true}
        showViewDetails={true}
        onExperienceClick={(experience) => navigate(`/experience/${experience.id}`)}
      />

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceByLocation;