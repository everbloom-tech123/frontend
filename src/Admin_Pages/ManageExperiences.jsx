import React, { useState } from 'react';
import {
  Box, Tab, Tabs, Button, Container, Typography, Paper, Alert, Snackbar
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

  const handleCreateExperience = async (formData) => {
    setIsSubmitting(true);
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
      
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Error creating experience. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateExperience = async (formData) => {
    setIsSubmitting(true);
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
      
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Error updating experience. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (experience) => {
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
                    onClick={() => setShowForm(true)}
                  >
                    Add Experience
                  </Button>
                </Box>
              )}
              
              <TabPanel value={activeTab} index={0}>
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
                  <ExperienceList
                    onEdit={handleEdit}
                    onView={handleView}
                    refreshList={refreshList}
                  />
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