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
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const validateFormData = (formData) => {
    const requiredFields = ['title', 'description', 'price', 'category'];
    const missing = requiredFields.filter(field => !formData.get(field));
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    const price = parseFloat(formData.get('price'));
    const discount = parseFloat(formData.get('discount') || '0');

    if (isNaN(price) || price < 0) {
      throw new Error('Invalid price value');
    }

    if (isNaN(discount) || discount < 0 || discount > 100) {
      throw new Error('Discount must be between 0 and 100');
    }

    const images = formData.getAll('images');
    if (images.length === 0 && !formData.get('existingImages')) {
      throw new Error('At least one image is required');
    }
  };

  const handleCreateExperience = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Log FormData contents
      console.log('Creating experience with data:');
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], ':', pair[1].name, '(File)');
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }

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

  const handleUpdateExperience = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Log FormData contents
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

  const handleEdit = (experience) => {
    setError(null);
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleView = (experience) => {
    // Implement view functionality
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