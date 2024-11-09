import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Container,
  Select,
  MenuItem,
  Chip,
  Box,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  CardMedia,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
  Tooltip,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
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
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedCategories = await CategoryService.getAllCategories();
      console.log('Fetched categories:', fetchedCategories);
      setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories. Please check your connection and try again.');
      setCategories([]);
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
      setError('Failed to fetch experience details. Please check your connection and try again.');
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

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
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

    console.log('Submitting data:', submitData);

    try {
      if (id) {
        await ExperienceService.updateExperience(id, submitData);
        setSuccess('Experience updated successfully!');
      } else {
        const result = await ExperienceService.createExperience(submitData);
        console.log('Create experience result:', result);
        setSuccess('Experience created successfully!');
        setSnackbarOpen(true);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting experience:', err);
      let errorMessage = 'Failed to submit experience. ';
      if (err.response) {
        console.log('Error response:', err.response);
        errorMessage += `Server responded with: ${err.response.status} ${err.response.statusText}. `;
        if (err.response.data) {
          console.log('Error data:', err.response.data);
          errorMessage += `Details: ${JSON.stringify(err.response.data)}`;
        }
      } else if (err.request) {
        console.log('Error request:', err.request);
        errorMessage += 'No response received from server. Check your network connection.';
      } else {
        errorMessage += err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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

  const handleOpenCategoryDialog = () => {
    setCategoryDialogOpen(true);
    setNewCategoryName('');
    setEditingCategoryId(null);
  };

  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setNewCategoryName('');
    setEditingCategoryId(null);
  };

  const handleAddCategory = async () => {
    setLoading(true);
    try {
      const newCategory = await CategoryService.createCategory({ name: newCategoryName });
      setCategories(prev => [...prev, newCategory]);
      handleCloseCategoryDialog();
      setSuccess('Category added successfully!');
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    setLoading(true);
    try {
      const updatedCategory = await CategoryService.updateCategory(editingCategoryId, { name: newCategoryName });
      setCategories(prev => prev.map(cat => cat.id === editingCategoryId ? updatedCategory : cat));
      handleCloseCategoryDialog();
      setSuccess('Category updated successfully!');
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    setLoading(true);
    try {
      await CategoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setSuccess('Category deleted successfully!');
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setNewCategoryName(category.name);
    setEditingCategoryId(category.id);
    setCategoryDialogOpen(true);
  };

  const calculateDiscountedPrice = () => {
    const price = Number(formData.price);
    const discount = Number(formData.discount);
    if (isNaN(price) || isNaN(discount)) return 'N/A';
    const discountedPrice = price - (price * (discount / 100));
    return discountedPrice.toFixed(2);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  console.log('Current categories state:', categories);

  if (loading) {
    return (
      <Container maxWidth="md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Info"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Discount"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Price after discount: ${calculateDiscountedPrice()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Select
                    fullWidth
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    displayEmpty
                    required
                    variant="outlined"
                    sx={{ mr: 2 }}
                  >
                    <MenuItem value="" disabled>Select Category</MenuItem>
                    {Array.isArray(categories) && categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                  <Button 
                    onClick={handleOpenCategoryDialog} 
                    startIcon={<AddIcon />}
                    variant="outlined"
                    color="primary"
                  >
                    Manage Categories
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Tags</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} marginBottom={2}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box display="flex" gap={1}>
                  <TextField
                    label="Add Tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <Button 
                    onClick={handleAddTag} 
                    startIcon={<AddIcon />}
                    variant="contained"
                    color="primary"
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Media</Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="raised-button-file">
                  <Button 
                    variant="contained" 
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ mr: 2 }}
                  >
                    Upload Images
                  </Button>
                </label>
                <input
                  accept="video/*"
                  style={{ display: 'none' }}
                  id="video-file"
                  type="file"
                  onChange={handleVideoChange}
                />
                <label htmlFor="video-file">
                  <Button 
                    variant="contained" 
                    component="span"
                    startIcon={<UploadIcon />}
                  >
                    Upload Video
                  </Button>
                </label>
              </Grid>
              {(formData.imageUrls.length > 0 || newImages.length > 0) && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Images</Typography>
                  <Grid container spacing={2}>
                    {formData.imageUrls.map((url, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="140"
                            image={url}
                            alt={`Product ${index}`}
                          />
                          <Box sx={{ p: 1 }}>
                            <Tooltip title="Delete Image">
                              <IconButton 
                                onClick={() => handleDeleteImage(index)}
                                size="small"
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                    {newImages.map((file, index) => (
                      <Grid item xs={12} sm={6} md={4} key={`new-${index}`}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="140"
                            image={URL.createObjectURL(file)}
                            alt={`New Image ${index}`}
                          />
                          <Box sx={{ p: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                            <Typography variant="caption">New Upload</Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
              {(formData.videoUrl || newVideo) && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Video</Typography>
                  {formData.videoUrl && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Current Video:</Typography>
                      <Box display="flex" alignItems="center">
                        <video width="320" height="240" controls>
                          <source src={formData.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <Tooltip title="Delete Video">
                          <IconButton onClick={handleDeleteVideo} color="error" sx={{ ml: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
                  {newVideo && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>New Video:</Typography>
                      <Box display="flex" alignItems="center">
                        <video width="320" height="240" controls>
                          <source src={URL.createObjectURL(newVideo)} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </Box>
                    </Box>
                  )}
                </Grid>
              )}
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {id ? 'Update Experience' : 'Create Experience'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      
      {/* Category Management Dialog */}
      <Dialog open={categoryDialogOpen} onClose={handleCloseCategoryDialog}>
        <DialogTitle>{editingCategoryId ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            variant="outlined"
          />
          <List sx={{ mt: 2 }}>
            {Array.isArray(categories) && categories.map((category) => (
              <ListItem key={category.id}>
                <ListItemText primary={category.name} />
                <ListItemSecondaryAction>
                  <Tooltip title="Edit Category">
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditCategory(category)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Category">
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={editingCategoryId ? handleUpdateCategory : handleAddCategory} 
            color="primary"
            variant="contained"
            disabled={!newCategoryName.trim() || loading}
          >
            {editingCategoryId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Experience added successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ManageExperience;