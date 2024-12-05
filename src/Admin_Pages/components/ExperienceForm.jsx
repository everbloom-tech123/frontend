import React, { useState, useEffect } from 'react';
import {
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Box, Chip, Stack, Typography, Alert, IconButton, CircularProgress,
  FormControlLabel, Switch
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import CategoryService from '../CategoryService';
import ExperienceService from '../ExperienceService';

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
    cityId: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [imageError, setImageError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (experience) {
      setFormData({
        ...experience,
        categoryId: experience.category?.id || '',
        subcategory: experience.subcategory || '',
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

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSubmitError('Failed to load categories');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);
    
    const handleRemoveTag = (tagToRemove) => {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    };
    
    try {
      const submitData = new FormData();
      
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('additionalInfo', formData.additionalInfo?.trim() || '');
      submitData.append('price', formData.price.toString());
      submitData.append('discount', (formData.discount || '0').toString());
      submitData.append('special', formData.special ? 'true' : 'false');
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

        <TextField label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} required multiline rows={4} />
        <TextField label="Additional Information" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} multiline rows={3} />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required />
          <TextField label="Discount %" name="discount" type="number" value={formData.discount} onChange={handleChange} />
          <FormControlLabel control={<Switch checked={formData.special} onChange={handleChange} name="special" />} label="Special" />
        </Box>

        <FormControl required>
          <InputLabel>Category</InputLabel>
          <Select name="categoryId" value={formData.categoryId} onChange={handleChange}>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedCategory?.sub && (
          <FormControl required>
            <InputLabel>Subcategory</InputLabel>
            <Select name="subcategory" value={formData.subcategory} onChange={handleChange}>
              {selectedCategory.sub.map((subcat, index) => (
                <MenuItem key={index} value={subcat}>{subcat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl required>
          <InputLabel>City</InputLabel>
          <Select name="cityId" value={formData.cityId} onChange={handleChange}>
            {cities.map(city => (
              <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required multiline rows={2} />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField 
            label="Latitude" 
            name="latitude" 
            type="number" 
            value={formData.latitude} 
            onChange={handleChange} 
            required 
            inputProps={{ min: 5.0, max: 10.0, step: "0.000001" }}
          />
          <TextField 
            label="Longitude" 
            name="longitude" 
            type="number" 
            value={formData.longitude} 
            onChange={handleChange} 
            required 
            inputProps={{ min: 79.0, max: 82.0, step: "0.000001" }}
          />
        </Box>

        <Box>
          <input type="file" name="images" onChange={handleFileChange} multiple accept="image/*" />
          {imageError && <Alert severity="error">{imageError}</Alert>}
        </Box>

        <Box>
          <input type="file" name="video" onChange={handleFileChange} accept="video/*" />
          {videoError && <Alert severity="error">{videoError}</Alert>}
        </Box>

        <Box>
          <TextField value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add a tag" />
          <Button onClick={handleAddTag}>Add Tag</Button>
          {formData.tags?.map((tag, index) => (
            <Chip key={index} label={tag} onDelete={() => handleRemoveTag(tag)} />
          ))}
        </Box>

        <Box>
          <Button variant="outlined" onClick={onCancel} disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} /> : null}
            {experience ? 'Update Experience' : 'Create Experience'}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default ExperienceForm;