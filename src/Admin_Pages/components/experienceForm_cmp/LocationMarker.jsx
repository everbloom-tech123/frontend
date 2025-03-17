import React, { useEffect, useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const LocationMarker = ({ position, onLocationChange }) => {
  const [marker, setMarker] = useState(position);
  
  useMapEvents({
    click(e) {
      const newPosition = e.latlng;
      setMarker(newPosition);
      onLocationChange(newPosition);
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