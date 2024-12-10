import React, { useState, useEffect, useMemo } from 'react';
import districtService from '../services/districtService';

const ITEMS_PER_PAGE = 7;

// Reusable Item Component for both Districts and Cities
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
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredCityId, setHoveredCityId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDistricts = async () => {
    try {
      setIsLoading(true);
      const data = await districtService.getAllDistricts();
      setDistricts(data);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const fetchCities = async (districtId) => {
    try {
      setIsCitiesLoading(true);
      const data = await districtService.getCitiesByDistrict(districtId);
      setCities(data);
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
    setSelectedDistrict(district);
    await fetchCities(district.id);
  };

  const filteredAndPaginatedDistricts = useMemo(() => {
    const filtered = districts.filter(district =>
      district.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Districts</h2>
        
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
        
        <div className="mt-2 text-sm text-gray-500">
          Showing {filteredAndPaginatedDistricts.displayedDistricts.length} of {filteredAndPaginatedDistricts.totalResults} districts
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-2 mb-6">
          {filteredAndPaginatedDistricts.displayedDistricts.map((dist) => (
            <LocationItem
              key={dist.id}
              name={dist.name}
              isSelected={selectedDistrict?.id === dist.id}
              isHovered={hoveredId === dist.id}
              onClick={() => handleDistrictClick(dist)}
              onMouseEnter={() => setHoveredId(dist.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          ))}
        </div>

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
              <              svg
                className="w-12 h-12 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 9.75a7.5 7.5 0 105.5 0M12 4.75v5m0 0h5"
                />
              </svg>
              <p className="mt-4">No district selected</p>
            </div>
          ) : cities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No cities found for the selected district.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cities.map((city) => (
                <LocationItem
                  key={city.id}
                  name={city.name}
                  isSelected={false} // Adjust logic for city selection if needed
                  isHovered={hoveredCityId === city.id}
                  onClick={() => console.log(`Clicked on city: ${city.name}`)}
                  onMouseEnter={() => setHoveredCityId(city.id)}
                  onMouseLeave={() => setHoveredCityId(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredAndPaginatedDistricts.totalPages > 1 && (
        <div className="flex justify-between items-center p-6 border-t">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {filteredAndPaginatedDistricts.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, filteredAndPaginatedDistricts.totalPages))
            }
            disabled={currentPage === filteredAndPaginatedDistricts.totalPages}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentPage === filteredAndPaginatedDistricts.totalPages
                ? 'bg-gray-200 text-gray-500'
                : 'bg-blue-500 text-white'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default District;

