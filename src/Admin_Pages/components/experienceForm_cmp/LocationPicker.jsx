import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, TextField } from '@mui/material';
import { MapContainer, TileLayer, Marker, Polygon, useMap } from 'react-leaflet';
import LocationMarker from './LocationMarker';
import 'leaflet/dist/leaflet.css';

// Improved map updater with better bounds handling
const MapUpdater = ({ districtBounds, mapCenter, mapZoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (districtBounds?.length) {
      try {
        // Create a proper Leaflet bounds object from the district boundaries
        const latLngs = districtBounds.map(point => [point[0], point[1]]);
        map.fitBounds(latLngs, { 
          padding: [50, 50], 
          maxZoom: 13, 
          duration: 1,
          animate: true 
        });
      } catch (error) {
        console.error("Error fitting bounds:", error);
        map.flyTo(mapCenter, mapZoom, { duration: 1 });
      }
    } else {
      map.flyTo(mapCenter, mapZoom, { duration: 1 });
    }
  }, [districtBounds, mapCenter, mapZoom, map]);

  return null;
};

// Function to check if a point is inside a polygon
const isPointInPolygon = (point, polygon) => {
  if (!point || !polygon || polygon.length < 3) return true; // If no polygon is defined, allow any point
  
  const x = point.lng;
  const y = point.lat;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    // Ensure we're using consistent lat/lng ordering
    const xi = polygon[i][1]; // longitude
    const yi = polygon[i][0]; // latitude
    const xj = polygon[j][1];
    const yj = polygon[j][0];
    
    const intersect = ((yi > y) !== (yj > y)) && 
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

const LocationPicker = ({ 
  showMap, 
  setShowMap, 
  mapCenter, 
  mapZoom, 
  setMapRef,
  mapPosition, 
  handleLocationChange,
  districtBounds,
  formData
}) => {
  // Improved handler with validation
  const handleMapClick = useCallback((position) => {
    if (isLocationValid(position)) {
      handleLocationChange(position);
    } else {
      // Optionally show an error message that location is outside boundaries
      console.warn("Selected location is outside district boundaries");
    }
  }, [handleLocationChange, districtBounds]);

  // Improved validation that checks district boundaries
  const isLocationValid = useCallback((position) => {
    if (!position) return false;
    if (!districtBounds?.length) return true; // If no district boundaries, all locations are valid
    
    // Check if the position is within district boundaries
    return isPointInPolygon(position, districtBounds);
  }, [districtBounds]);

  useEffect(() => {
    if (mapPosition && isLocationValid(mapPosition)) {
      handleLocationChange(mapPosition);
    }
  }, [mapPosition, isLocationValid, handleLocationChange]);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>Location</Typography>
      <Button 
        variant="outlined" 
        onClick={() => setShowMap(!showMap)}
        sx={{ mb: 2 }}
      >
        {showMap ? 'Hide Map' : 'Select Location on Map'}
      </Button>
      
      {showMap && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Click on the map to select location within district boundaries
          </Typography>
          <Box sx={{ height: 400, width: '100%', mb: 2 }}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              ref={setMapRef}
              whenReady={(map) => setMapRef(map)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater 
                districtBounds={districtBounds}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
              />
              <LocationMarker
                position={mapPosition}
                onLocationChange={handleMapClick}
              />
              {districtBounds?.length > 0 && (
                <Polygon
                  positions={districtBounds}
                  pathOptions={{
                    color: '#0000FF',
                    fillColor: '#0000FF',
                    fillOpacity: 0.1,
                    weight: 2
                  }}
                />
              )}
            </MapContainer>
          </Box>
          {mapPosition && (
            <Typography variant="body2" color={isLocationValid(mapPosition) ? 'textPrimary' : 'error'}>
              Selected Location: {mapPosition.lat.toFixed(6)}, {mapPosition.lng.toFixed(6)}
              {!isLocationValid(mapPosition) && " (Outside district boundaries)"}
            </Typography>
          )}
        </Paper>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField 
          label="Latitude"
          name="latitude"
          type="number"
          value={formData.latitude || ''}
          required
          fullWidth
          InputProps={{ readOnly: true }}
          error={mapPosition && !isLocationValid(mapPosition)}
          helperText={mapPosition && !isLocationValid(mapPosition) ? "Location outside boundaries" : ""}
        />
        <TextField 
          label="Longitude"
          name="longitude"
          type="number"
          value={formData.longitude || ''}
          required
          fullWidth
          InputProps={{ readOnly: true }}
          error={mapPosition && !isLocationValid(mapPosition)}
          helperText={mapPosition && !isLocationValid(mapPosition) ? "Location outside boundaries" : ""}
        />
      </Box>
    </Box>
  );
};

export default LocationPicker;