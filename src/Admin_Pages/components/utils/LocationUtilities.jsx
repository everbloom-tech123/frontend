// src/utils/locationUtils.js

// Function to fetch city boundaries from OpenStreetMap's Nominatim service
export const fetchCityBoundaries = async (cityName, countryCode = 'LK') => {
    try {
      // First, search for the city to get its OSM ID
      const searchUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&country=${countryCode}&format=json`;
      const searchResponse = await fetch(searchUrl);
      const searchResults = await searchResponse.json();
      
      if (!searchResults.length) {
        throw new Error('City not found');
      }
  
      // Get the detailed boundary data using the OSM ID
      const osmId = searchResults[0].osm_id;
      const boundaryUrl = `https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=${osmId}&class=boundary&format=json&polygon_geojson=1`;
      const boundaryResponse = await fetch(boundaryUrl);
      const boundaryData = await boundaryResponse.json();
      
      // If we have proper geometry data, use it
      if (boundaryData.geometry && boundaryData.geometry.coordinates) {
        return {
          bounds: boundaryData.geometry.coordinates[0],
          center: [searchResults[0].lat, searchResults[0].lon],
        };
      }
      
      // Fallback: Create approximate boundary using bounding box
      const bbox = searchResults[0].boundingbox;
      return {
        bounds: [
          [bbox[0], bbox[2]], // SW
          [bbox[0], bbox[3]], // SE
          [bbox[1], bbox[3]], // NE
          [bbox[1], bbox[2]], // NW
        ],
        center: [searchResults[0].lat, searchResults[0].lon],
      };
    } catch (error) {
      console.error('Error fetching city boundaries:', error);
      return null;
    }
  };