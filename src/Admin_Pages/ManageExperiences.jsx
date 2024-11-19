// src/Admin_Pages/ManageExperience.jsx
import React, { useState } from 'react';
import {
  Box, Tab, Tabs, Button, Container, Typography, Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ExperienceList from './components/ExperienceList.jsx';
import ExperienceForm from './components/ExperienceForm.jsx';
import CategoryManagement from './components/CategoryManagement.jsx';
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

  const handleCreateExperience = async (formData) => {
    try {
      await ExperienceService.createExperience(formData);
      setShowForm(false);
      setRefreshList(prev => !prev);
    } catch (error) {
      console.error('Error creating experience:', error);
    }
  };

  const handleUpdateExperience = async (formData) => {
    try {
      await ExperienceService.updateExperience(editingExperience.id, formData);
      setShowForm(false);
      setEditingExperience(null);
      setRefreshList(prev => !prev);
    } catch (error) {
      console.error('Error updating experience:', error);
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
      </Box>
    </Container>
  );
};

export default ManageExperience;