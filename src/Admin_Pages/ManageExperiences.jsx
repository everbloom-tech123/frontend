import React, { useState } from 'react';
import {
  Box, 
  Tab, 
  Tabs, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Alert, 
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ExperienceList from './components/ExperienceList';
import ExperienceForm from './components/ExperienceForm';
import CategoryManagement from './components/CategoryManagment';
import ExperienceService from './ExperienceService';

// TabPanel component for handling tab content visibility
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    )}
  </div>
);

const ManageExperience = () => {
  // State management for UI components and data
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Comprehensive form validation function aligned with backend requirements
  const validateFormData = (formData) => {
    // Define all required fields based on backend model
    const requiredFields = [
      'title',
      'description',
      'additionalInfo',
      'price',
      'discount',
      'subCategoryIds',
      'cityId',
      'address'
    ];

    // Check for missing required fields
    const missing = [];
    for (const field of requiredFields) {
      const value = formData.get(field);
      if (field === 'subCategoryIds') {
        // Special handling for subcategories array
        const subcategoryIds = formData.getAll('subCategoryIds');
        if (!subcategoryIds || subcategoryIds.length === 0) {
          missing.push('subcategories');
        }
      } else if (!value || (typeof value === 'string' && value.trim() === '')) {
        missing.push(field);
      }
    }
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate price and discount
    const price = parseFloat(formData.get('price'));
    const discount = parseFloat(formData.get('discount') || '0');

    if (isNaN(price) || price < 0) {
      throw new Error('Price must be greater than or equal to 0');
    }

    if (isNaN(discount) || discount < 0 || discount > 100) {
      throw new Error('Discount must be between 0 and 100');
    }

    // Validate images
    const images = formData.getAll('images');
    const existingImageUrls = formData.getAll('imageUrls');
    const imagesToRemove = formData.getAll('removeImages');
    
    const totalImages = images.length + 
      (existingImageUrls?.length || 0) - 
      (imagesToRemove?.length || 0);

    if (totalImages === 0) {
      throw new Error('At least one image is required');
    }

    if (totalImages > 5) {
      throw new Error('Maximum 5 images allowed');
    }

    // Validate location data
    const cityId = formData.get('cityId');
    const address = formData.get('address');
    if (!cityId || !address?.trim()) {
      throw new Error('City and address are required');
    }

    // Validate coordinates if provided
    const latitude = formData.get('latitude');
    const longitude = formData.get('longitude');
    if ((latitude && !longitude) || (!latitude && longitude)) {
      throw new Error('Both latitude and longitude must be provided if one is specified');
    }
    
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (lat < 5.0 || lat > 10.0 || lng < 79.0 || lng > 82.0) {
        throw new Error('Coordinates must be within Sri Lanka\'s boundaries');
      }
    }
  };

  // Handle creation of new experience
  const handleCreateExperience = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Log FormData for debugging
      console.log('Creating experience with data:');
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], ':', pair[1].name, '(File)');
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }

      // Validate form data before submission
      validateFormData(formData);

      const response = await ExperienceService.createExperience(formData);
      console.log('Creation response:', response);
      
      setNotification({
        open: true,
        message: 'Experience created successfully!',
        type: 'success'
      });
      setShowForm(false);
      setRefreshList(prev => !prev);
    } catch (error) {
      console.error('Error creating experience:', error);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error creating experience. Please try again.';
      setError(errorMessage);
      setNotification({
        open: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle updating existing experience
  const handleUpdateExperience = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Log FormData for debugging
      console.log('Updating experience with data:');
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], ':', pair[1].name, '(File)');
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }

      validateFormData(formData);

      const response = await ExperienceService.updateExperience(editingExperience.id, formData);
      console.log('Update response:', response);
      
      setNotification({
        open: true,
        message: 'Experience updated successfully!',
        type: 'success'
      });
      setShowForm(false);
      setEditingExperience(null);
      setRefreshList(prev => !prev);
    } catch (error) {
      console.error('Error updating experience:', error);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error updating experience. Please try again.';
      setError(errorMessage);
      setNotification({
        open: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI event handlers
  const handleEdit = (experience) => {
    setError(null);
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleView = (experience) => {
    console.log('Viewing experience:', experience);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExperience(null);
    setError(null);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Component render
  return (
    <Container maxWidth="xl">
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Experience Management
        </Typography>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Experiences" />
              <Tab label="Categories" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box sx={{ position: 'relative' }}>
              {!showForm && (
                <Box sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setError(null);
                      setShowForm(true);
                    }}
                  >
                    Add Experience
                  </Button>
                </Box>
              )}
              
              <TabPanel value={activeTab} index={0}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}
                
                {showForm ? (
                  <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
                    <Typography variant="h6" gutterBottom>
                      {editingExperience ? 'Edit Experience' : 'Create New Experience'}
                    </Typography>
                    <ExperienceForm
                      experience={editingExperience}
                      onSubmit={editingExperience ? handleUpdateExperience : handleCreateExperience}
                      onCancel={handleCancel}
                      isSubmitting={isSubmitting}
                    />
                  </Box>
                ) : (
                  <Box sx={{ position: 'relative' }}>
                    {isSubmitting && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 1
                      }}>
                        <CircularProgress />
                      </Box>
                    )}
                    <ExperienceList
                      onEdit={handleEdit}
                      onView={handleView}
                      refreshList={refreshList}
                    />
                  </Box>
                )}
              </TabPanel>
            </Box>
          )}

          <TabPanel value={activeTab} index={1}>
            <CategoryManagement />
          </TabPanel>
        </Paper>

        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.type} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ManageExperience;