import React, { useState, useEffect, useMemo } from 'react';
import districtService from '../services/districtService';

const ITEMS_PER_PAGE = 7;

// Reusable Location Item Component
const LocationItem = ({ name, isSelected, isHovered, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    className="group relative overflow-hidden"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div
      className={`
        flex items-center justify-between p-4 
        rounded-lg cursor-pointer
        transition-all duration-200 ease-in-out
        ${isSelected ? 'bg-blue-100' : 
          isHovered ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}
      `}
    >
      <div className="flex items-center gap-3">
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            isSelected ? 'text-blue-600' :
            isHovered ? 'text-blue-500' : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span
          className={`font-medium transition-colors duration-200 ${
            isSelected ? 'text-blue-800' :
            isHovered ? 'text-blue-700' : 'text-gray-700'
          }`}
        >
          {name}
        </span>
      </div>
    </div>
  </div>
);

const District = () => {
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredCityId, setHoveredCityId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDistricts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await districtService.getAllDistricts();
      setDistricts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      setError('Failed to load districts. Please try again.');
      setDistricts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCities = async (districtId) => {
    if (!districtId) return;
    
    try {
      setIsCitiesLoading(true);
      const data = await districtService.getCitiesByDistrict(districtId);
      setCities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setCities([]);
    } finally {
      setIsCitiesLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDistrictClick = async (district) => {
    if (!district?.id) return;
    
    setSelectedDistrict(district);
    setCities([]); // Clear previous cities
    await fetchCities(district.id);
  };

  const filteredAndPaginatedDistricts = useMemo(() => {
    if (!Array.isArray(districts)) {
      return { displayedDistricts: [], totalPages: 0, totalResults: 0 };
    }

    const filtered = districts.filter(district =>
      district?.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
    );

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return {
      displayedDistricts: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / ITEMS_PER_PAGE),
      totalResults: filtered.length
    };
  }, [districts, searchQuery, currentPage]);

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-xl font-semibold">Loading Districts</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-14 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex justify-between items-center text-red-700">
          <span>{error}</span>
          <button 
            onClick={fetchDistricts}
            className="px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Districts Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Districts</h2>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search districts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        {/* Results Counter */}
        {filteredAndPaginatedDistricts.totalResults > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            Showing {filteredAndPaginatedDistricts.displayedDistricts.length} of {filteredAndPaginatedDistricts.totalResults} districts
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Districts List */}
        {filteredAndPaginatedDistricts.displayedDistricts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No districts found
          </div>
        ) : (
          <div className="space-y-2 mb-6">
            {filteredAndPaginatedDistricts.displayedDistricts.map((district) => (
              <LocationItem
                key={district.id}
                name={district.name}
                isSelected={selectedDistrict?.id === district.id}
                isHovered={hoveredId === district.id}
                onClick={() => handleDistrictClick(district)}
                onMouseEnter={() => setHoveredId(district.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            ))}
          </div>
        )}

        {/* Cities Section */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDistrict ? `Cities in ${selectedDistrict.name}` : 'Select a district to view cities'}
          </h3>

          {isCitiesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-14 bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          ) : !selectedDistrict ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                />
              </svg>
              <p>Click on a district to view its cities</p>
            </div>
          ) : cities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No cities found in this district</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cities.map((city) => (
                <LocationItem
                  key={city.id}
                  name={city.name}
                  isHovered={hoveredCityId === city.id}
                  onMouseEnter={() => setHoveredCityId(city.id)}
                  onMouseLeave={() => setHoveredCityId(null)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAndPaginatedDistricts.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {[...Array(filteredAndPaginatedDistricts.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded-md ${
                    currentPage === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, filteredAndPaginatedDistricts.totalPages))}
              disabled={currentPage === filteredAndPaginatedDistricts.totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === filteredAndPaginatedDistricts.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default District;