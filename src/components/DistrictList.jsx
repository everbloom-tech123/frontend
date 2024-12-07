import React, { useState, useEffect } from 'react';
import districtService from '../services/districtService';

const District= () => {
  const [district, setdistrict] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetDistricts = async () => {
    try {
      setIsLoading(true);
      const data = await districtService.getAllDistricts();
      setdistrict(data);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      // Keep the loading state to show loading skeleton instead of error
    } finally {
      // Add a minimum delay to make loading less jarring
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    fetDistricts();
  }, []);

  // Loading skeleton that matches the final layout
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="space-y-3">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-12 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <div className="space-y-2">
          {district.map((district) => (
            <div
              key={district.id}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <span className="text-gray-800">
                {district.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default District;