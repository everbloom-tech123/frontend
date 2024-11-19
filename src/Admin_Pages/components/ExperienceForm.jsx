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
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import CategoryService from '../CategoryService';
import ExperienceService from '../services/ExperienceService';

const ExperienceForm = ({ experience, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    additionalInfo: '',
    price: '',
    discount: '',
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

  useEffect(() => {
    fetchCategories();
    if (experience) {
      setFormData({
        ...experience,
        categoryId: experience.category?.id || '',
        images: [],
        video: null
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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        images: Array.from(files)
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
    
    try {
      const submitData = new FormData();
      
      // Basic fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('additionalInfo', formData.additionalInfo || '');
      submitData.append('price', formData.price);
      submitData.append('discount', formData.discount || '0');
      
      // Category
      const selectedCategory = categories.find(c => c.id === formData.categoryId);
      submitData.append('category', selectedCategory?.name || '');
      
      // Tags
      formData.tags?.forEach(tag => {
        submitData.append('tags', tag);
      });

      // Images
      if (formData.images?.length > 0) {
        Array.from(formData.images).forEach(image => {
          submitData.append('images', image);
        });
      }

      // Existing images for updates
      if (experience && formData.imageUrls?.length > 0) {
        formData.imageUrls.forEach(url => {
          const filename = url.split('/').pop();
          submitData.append('existingImages', filename);
        });
      }

      // Video
      if (formData.video) {
        submitData.append('video', formData.video);
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      setImageError('Error submitting form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
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
            label="Discount"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        <FormControl fullWidth required>
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
                deleteIcon={<CloseIcon />}
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
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {experience ? 'Update Experience' : 'Create Experience'}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default ExperienceForm;