import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, TextField } from '@mui/material';
import { MapContainer, TileLayer, Marker, Polygon, useMap } from 'react-leaflet';
import LocationMarker from './LocationMarker';
import 'leaflet/dist/leaflet.css';

const MapUpdater = ({ cityBounds, mapCenter, mapZoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (cityBounds?.length) {
      const bounds = cityBounds.reduce((bounds, point) => 
        bounds.extend([point[0], point[1]]), map.getBounds());
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, duration: 1 });
    } else {
      map.flyTo(mapCenter, mapZoom, { duration: 1 });
    }
  }, [cityBounds, mapCenter, mapZoom, map]);

  return null;
};

const LocationPicker = ({ 
  showMap, 
  setShowMap, 
  mapCenter, 
  mapZoom, 
  setMapRef,
  mapPosition, 
  handleLocationChange,
  cityBounds,
  formData
}) => {
  const handleMapClick = useCallback((position) => {
    handleLocationChange(position);
  }, [handleLocationChange]);

  const isLocationValid = useCallback((position) => {
    if (!position || !cityBounds?.length) return false;
    return true;
  }, [cityBounds]);

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
            Click on the map to select location within city boundaries
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
                cityBounds={cityBounds}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
              />
              <LocationMarker
                position={mapPosition}
                onLocationChange={handleMapClick}
                cityBounds={cityBounds}
              />
              {cityBounds?.length > 0 && (
                <Polygon
                  positions={cityBounds}
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
          error={!isLocationValid(mapPosition)}
        />
        <TextField 
          label="Longitude"
          name="longitude"
          type="number"
          value={formData.longitude || ''}
          required
          fullWidth
          InputProps={{ readOnly: true }}
          error={!isLocationValid(mapPosition)}
        />
      </Box>
    </Box>
  );
};

export default LocationPicker;