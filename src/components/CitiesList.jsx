import React, { useState } from 'react';

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

const CitiesList = ({ selectedDistrict, cities, isLoading }) => {
  const [hoveredCityId, setHoveredCityId] = useState(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-14 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!selectedDistrict) {
    return (
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
    );
  }

  if (cities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No cities found in this district</p>
      </div>
    );
  }

  return (
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
  );
};

export default CitiesList;