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
  Snackbar,
} from '@mui/material';

// Import components
import ExperienceForm from './components/experience/ExperienceForm';
import PricingSection from './components/experience/PricingSection';
import CategorySection from './components/experience/CategorySection';
import TagsSection from './components/experience/TagsSection';
import MediaUpload from './components/experience/MediaUpload';
import CategoryDialog from './components/experience/CategoryDialog';

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

const ManageExperience = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Main form state
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

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Media state
  const [newImages, setNewImages] = useState([]);
  const [newVideo, setNewVideo] = useState(null);

  // Category state
  const [categories, setCategories] = useState([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Fetch initial data
  const fetchCategories = useCallback(async () => {
    try {
      console.log('Fetching categories...');
      const response = await CategoryService.getAllCategories();
      console.log('Categories response:', response);
      setCategories(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  }, []);

  const fetchExperience = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await ExperienceService.getExperience(id);
      console.log('Experience data:', response);
      setFormData(response);
    } catch (err) {
      console.error('Error fetching experience:', err);
      setError('Failed to load experience details');
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
    console.log('Input change:', name, value);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('New images:', files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    console.log('New video:', file);
    setNewVideo(file);
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
  };

  // Category handlers
  const handleAddCategory = async (name) => {
    try {
      const newCategory = await CategoryService.createCategory({ name });
      setCategories(prev => [...prev, newCategory]);
      setCategoryDialogOpen(false);
      setSuccess('Category added successfully');
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
    }
  };

  const handleUpdateCategory = async (name) => {
    if (!editingCategoryId) return;
    try {
      const updatedCategory = await CategoryService.updateCategory(editingCategoryId, { name });
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategoryId ? updatedCategory : cat
      ));
      setCategoryDialogOpen(false);
      setEditingCategoryId(null);
      setSuccess('Category updated successfully');
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await CategoryService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setSuccess('Category deleted successfully');
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
    }
  };

  // Main form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        additionalInfo: formData.additionalInfo,
        price: formData.price.toString(),
        discount: formData.discount.toString(),
        category: formData.category,
        tags: formData.tags,
        images: newImages,
        video: newVideo
      };

      console.log('Submitting data:', submitData);

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
      console.error('Submit error:', err);
      setError('Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
        onAdd={handleAddCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
        editingCategory={editingCategoryId ? 
          categories.find(c => c.id === editingCategoryId) : null
        }
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Experience {id ? 'updated' : 'created'} successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ManageExperience;