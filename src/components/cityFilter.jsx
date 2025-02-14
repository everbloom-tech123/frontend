import React, { useEffect, useState } from 'react';
import districtService from '../services/districtService';

const CityFilter = ({ districtId, onCitySelect }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      if (!districtId) return;

      try {
        setLoading(true);
        const response = await districtService.getCitiesByDistrict(districtId);
        setCities(response || []);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('Failed to load cities');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [districtId]);

  if (loading) return (
    <div className="flex items-center justify-center p-4">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-2 text-gray-600">Loading cities...</span>
    </div>
  );
  
  if (error) return (
    <div className="text-red-600 p-4">
      {error}
    </div>
  );

  return (
    <div className="relative w-full">
      <select
        onChange={(e) => onCitySelect(e.target.value)}
        defaultValue=""
        className="w-full p-2.5 text-gray-700 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:border-blue-600"
      >
        <option value="">All Cities</option>
        {cities.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default CityFilter;