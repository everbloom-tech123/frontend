import React, { useState } from 'react';
import ExperienceList from './components/ExperienceList';
import ExperienceForm from './components/ExperienceForm';
import CategoryManagement from './components/CategoryManagment';
import HomepageCategoryAdmin from './managehomecat';
import UserManagement from './components/UserManagment';
import BookingManagement from './components/Admin_booking';
import ExperienceService from './ExperienceService';

const AdminDashboard = () => {
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeCategoryTab, setActiveCategoryTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const handleCreateExperience = async (formData) => {
    setIsSubmitting(true);
    try {
      await ExperienceService.createExperience(formData);
      showNotification('Experience created successfully!', 'success');
      setShowForm(false);
      setRefreshList(prev => !prev);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateExperience = async (formData) => {
    setIsSubmitting(true);
    try {
      await ExperienceService.updateExperience(editingExperience.id, formData);
      showNotification('Experience updated successfully!', 'success');
      setShowForm(false);
      setEditingExperience(null);
      setRefreshList(prev => !prev);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        <div className="border-b">
          <div className="flex">
            {['Experiences', 'Categories', 'Users', 'Bookings'].map((tab, index) => (
              <button
                key={tab}
                className={`px-6 py-3 font-medium text-sm ${
                  activeMainTab === index
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveMainTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeMainTab === 0 && (
            <div>
              {!showForm && (
                <button
                  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setShowForm(true)}
                >
                  Add Experience
                </button>
              )}
              
              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              {showForm ? (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-xl font-bold mb-4">
                    {editingExperience ? 'Edit Experience' : 'Create New Experience'}
                  </h2>
                  <ExperienceForm
                    experience={editingExperience}
                    onSubmit={editingExperience ? handleUpdateExperience : handleCreateExperience}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingExperience(null);
                    }}
                    isSubmitting={isSubmitting}
                  />
                </div>
              ) : (
                <ExperienceList
                  onEdit={(experience) => {
                    setEditingExperience(experience);
                    setShowForm(true);
                  }}
                  onView={(experience) => console.log('Viewing:', experience)}
                  refreshList={refreshList}
                />
              )}
            </div>
          )}

          {activeMainTab === 1 && (
            <div>
              <div className="mb-6 border-b">
                <div className="flex">
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeCategoryTab === 0
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveCategoryTab(0)}
                  >
                    All Categories
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeCategoryTab === 1
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveCategoryTab(1)}
                  >
                    Homepage Categories
                  </button>
                </div>
              </div>

              {activeCategoryTab === 0 ? <CategoryManagement /> : <HomepageCategoryAdmin />}
            </div>
          )}

          {activeMainTab === 2 && <UserManagement />}
          {activeMainTab === 3 && <BookingManagement />}
        </div>
      </div>

      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;