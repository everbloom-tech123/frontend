import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ExperienceList from './components/ExperienceList';
import ExperienceForm from './components/ExperienceForm';
import CategoryManagement from './components/CategoryManagement';
import ExperienceService from './ExperienceService';

const ManageExperience = () => {
  const [activeTab, setActiveTab] = useState('experiences');
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
    // Implementation for viewing experience details
    console.log('Viewing experience:', experience);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExperience(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Experience Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          {activeTab === 'experiences' && !showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          )}
        </div>

        <TabsContent value="experiences">
          {showForm ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingExperience ? 'Edit Experience' : 'Create New Experience'}
              </h2>
              <ExperienceForm
                experience={editingExperience}
                onSubmit={editingExperience ? handleUpdateExperience : handleCreateExperience}
                onCancel={handleCancel}
              />
            </div>
          ) : (
            <ExperienceList
              onEdit={handleEdit}
              onView={handleView}
              refreshList={refreshList}
            />
          )}
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageExperience;