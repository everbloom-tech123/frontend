import React, { useEffect } from 'react';
import { Marker, useMapEvents, Circle, useMap } from 'react-leaflet';
import { divIcon, Circle as LeafletCircle } from 'leaflet';

// Helper function to check if a point is inside a polygon
const isPointInPolygon = (point, polygon) => {
  const x = point[0], y = point[1];
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
};

const LocationMarker = ({ position, onLocationChange, cityBounds }) => {
  const map = useMap();

  // Effect to zoom in when position changes
  useEffect(() => {
    if (position) {
      // Zoom in close to the selected location (zoom level 18 for detailed view)
      map.flyTo([position.lat, position.lng], 18, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [position, map]);

  // Custom marker icon with a pulsing effect
  const customIcon = divIcon({
    html: `
      <div class="w-6 h-6 relative">
        <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        <div class="absolute inset-0 bg-blue-600 rounded-full"></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      
      if (cityBounds) {
        const isInside = isPointInPolygon([lat, lng], cityBounds);
        if (isInside) {
          onLocationChange(e.latlng);
          // Add a temporary highlight effect
          const circle = new LeafletCircle([lat, lng], {
            color: '#3B82F6',
            fillColor: '#93C5FD',
            fillOpacity: 0.5,
            radius: 20, // Smaller radius for zoomed in view
            className: 'cursor-pointer'
          }).addTo(map);
          
          setTimeout(() => map.removeLayer(circle), 1000);
        } else {
          // Visual feedback for invalid selection
          const invalidCircle = new LeafletCircle([lat, lng], {
            color: '#EF4444',
            fillColor: '#FCA5A5',
            fillOpacity: 0.5,
            radius: 20,
            className: 'cursor-pointer'
          }).addTo(map);
          
          setTimeout(() => map.removeLayer(invalidCircle), 1000);
          alert('Please select a location within the selected city boundaries');
        }
      } else {
        onLocationChange(e.latlng);
      }
    },
  });

  return position ? (
    <>
      <Marker position={position} icon={customIcon} />
      <Circle
        center={position}
        radius={30} // Smaller radius for zoomed in view
        pathOptions={{
          color: '#3B82F6',
          fillColor: '#93C5FD',
          fillOpacity: 0.2,
          weight: 1
        }}
      />
    </>
  ) : null;
};

export default LocationMarker;