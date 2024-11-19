import React, { useState, useEffect } from 'react';
import {
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box, 
  Chip, 
  Stack, 
  Typography, 
  Alert,
  IconButton,
  CircularProgress
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
    tags: [],
    images: [],
    video: null,
    imageUrls: [],
    videoUrl: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [imageError, setImageError] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (experience) {
      setFormData({
        ...experience,
        categoryId: experience.category?.id || '',
        images: [],
        video: null,
        imageUrls: experience.imageUrls || [],
        videoUrl: experience.videoUrl || ''
      });
      
      if (experience.imageUrls) {
        setPreviewUrls(experience.imageUrls.map(url => 
          ExperienceService.getImageUrl(url)
        ));
      }
    }
  }, [experience]);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSubmitError('Failed to load categories. Please refresh the page.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous errors
    setSubmitError('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'images') {
      if (files.length > 5) {
        setImageError('Maximum 5 images allowed');
        return;
      }
      setImageError('');
      
      const newPreviewUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      setFormData(prev => ({
        ...prev,
        images: files
      }));
    } else if (name === 'video') {
      setFormData(prev => ({
        ...prev,
        video: files[0]
      }));
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

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
      images: Array.from(prev.images).filter((_, i) => i !== index),
      imageUrls: prev.imageUrls?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Validate required fields
      if (!formData.title.trim()) throw new Error('Title is required');
      if (!formData.description.trim()) throw new Error('Description is required');
      if (!formData.price) throw new Error('Price is required');
      if (!formData.categoryId) throw new Error('Category is required');

      // Basic fields
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('additionalInfo', formData.additionalInfo?.trim() || '');
      submitData.append('price', formData.price.toString());
      submitData.append('discount', (formData.discount || '0').toString());
      
      // Find the selected category name
      const selectedCategory = categories.find(c => c.id === formData.categoryId);
      submitData.append('category', selectedCategory?.name || ''); // Changed from categoryId to category
      
      // Tags
      if (formData.tags?.length > 0) {
        formData.tags.forEach(tag => {
          submitData.append('tags', tag.trim());
        });
      }

      // Images
      if (formData.images?.length > 0) {
        Array.from(formData.images).forEach(image => {
          submitData.append('images', image);
        });
      }

      // Existing images for updates
      if (experience && formData.imageUrls?.length > 0) {
        formData.imageUrls.forEach(url => {
          submitData.append('existingImages', url);
        });
      }

      // Video
      if (formData.video) {
        submitData.append('video', formData.video);
      }

      // Log FormData contents for debugging
      console.log('Submitting form data:');
      for (let pair of submitData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], ':', pair[1].name, '(File)');
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'Error submitting form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {submitError && (
          <Alert severity="error" onClose={() => setSubmitError('')}>
            {submitError}
          </Alert>
        )}

        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          fullWidth
          error={submitError.includes('Title')}
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
          error={submitError.includes('Description')}
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
            error={submitError.includes('Price')}
            InputProps={{
              inputProps: { min: 0, step: "0.01" }
            }}
          />

          <TextField
            label="Discount"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            fullWidth
            InputProps={{
              inputProps: { min: 0, max: 100, step: "0.1" }
            }}
          />
        </Box>

        <FormControl fullWidth required error={submitError.includes('Category')}>
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            label="Category"
          >
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              size="small"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(e);
                }
              }}
            />
            <Button variant="contained" onClick={handleAddTag}>
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Images (Maximum 5)
          </Typography>
          <Button variant="contained" component="label">
            Upload Images
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              hidden
            />
          </Button>
          {imageError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {imageError}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {previewUrls.map((url, index) => (
              <Box key={index} sx={{ position: 'relative' }}>
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  style={{ 
                    width: 100, 
                    height: 100, 
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100';
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'white' }
                  }}
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Video
          </Typography>
          <Button variant="contained" component="label">
            Upload Video
            <input
              type="file"
              name="video"
              onChange={handleFileChange}
              accept="video/*"
              hidden
            />
          </Button>
          {formData.video && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected video: {formData.video.name}
            </Typography>
          )}
          {formData.videoUrl && (
            <Box sx={{ mt: 1 }}>
              <video
                controls
                style={{ maxWidth: '100%', maxHeight: '200px' }}
                src={ExperienceService.getImageUrl(formData.videoUrl)}
              />
            </Box>
          )}
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
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {experience ? 'Update Experience' : 'Create Experience'}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default ExperienceForm;