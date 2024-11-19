import React, { useState, useEffect } from 'react';
import {
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Box, Chip, Stack, Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import CategoryService from '../CategoryService.js';

const ExperienceForm = ({ experience, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    tags: [],
    images: [],
    video: null
  });
  
  const [categories, setCategories] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchCategories();
    if (experience) {
      setFormData({
        title: experience.title || '',
        description: experience.description || '',
        price: experience.price || '',
        categoryId: experience.category?.id || '',
        tags: experience.tags || [],
        images: experience.images || [],
        video: experience.video || null
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
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...Array.from(files)]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
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
    onSubmit(formData);
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
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          fullWidth
        />

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
            Images
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
          {formData.images && formData.images.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                {formData.images.length} image(s) selected
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
                Video selected: {formData.video.name}
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