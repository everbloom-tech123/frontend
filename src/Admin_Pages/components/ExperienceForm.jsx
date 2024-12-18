import React, { useState, useEffect } from 'react';
import {
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Box, Chip, Stack, Typography, Alert, IconButton, CircularProgress,
  FormControlLabel, Switch, Paper
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CategoryService from '../CategoryService';
import ExperienceService from '../ExperienceService';
import districtService from '../../services/districtService';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Function to fetch city boundaries from Nominatim
const fetchCityBoundaries = async (cityName, countryCode = 'LK') => {
  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&country=${countryCode}&format=json`;
    const searchResponse = await fetch(searchUrl);
    const searchResults = await searchResponse.json();
    
    if (!searchResults.length) {
      throw new Error('City not found');
    }

    const osmId = searchResults[0].osm_id;
    const boundaryUrl = `https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=${osmId}&class=boundary&format=json&polygon_geojson=1`;
    const boundaryResponse = await fetch(boundaryUrl);
    const boundaryData = await boundaryResponse.json();
    
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

// LocationMarker component with boundary checking
const LocationMarker = ({ position, onLocationChange, cityBounds }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      
      if (cityBounds) {
        const isInside = isPointInPolygon([lat, lng], cityBounds);
        if (isInside) {
          onLocationChange(e.latlng);
        } else {
          alert('Please select a location within the selected city boundaries');
        }
      } else {
        onLocationChange(e.latlng);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

const ExperienceForm = ({ experience, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    additionalInfo: '',
    price: '',
    discount: '0',
    categoryId: '',
    subcategory: '',
    tags: [],
    images: [],
    video: null,
    imageUrls: [],
    videoUrl: '',
    special: false,
    districtId: '',
    cityId: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [imageError, setImageError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState(null);
  const [cityBounds, setCityBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Sri Lanka center
  const [mapZoom, setMapZoom] = useState(8);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchDistricts();
    if (experience) {
      setFormData({
        ...experience,
        categoryId: experience.category?.id || '',
        subcategory: experience.subcategory || '',
        districtId: experience.district?.id || '',
        cityId: experience.city?.id || '',
        images: [],
        video: null,
        imageUrls: experience.imageUrls || [],
        videoUrl: experience.videoUrl || '',
        special: experience.special || false
      });
      if (experience.imageUrls) {
        setPreviewUrls(experience.imageUrls.map(url => ExperienceService.getImageUrl(url)));
      }
      if (experience.latitude && experience.longitude) {
        setMapPosition({
          lat: parseFloat(experience.latitude),
          lng: parseFloat(experience.longitude)
        });
      }
    }
  }, [experience]);

  useEffect(() => {
    if (formData.categoryId) {
      const category = categories.find(c => c.id === formData.categoryId);
      setSelectedCategory(category);
      if (!category?.sub?.includes(formData.subcategory)) {
        setFormData(prev => ({ ...prev, subcategory: '' }));
      }
    } else {
      setSelectedCategory(null);
    }
  }, [formData.categoryId, categories]);

  useEffect(() => {
    if (formData.districtId) {
      fetchCitiesByDistrict(formData.districtId);
    } else {
      setCities([]);
      setFormData(prev => ({ ...prev, cityId: '' }));
    }
  }, [formData.districtId]);

  useEffect(() => {
    const loadCityBoundaries = async () => {
      if (formData.cityId) {
        const selectedCity = cities.find(city => city.id === formData.cityId);
        if (selectedCity) {
          const boundaries = await fetchCityBoundaries(selectedCity.name);
          if (boundaries) {
            setCityBounds(boundaries.bounds);
            setMapCenter(boundaries.center);
            setMapZoom(13);
            
            if (mapRef) {
              mapRef.flyTo(boundaries.center, 13);
            }
          }
        }
      } else {
        setCityBounds(null);
        setMapCenter([7.8731, 80.7718]);
        setMapZoom(8);
      }
    };

    loadCityBoundaries();
  }, [formData.cityId, cities]);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSubmitError('Failed to load categories');
    }
  };

  const fetchDistricts = async () => {
    try {
      const data = await districtService.getAllDistricts();
      setDistricts(data);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setSubmitError('Failed to load districts');
    }
  };

  const fetchCitiesByDistrict = async (districtId) => {
    try {
      const data = await districtService.getCitiesByDistrict(districtId);
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setSubmitError('Failed to load cities');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSubmitError('');
  };

  const handleLocationChange = (latlng) => {
    setMapPosition(latlng);
    setFormData(prev => ({
      ...prev,
      latitude: latlng.lat.toFixed(6),
      longitude: latlng.lng.toFixed(6)
    }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (name === 'images') {
      if (files.length > 5) {
        setImageError('Maximum 5 images allowed');
        return;
      }
      setImageError('');
      const newPreviewUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      setFormData(prev => ({ ...prev, images: files }));
    } else if (name === 'video') {
      try {
        await ExperienceService.validateFile(files[0], 'video');
        setFormData(prev => ({ ...prev, video: files[0] }));
        setVideoError('');
      } catch (error) {
        setVideoError(error.message);
        e.target.value = '';
      }
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleRemoveImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: Array.from(prev.images).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);
    
    try {
      const submitData = new FormData();
      
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('additionalInfo', formData.additionalInfo?.trim() || '');
      submitData.append('price', formData.price.toString());
      submitData.append('discount', (formData.discount || '0').toString());
      submitData.append('special', formData.special ? 'true' : 'false');
      submitData.append('districtId', formData.districtId.toString());
      submitData.append('cityId', formData.cityId.toString());
      submitData.append('address', formData.address.trim());
      submitData.append('latitude', formData.latitude.toString());
      submitData.append('longitude', formData.longitude.toString());

      const selectedCategory = categories.find(c => c.id === formData.categoryId);
      submitData.append('category', selectedCategory.name);
      submitData.append('categoryId', selectedCategory.id.toString());
      submitData.append('subcategory', formData.subcategory);
      
      if (formData.tags?.length > 0) {
        formData.tags.forEach(tag => submitData.append('tags', tag.trim()));
      }

      if (formData.images?.length > 0) {
        Array.from(formData.images).forEach(image => submitData.append('images', image));
      }

      if (experience && formData.imageUrls?.length > 0) {
        formData.imageUrls.forEach(url => submitData.append('existingImages', url));
      }

      if (formData.video) {
        submitData.append('video', formData.video);
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'Error submitting form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          rows={4}
          fullWidth
        />

        <TextField
          label="Additional Information"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Discount %"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={formData.special} onChange={handleChange} name="special" />}
            label="Special"
          />
        </Box>

        <FormControl required fullWidth>
          <InputLabel>Category</InputLabel>
          <Select name="categoryId" value={formData.categoryId} onChange={handleChange}>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            ))}</Select>
            </FormControl>
    
            {selectedCategory?.sub && (
              <FormControl required fullWidth>
                <InputLabel>Subcategory</InputLabel>
                <Select name="subcategory" value={formData.subcategory} onChange={handleChange}>
                  {selectedCategory.sub.map((subcat, index) => (
                    <MenuItem key={index} value={subcat}>{subcat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
    
            <FormControl required fullWidth>
              <InputLabel>District</InputLabel>
              <Select name="districtId" value={formData.districtId} onChange={handleChange}>
                {districts.map(district => (
                  <MenuItem key={district.id} value={district.id}>{district.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
    
            <FormControl required fullWidth disabled={!formData.districtId}>
              <InputLabel>City</InputLabel>
              <Select name="cityId" value={formData.cityId} onChange={handleChange}>
                {cities.map(city => (
                  <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
    
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              multiline
              rows={2}
              fullWidth
            />
    
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
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker
                        position={mapPosition}
                        onLocationChange={handleLocationChange}
                        cityBounds={cityBounds}
                      />
                      {cityBounds && (
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
                    <Typography variant="body2">
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
                  value={formData.latitude} 
                  required 
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField 
                  label="Longitude" 
                  name="longitude" 
                  type="number" 
                  value={formData.longitude} 
                  required 
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </Box>
    
            <Box>
              <Typography variant="subtitle1" gutterBottom>Images (Maximum 5)</Typography>
              <input
                type="file"
                name="images"
                onChange={handleFileChange}
                multiple
                accept="image/*"
              />
              {imageError && <Alert severity="error">{imageError}</Alert>}
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {previewUrls.map((url, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
    
            <Box>
              <Typography variant="subtitle1" gutterBottom>Video</Typography>
              <input
                type="file"
                name="video"
                onChange={handleFileChange}
                accept="video/*"
              />
              {videoError && <Alert severity="error">{videoError}</Alert>}
              {formData.video && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected video: {formData.video.name}
                </Typography>
              )}
            </Box>
    
            <Box>
              <Typography variant="subtitle1" gutterBottom>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                <TextField 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)} 
                  placeholder="Add a tag" 
                  size="small"
                  fullWidth
                />
                <Button variant="outlined" onClick={handleAddTag}>Add Tag</Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.tags?.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    onDelete={() => handleRemoveTag(tag)} 
                    color="primary" 
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
    
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={isLoading}
                sx={{ minWidth: 120 }}
              >
                {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                {experience ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Stack>
        </form>
      );
    };
    
    export default ExperienceForm;