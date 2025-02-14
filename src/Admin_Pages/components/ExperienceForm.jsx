import React, { useState, useEffect } from 'react';
import { Stack, Alert } from '@mui/material';

// Import all component pieces - keeping original structure
import BasicInformation from './experienceForm_cmp/Basicinfo';
import PricingSection from './experienceForm_cmp/PricingSection';
import CategorySelection from './experienceForm_cmp/categoryselection';
import LocationSelection from './experienceForm_cmp/Locationselection';
import LocationPicker from './experienceForm_cmp/LocationPicker';
import MediaUpload from './experienceForm_cmp/MediaUpload';
import TagsInput from './experienceForm_cmp/Tagsinput';
import FormActions from './experienceForm_cmp/FormActions';

// Import utilities and services
import { fetchCityBoundaries } from './utils/LocationUtilities';
import CategoryService from '../CategoryService';
import ExperienceService from '../ExperienceService';
import districtService from '../../services/districtService';

const ExperienceForm = ({ experience, onSubmit, onCancel }) => {
  // Initialize form state with all necessary fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    additionalInfo: '',
    price: '',
    discount: '0',
    subCategoryIds: [], // Array to store selected subcategory IDs
    tags: [],
    images: [],
    imagesToRemove: [],
    video: null,
    imageUrls: [],
    videoUrl: '',
    removeVideo: false,
    special: false,
    mostPopular: false,
    cityId: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  // UI state management
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [imageError, setImageError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Map-related state
  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState(null);
  const [cityBounds, setCityBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]);
  const [mapZoom, setMapZoom] = useState(8);
  const [mapRef, setMapRef] = useState(null);

  // Initialize data and populate form when editing
  useEffect(() => {
    const initializeForm = async () => {
      await Promise.all([
        fetchCategories(),
        fetchDistricts()
      ]);

      if (experience) {
        setFormData({
          ...experience,
          subCategoryIds: experience.subCategoryIds || [],
          images: [],
          video: null,
          imageUrls: experience.imageUrls || [],
          videoUrl: experience.videoUrl || '',
          special: experience.special || false,
          mostPopular: experience.mostPopular || false,
          imagesToRemove: [],
          removeVideo: false
        });

        if (experience.imageUrls) {
          setPreviewUrls(experience.imageUrls.map(url => 
            ExperienceService.getImageUrl(url)
          ));
        }

        if (experience.latitude && experience.longitude) {
          setMapPosition({
            lat: parseFloat(experience.latitude),
            lng: parseFloat(experience.longitude)
          });
        }
      }
    };

    initializeForm();
  }, [experience]);

  // Fetch cities when district changes
  useEffect(() => {
    if (formData.districtId) {
      fetchCitiesByDistrict(formData.districtId);
    } else {
      setCities([]);
      setFormData(prev => ({ ...prev, cityId: '' }));
    }
  }, [formData.districtId]);

  // Update map when city changes
  useEffect(() => {
    const updateMapForCity = async () => {
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

    updateMapForCity();
  }, [formData.cityId, cities]);

  // Data fetching functions
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

  // Event handlers
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
      const totalImages = previewUrls.length + files.length;
      if (totalImages > 5) {
        setImageError('Maximum 5 images allowed');
        return;
      }

      setImageError('');
      const newPreviewUrls = Array.from(files).map(file => 
        URL.createObjectURL(file)
      );
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      setFormData(prev => ({ 
        ...prev, 
        images: [...Array.from(prev.images), ...Array.from(files)]
      }));
    } else if (name === 'video') {
      try {
        await ExperienceService.validateFile(files[0], 'video');
        setFormData(prev => ({ 
          ...prev, 
          video: files[0],
          removeVideo: false
        }));
        setVideoError('');
      } catch (error) {
        setVideoError(error.message);
        e.target.value = '';
      }
    }
  };

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      const imageUrl = formData.imageUrls[index];
      setFormData(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((_, i) => i !== index),
        imagesToRemove: [...prev.imagesToRemove, imageUrl]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: Array.from(prev.images).filter((_, i) => i !== index)
      }));
    }
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = () => {
    setFormData(prev => ({
      ...prev,
      video: null,
      videoUrl: '',
      removeVideo: true
    }));
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

  // Form submission handler with proper FormData construction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Add basic form fields
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('additionalInfo', formData.additionalInfo?.trim() || '');
      submitData.append('price', formData.price.toString());
      submitData.append('discount', (formData.discount || '0').toString());
      
      // Properly append subcategory IDs
      if (!formData.subCategoryIds || formData.subCategoryIds.length === 0) {
        throw new Error('At least one subcategory is required');
      }
      formData.subCategoryIds.forEach(id => {
        submitData.append('subCategoryIds', id.toString());
      });
      
      // Add location data
      if (!formData.cityId) {
        throw new Error('City selection is required');
      }
      submitData.append('cityId', formData.cityId.toString());
      submitData.append('address', formData.address.trim());
      
      // Add coordinates if they exist
      if (formData.latitude && formData.longitude) {
        submitData.append('latitude', formData.latitude.toString());
        submitData.append('longitude', formData.longitude.toString());
      }
      
      // Add tags
      if (formData.tags?.length > 0) {
        formData.tags.forEach(tag => {
          submitData.append('tags', tag.trim());
        });
      }

      // Handle media files
      if (!formData.images.length && (!formData.imageUrls || formData.imageUrls.length === 0)) {
        throw new Error('At least one image is required');
      }

      if (formData.images?.length > 0) {
        formData.images.forEach(image => {
          submitData.append('images', image);
        });
      }

      // If editing, handle image removal
      if (experience && formData.imagesToRemove?.length > 0) {
        formData.imagesToRemove.forEach(url => {
          submitData.append('removeImages', url);
        });
      }

      // Handle video
      if (formData.video) {
        submitData.append('video', formData.video);
      }

      // If editing and video should be removed
      if (experience && formData.removeVideo) {
        submitData.append('removeVideo', 'true');
      }

      // Add boolean flags
      submitData.append('special', formData.special ? 'true' : 'false');
      submitData.append('mostPopular', formData.mostPopular ? 'true' : 'false');

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

        <BasicInformation 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        <PricingSection 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        <CategorySelection 
          categories={categories}
          formData={formData}
          handleChange={handleChange}
        />
        
        <LocationSelection 
          districts={districts}
          cities={cities}
          formData={formData}
          handleChange={handleChange}
        />
        
        <LocationPicker 
          showMap={showMap}
          setShowMap={setShowMap}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          setMapRef={setMapRef}
          mapPosition={mapPosition}
          handleLocationChange={handleLocationChange}
          cityBounds={cityBounds}
          formData={formData}
        />
        
        <MediaUpload 
          handleFileChange={handleFileChange}
          handleRemoveImage={handleRemoveImage}
          handleRemoveVideo={handleRemoveVideo}
          imageError={imageError}
          videoError={videoError}
          previewUrls={previewUrls}
          formData={formData}
          isEditing={!!experience}
        />
        
        <TagsInput 
          newTag={newTag}
          setNewTag={setNewTag}
          handleAddTag={handleAddTag}
          handleRemoveTag={handleRemoveTag}
          formData={formData}
        />
        
        <FormActions 
          onCancel={onCancel}
          isLoading={isLoading}
          experience={experience}
        />
      </Stack>
    </form>
  );
};

export default ExperienceForm;