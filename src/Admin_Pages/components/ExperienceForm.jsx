import React, { useState, useEffect } from 'react';
import { Stack, Alert } from '@mui/material';
import BasicInformation from './experienceForm_cmp/Basicinfo';
import PricingSection from './experienceForm_cmp/PricingSection';
import CategorySelection from './experienceForm_cmp/categoryselection';
import LocationSelection from './experienceForm_cmp/Locationselection';
import LocationPicker from './experienceForm_cmp/LocationPicker';
import MediaUpload from './experienceForm_cmp/MediaUpload';
import TagsInput from './experienceForm_cmp/Tagsinput';
import FormActions from './experienceForm_cmp/FormActions';
import { fetchDistrictBoundaries } from './utils/LocationUtilities';
import CategoryService from '../CategoryService';
import ExperienceService from '../ExperienceService';
import districtService from '../../services/districtService';

const ExperienceForm = ({ experience, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    additionalInfo: '',
    price: '',
    discount: '0',
    subCategoryIds: [],
    tags: [],
    images: [],
    imageUrls: [],
    imagesToRemove: [],
    video: null,
    videoUrl: '',
    removeVideo: false,
    special: false,
    mostPopular: false,
    cityId: '',
    districtId: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  const [originalImageCount, setOriginalImageCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [imageError, setImageError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [boundaryWarning, setBoundaryWarning] = useState('');

  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState(null);
  const [districtBounds, setDistrictBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Sri Lanka center
  const [mapZoom, setMapZoom] = useState(8);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    const initializeForm = async () => {
      await Promise.all([
        fetchCategories(),
        fetchDistricts()
      ]);

      if (experience) {
        const subCategoryIds = experience.sub_category
          ? experience.sub_category.map(sub => sub.id)
          : [];

        setFormData({
          ...experience,
          subCategoryIds: subCategoryIds,
          images: [],
          video: null,
          imageUrls: experience.imageUrls || [],
          videoUrl: experience.videoUrl || '',
          special: experience.special || false,
          mostPopular: experience.most_popular || false,
          imagesToRemove: [],
          removeVideo: false,
          cityId: experience.city?.id || '',
          districtId: experience.city?.district?.id || ''
        });

        setOriginalImageCount(experience.imageUrls?.length || 0);

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

  useEffect(() => {
    if (formData.districtId) {
      fetchCitiesByDistrict(formData.districtId);
      updateMapForDistrict(formData.districtId);
    } else {
      setCities([]);
      setFormData(prev => ({ ...prev, cityId: '' }));
      setDistrictBounds(null);
      setMapCenter([7.8731, 80.7718]);
      setMapZoom(8);
      setBoundaryWarning('');
    }
  }, [formData.districtId]);

  const updateMapForDistrict = async (districtId) => {
    const selectedDistrict = districts.find(district => district.id === districtId);
    if (selectedDistrict) {
      try {
        const boundaries = await fetchDistrictBoundaries(selectedDistrict.name);
        console.log(`Boundaries for ${selectedDistrict.name} district:`, boundaries);
        if (boundaries) {
          setDistrictBounds(boundaries.bounds);
          setMapCenter(boundaries.center);
          setMapZoom(10);
          if (mapRef) {
            mapRef.flyTo(boundaries.center, 10);
          }
          // Check if using Sri Lanka-wide fallback
          const isDefaultBounds = boundaries.bounds.every(([lat, lng]) =>
            lat === 5.9 || lat === 9.9 || lng === 79.6 || lng === 81.9
          );
          if (isDefaultBounds) {
            setBoundaryWarning(`Exact boundaries for ${selectedDistrict.name} district not found. Using Sri Lanka-wide area.`);
          } else {
            setBoundaryWarning('');
          }
        } else {
          setBoundaryWarning(`Failed to load boundaries for ${selectedDistrict.name} district.`);
          setDistrictBounds(null);
          setMapCenter([7.8731, 80.7718]);
          setMapZoom(8);
        }
      } catch (error) {
        console.error(`Error fetching boundaries for ${selectedDistrict.name}:`, error);
        setBoundaryWarning(`Error loading boundaries for ${selectedDistrict.name} district.`);
        setDistrictBounds(null);
        setMapCenter([7.8731, 80.7718]);
        setMapZoom(8);
      }
    }
  };

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

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      const imageUrl = formData.imageUrls[index];
      setFormData(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((_, i) => i !== index),
        imagesToRemove: [...prev.imagesToRemove, imageUrl]
      }));
    } else {
      const adjustedIndex = index - (formData.imageUrls?.length || 0);
      setFormData(prev => ({
        ...prev,
        images: Array.from(prev.images).filter((_, i) => i !== adjustedIndex)
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

      const subcategoryIds = formData.subCategoryIds || [];
      subcategoryIds.forEach(id => submitData.append('subCategoryIds', id.toString()));

      submitData.append('cityId', formData.cityId.toString());
      submitData.append('address', formData.address.trim());

      if (formData.latitude && formData.longitude) {
        submitData.append('latitude', formData.latitude.toString());
        submitData.append('longitude', formData.longitude.toString());
      }

      if (formData.tags?.length > 0) {
        formData.tags.forEach(tag => submitData.append('tags', tag.trim()));
      }

      if (formData.images?.length > 0) {
        formData.images.forEach(image => submitData.append('images', image));
      }

      if (experience && formData.imagesToRemove?.length > 0) {
        formData.imagesToRemove.forEach(url => submitData.append('removeImages', url));
      }

      if (formData.video) {
        submitData.append('video', formData.video);
      }
      if (experience && formData.removeVideo) {
        submitData.append('removeVideo', 'true');
      }

      submitData.append('special', formData.special ? 'true' : 'false');
      submitData.append('most_popular', formData.mostPopular ? 'true' : 'false');

      if (experience) {
        submitData.append('currentImageCount', originalImageCount.toString());
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
        {boundaryWarning && <Alert severity="warning">{boundaryWarning}</Alert>}

        <BasicInformation formData={formData} handleChange={handleChange} />
        <PricingSection formData={formData} handleChange={handleChange} />
        <CategorySelection
          categories={categories}
          formData={formData}
          handleChange={handleChange}
          isEditing={!!experience}
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
          districtBounds={districtBounds}
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