import React, { useState, useEffect } from 'react';
import {
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Box, Chip, Stack, Typography, Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import CategoryService from '../CategoryService.js';

const ExperienceForm = ({ experience, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    additionalInfo: '',
    price: '',
    discount: '',
    categoryId: '',
    category: { name: '' },
    tags: [],
    images: [],
    video: null,
    imageUrls: [],
    videoUrl: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (experience) {
      setFormData({
        ...experience,
        categoryId: experience.category?.id || '',
        images: [],  // Reset files as we can't repopulate them
        video: null, // Reset video as we can't repopulate it
      });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData object
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('additionalInfo', formData.additionalInfo || '');
    submitData.append('price', formData.price);
    submitData.append('discount', formData.discount || '');
    submitData.append('categoryName', categories.find(c => c.id === formData.categoryId)?.name || '');
    
    // Append tags
    formData.tags.forEach(tag => {
      submitData.append('tags', tag);
    });

    // Append images
    formData.images.forEach(image => {
      submitData.append('images', image);
    });

    // Append video if exists
    if (formData.video) {
      submitData.append('video', formData.video);
    }

    onSubmit(submitData);
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

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
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
          {imageError && <Alert severity="error" sx={{ mt: 1 }}>{imageError}</Alert>}
          {formData.images.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                Selected images: {formData.images.length}
              </Typography>
              {formData.images.map((image, index) => (
                <Typography key={index} variant="caption" display="block">
                  {image.name}
                </Typography>
              ))}
            </Box>
          )}
          {experience && formData.imageUrls && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                Existing images: {formData.imageUrls.length}
              </Typography>
            </Box>
          )}
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
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                Selected video: {formData.video.name}
              </Typography>
            </Box>
          )}
          {experience && formData.videoUrl && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                Existing video: {formData.videoUrl}
              </Typography>
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