import React, { useCallback, useEffect, useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const LocationMarker = ({ position, onLocationChange, cityBounds }) => {
  const [marker, setMarker] = useState(position);
  
  const isPointInPolygon = useCallback((point, polygon) => {
    if (!polygon?.length) return true;
    
    const latLng = L.latLng(point.lat, point.lng);
    const poly = L.polygon(polygon);
    return poly.getBounds().contains(latLng);
  }, []);

  useMapEvents({
    click(e) {
      const newPosition = e.latlng;
      if (isPointInPolygon(newPosition, cityBounds)) {
        setMarker(newPosition);
        onLocationChange(newPosition);
      }
    },
  });

  useEffect(() => {
    if (position && !marker) {
      setMarker(position);
    }
  }, [position, marker]);

  return marker ? <Marker position={marker} /> : null;
};

export default LocationMarker;