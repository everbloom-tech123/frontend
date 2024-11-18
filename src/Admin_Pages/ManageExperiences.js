// src/Admin_Pages/ManageExperiences.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Snackbar
} from '@mui/material';

// Import components (match your exact file names)
import ExperienceForm from './components/ExperienceForm.jsx';
import PricingSection from './components/PricingSection.jsx';
import CategorySection from './components/CategorySection.jsx';
import TagsSection from './components/TagsSection.jsx';
import MediaUpload from './components/MediaUploads.jsx';  // Note: Matches your file name
import CategoryDialog from './components/CategoryDialog.jsx';

// Import services
import ExperienceService from './ExperienceService';
import CategoryService from './CategoryService';

const theme = createTheme({
  palette: {
    primary: { main: '#2196f3' },
    secondary: { main: '#f50057' },
    background: { default: '#f5f5f5' },
  }
});

const ManageExperiences = () => {  // Note: Changed to match your file name
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    additionalInfo: '',
    price: '',
    discount: '',
    category: '',
    tags: [],
    imageUrls: [],
    videoUrl: ''
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Media states
  const [newImages, setNewImages] = useState([]);
  const [newVideo, setNewVideo] = useState(null);

  // Category states
  const [categories, setCategories] = useState([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Fetch data
  const fetchCategories = useCallback(async () => {
    try {
      const response = await CategoryService.getAllCategories();
      if (response && Array.isArray(response)) {
        setCategories(response);
      }
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    }
  }, []);

  const fetchExperience = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await ExperienceService.getExperience(id);
      if (response) {
        setFormData(response);
      }
    } catch (err) {
      setError('Failed to load experience details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategories();
    fetchExperience();
  }, [fetchCategories, fetchExperience]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files?.[0]) {
      setNewVideo(e.target.files[0]);
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleDeleteImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteVideo = () => {
    setFormData(prev => ({ ...prev, videoUrl: '' }));
    setNewVideo(null);
  };

  // Category handlers
  const handleCategoryAction = async (actionType, payload) => {
    try {
      switch (actionType) {
        case 'add':
          const newCategory = await CategoryService.createCategory(payload);
          setCategories(prev => [...prev, newCategory]);
          break;
        case 'update':
          const updated = await CategoryService.updateCategory(editingCategoryId, payload);
          setCategories(prev => prev.map(cat => 
            cat.id === editingCategoryId ? updated : cat
          ));
          setEditingCategoryId(null);
          break;
        case 'delete':
          await CategoryService.deleteCategory(payload);
          setCategories(prev => prev.filter(cat => cat.id !== payload));
          break;
      }
      setCategoryDialogOpen(false);
      setSuccess(`Category ${actionType}d successfully`);
    } catch (err) {
      setError(`Failed to ${actionType} category`);
      console.error(err);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = {
        ...formData,
        price: formData.price.toString(),
        discount: formData.discount.toString(),
        images: newImages,
        video: newVideo
      };

      if (id) {
        await ExperienceService.updateExperience(id, submitData);
        setSuccess('Experience updated successfully');
      } else {
        await ExperienceService.createExperience(submitData);
        setSuccess('Experience created successfully');
      }
      
      setSnackbarOpen(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save experience');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            {id ? 'Edit Experience' : 'Create New Experience'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <ExperienceForm 
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <PricingSection 
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <CategorySection 
              formData={formData}
              categories={categories}
              handleInputChange={handleInputChange}
              onManageCategories={() => setCategoryDialogOpen(true)}
            />

            <TagsSection 
              tags={formData.tags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />

            <MediaUpload 
              onImageUpload={handleImageChange}
              onVideoUpload={handleVideoChange}
              currentImages={formData.imageUrls}
              currentVideo={formData.videoUrl}
              onDeleteImage={handleDeleteImage}
              onDeleteVideo={handleDeleteVideo}
              newImages={newImages}
            />

            <Button 
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {id ? 'Update Experience' : 'Create Experience'}
            </Button>
          </form>
        </Paper>
      </Container>

      <CategoryDialog 
        open={categoryDialogOpen}
        onClose={() => {
          setCategoryDialogOpen(false);
          setEditingCategoryId(null);
        }}
        categories={categories}
        onAdd={(name) => handleCategoryAction('add', { name })}
        onUpdate={(name) => handleCategoryAction('update', { name })}
        onDelete={(categoryId) => handleCategoryAction('delete', categoryId)}
        editingCategory={categories.find(c => c.id === editingCategoryId)}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Experience {id ? 'updated' : 'created'} successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ManageExperiences;  // Note: Changed to match file name