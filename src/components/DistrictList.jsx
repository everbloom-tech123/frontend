import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import districtService from '../services/districtService';

// Constants
const ITEMS_PER_PAGE = 7;

// LocationItem component handles the display and interaction for each district
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
  // Hooks and state management
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch districts data from the service
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

  // Initial data fetch
  useEffect(() => {
    fetchDistricts();
  }, []);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Updated navigation handler - Now redirects to /viewby/:districtId
  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);
    navigate(`/viewby/${district.id}`);  // Updated route pattern
  };

  // Memoized filtering and pagination logic
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

  // Loading state UI
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

  // Main component UI
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Districts</h2>
        
        {/* Search input */}
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
        
        {/* Results counter */}
        <div className="mt-2 text-sm text-gray-500">
          Showing {filteredAndPaginatedDistricts.displayedDistricts.length} of {filteredAndPaginatedDistricts.totalResults} districts
        </div>
      </div>

      <div className="p-6">
        {/* Districts list */}
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