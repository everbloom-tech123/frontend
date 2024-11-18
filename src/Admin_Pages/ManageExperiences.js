// Admin_Pages/ManageExperience.js
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

// Import components
import ExperienceForm from './components/ExperienceForm';
import PricingSection from './components/PricingSection';
import CategorySection from './components/CategorySection';
import TagsSection from './components/TagsSection';
import MediaUpload from './components/MediaUploads';
import CategoryDialog from './components/CategoryDialog';

// Import services
import ExperienceService from './ExperienceService';
import CategoryService from './CategoryService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .05)',
        },
      },
    },
  },
});

const ManageExperience = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  
  const [newImages, setNewImages] = useState([]);
  const [newVideo, setNewVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedCategories = await CategoryService.getAllCategories();
      setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExperience = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const fetchedExperience = await ExperienceService.getExperience(id);
      setFormData(fetchedExperience);
    } catch (err) {
      console.error('Error fetching experience:', err);
      setError('Failed to fetch experience details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategories();
    fetchExperience();
  }, [fetchCategories, fetchExperience]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImages(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const handleVideoChange = (e) => {
    setNewVideo(e.target.files[0]);
  };

  const handleAddTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tag]
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

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

    try {
      if (id) {
        await ExperienceService.updateExperience(id, submitData);
        setSuccess('Experience updated successfully!');
      } else {
        await ExperienceService.createExperience(submitData);
        setSuccess('Experience created successfully!');
        setSnackbarOpen(true);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting experience:', err);
      setError('Failed to submit experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (name) => {
    try {
      const newCategory = await CategoryService.createCategory({ name });
      setCategories(prev => [...prev, newCategory]);
      setCategoryDialogOpen(false);
      setSuccess('Category added successfully!');
    } catch (err) {
      setError('Failed to add category.');
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
      setSuccess('Category updated successfully!');
    } catch (err) {
      setError('Failed to update category.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await CategoryService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setSuccess('Category deleted successfully!');
    } catch (err) {
      setError('Failed to delete category.');
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
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
          Experience added successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ManageExperience;