// src/utils/locationUtils.js

const SRI_LANKA_BOUNDS = {
  minLat: 5.9,
  maxLat: 9.9,
  minLng: 79.6,
  maxLng: 81.9
};

// Default district bounds for Sri Lanka
const SRI_LANKA_DEFAULT_BOUNDS = [
  [5.9, 79.6],  // SW corner
  [9.9, 79.6],  // NW corner
  [9.9, 81.9],  // NE corner
  [5.9, 81.9]   // SE corner
];

// Validate if bounds are within Sri Lanka
const isWithinSriLanka = (bounds) => {
  return bounds.every(([lat, lng]) =>
    lat >= SRI_LANKA_BOUNDS.minLat &&
    lat <= SRI_LANKA_BOUNDS.maxLat &&
    lng >= SRI_LANKA_BOUNDS.minLng &&
    lng <= SRI_LANKA_BOUNDS.maxLng
  );
};

export const fetchDistrictBoundaries = async (districtName, countryCode = 'LK') => {
  try {
    // Search for the district with stricter parameters
    const searchUrl = `https://nominatim.openstreetmap.org/search?county=${encodeURIComponent(districtName)}&country=${countryCode}&format=json&limit=1&addressdetails=1`;
    const searchResponse = await fetch(searchUrl);
    const searchResults = await searchResponse.json();

    if (!searchResults.length) {
      console.warn(`No results for ${districtName} district, Sri Lanka`);
      return { bounds: SRI_LANKA_DEFAULT_BOUNDS, center: [7.8731, 80.7718] };
    }

    console.log(`Nominatim search result for ${districtName} district:`, searchResults[0]);

    // Try detailed boundary data for the district
    const osmId = searchResults[0].osm_id;
    const osmType = searchResults[0].osm_type.charAt(0).toUpperCase();
    const boundaryUrl = `https://nominatim.openstreetmap.org/details.php?osmtype=${osmType}&osmid=${osmId}&class=boundary&format=json&polygon_geojson=1`;
    const boundaryResponse = await fetch(boundaryUrl);
    const boundaryData = await boundaryResponse.json();

    if (boundaryData.geometry?.type === 'Polygon' && boundaryData.geometry.coordinates) {
      const bounds = boundaryData.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]); // Convert [lng, lat] to [lat, lng]
      if (isWithinSriLanka(bounds)) {
        return {
          bounds,
          center: [parseFloat(searchResults[0].lat), parseFloat(searchResults[0].lon)]
        };
      }
      console.warn(`Boundaries for ${districtName} outside Sri Lanka:`, bounds);
    }

    // Fallback to bounding box
    const bbox = searchResults[0].boundingbox;
    const fallbackBounds = [
      [parseFloat(bbox[0]), parseFloat(bbox[2])], // SW
      [parseFloat(bbox[0]), parseFloat(bbox[3])], // SE
      [parseFloat(bbox[1]), parseFloat(bbox[3])], // NE
      [parseFloat(bbox[1]), parseFloat(bbox[2])]  // NW
    ];

    if (isWithinSriLanka(fallbackBounds)) {
      return {
        bounds: fallbackBounds,
        center: [parseFloat(searchResults[0].lat), parseFloat(searchResults[0].lon)]
      };
    }

    console.warn(`Fallback bounding box for ${districtName} outside Sri Lanka:`, fallbackBounds);
    return { bounds: SRI_LANKA_DEFAULT_BOUNDS, center: [7.8731, 80.7718] };
  } catch (error) {
    console.error('Error fetching district boundaries:', error);
    return { bounds: SRI_LANKA_DEFAULT_BOUNDS, center: [7.8731, 80.7718] };
  }
};