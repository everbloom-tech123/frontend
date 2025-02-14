import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import districtService from '../services/districtService';
import ExperienceService from '../Admin_Pages/ExperienceService';
import PlayfulCities from './PlayfulCities';
import ExperienceGrid from '../components/ExperienceGrid';

const ExperienceByLocation = () => {
  const { districtId } = useParams();
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city');
  const navigate = useNavigate();
  
  const [district, setDistrict] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(cityParam || '');
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [experiencesLoading, setExperiencesLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch district details
        const districtData = await districtService.getDistrictById(districtId);
        setDistrict(districtData);

        // Fetch cities for this district
        const citiesData = await districtService.getCitiesByDistrict(districtId);
        setCities(citiesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (districtId) {
      fetchData();
    }
  }, [districtId]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setExperiencesLoading(true);
        let data;
        
        if (selectedCity) {
          // If a city is selected, filter by city
          const cityData = cities.find(city => city.name === selectedCity);
          data = await ExperienceService.filterByLocation(cityData?.id, null);
        } else {
          // Otherwise, filter by district
          data = await ExperienceService.filterByLocation(null, districtId);
        }
        
        setExperiences(data);
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError(err.message);
      } finally {
        setExperiencesLoading(false);
      }
    };

    if (district) {
      fetchExperiences();
    }
  }, [districtId, selectedCity, district, cities]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    if (city) {
      navigate(`?city=${city}`);
    } else {
      navigate('');
    }
  };

  if (error) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Data</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
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
          onClick={() => navigate('/districts')}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
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
          Back to All Districts
        </button>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {district && (
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Experiences in {district.name}
              </h1>
            )}

            {cities.length > 0 && (
              <div className="mb-6">
                <PlayfulCities
                  districtId={districtId}
                  onCitySelect={handleCitySelect}
                  activeCity={selectedCity}
                  cities={cities}
                />
                
                {selectedCity && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-gray-600">Selected City:</span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {selectedCity}
                      <button
                        onClick={() => handleCitySelect('')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <ExperienceGrid
              title={selectedCity ? `Experiences in ${selectedCity}` : `All Experiences in ${district?.name}`}
              subtitle={selectedCity ? `Exploring adventures in ${selectedCity}` : `Discover amazing experiences across ${district?.name}`}
              experiences={experiences}
              isLoading={experiencesLoading}
              showPrice={true}
              showViewDetails={true}
              columns={4}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ExperienceByLocation;