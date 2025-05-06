
import React, { useState, useEffect } from 'react';
import NavbarCategoryService from '../services/NavbarCategoryService';
import CategoryService from './CategoryService';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NavbarCategoryAdmin() {
  // State variables
  const [navbarCategories, setNavbarCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load data when component mounts or when refresh is triggered
  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  // Function to load all necessary data
  const loadData = async () => {
    setLoading(true);
    try {
      // Load navbar categories
      const navbarCategoriesData = await NavbarCategoryService.getAllNavbarCategories();
      console.log("Loaded categories:", navbarCategoriesData);
      setNavbarCategories(navbarCategoriesData);

      // Load all categories
      const allCategoriesData = await CategoryService.getAllCategories();
      
      // Filter out categories that are already in the navbar
      const navbarCategoryIds = navbarCategoriesData.map(nc => nc.category.id);
      const filteredCategories = allCategoriesData.filter(
        category => !navbarCategoryIds.includes(category.id)
      );
      
      setAvailableCategories(filteredCategories);
    } catch (error) {
      toast.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a category to the navbar
  const handleAddCategory = async () => {
    if (!selectedCategoryId) {
      toast.warning('Please select a category to add');
      return;
    }

    setLoading(true);
    try {
      // Get the next display order (highest existing order + 1)
      const nextDisplayOrder = navbarCategories.length > 0 
        ? Math.max(...navbarCategories.map(item => item.displayOrder)) + 1
        : 1;
        
      await NavbarCategoryService.addCategoryToNavbar(selectedCategoryId, nextDisplayOrder);
      toast.success('Category added to navbar successfully');
      setSelectedCategoryId('');
      // Trigger a refresh to update the lists
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to add category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a category from the navbar
  const handleRemoveCategory = async (id) => {
    if (!window.confirm('Are you sure you want to remove this category from the navbar?')) {
      return;
    }

    setLoading(true);
    try {
      await NavbarCategoryService.removeFromNavbar(id);
      toast.success('Category removed from navbar');
      // Trigger a refresh to update the lists
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to remove category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggling the active state of a category
  const handleToggleActive = async (id, currentActive) => {
    setLoading(true);
    try {
      await NavbarCategoryService.updateNavbarCategory(id, {
        isActive: !currentActive
      });
      toast.success(`Category ${!currentActive ? 'activated' : 'deactivated'} successfully`);
      // Trigger a refresh to update the list
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to update category: ' + error.message);
      console.error('Toggle error details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (result) => {
    // If dropped outside the list, do nothing
    if (!result.destination) return;
    
    // If the position didn't change, do nothing
    if (result.destination.index === result.source.index) return;
    
    // Reorder the array
    const reorderedItems = Array.from(navbarCategories);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    
    // Update the displayOrder property for all items
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      displayOrder: index + 1
    }));
    
    // Update the UI immediately for better UX
    setNavbarCategories(updatedItems);
    
    // Format the data for the API call
    const orderUpdates = updatedItems.map(item => ({
      id: item.id,
      displayOrder: item.displayOrder
    }));
    
    // Send the update to the server
    try {
      await NavbarCategoryService.updateNavbarCategoriesOrder(orderUpdates);
      toast.success('Order updated successfully');
    } catch (error) {
      toast.error('Failed to update order: ' + error.message);
      // Revert to previous state on error
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <header className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Navbar Categories Management</h1>
        <p className="text-sm text-gray-600 mt-1">Add, remove, reorder and activate/deactivate categories displayed in the navigation bar.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Category Section */}
        <div className="md:col-span-1">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Category to Navbar</h2>
            <div className="space-y-4">
              <select 
                value={selectedCategoryId} 
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                disabled={loading || availableCategories.length === 0}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select a category to add</option>
                {availableCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <button 
                onClick={handleAddCategory}
                disabled={loading || !selectedCategoryId}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add to Navbar'}
              </button>
              {availableCategories.length === 0 && !loading && (
                <p className="text-sm italic text-gray-500 mt-3">All categories are already added to the navbar.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Current Navbar Categories Section */}
        <div className="md:col-span-2">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Current Navbar Categories</h2>
            <p className="text-xs text-gray-500 mb-4">Drag and drop to reorder. Changes are saved automatically.</p>
            
            {loading && (
              <div className="text-center py-10 text-gray-500">
                <svg className="animate-spin h-8 w-8 mx-auto text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            )}
            
            {!loading && navbarCategories.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-md">
                <p className="text-gray-500">No categories have been added to the navbar yet.</p>
              </div>
            )}
            
            {!loading && navbarCategories.length > 0 && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="navbar-categories">
                  {(provided) => (
                    <ul 
                      className="space-y-3" 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                    >
                      {navbarCategories.map((navbarCategory, index) => {
                        // Check if active property exists and use it, fallback to isActive for backward compatibility
                        const isActive = navbarCategory.active !== undefined ? navbarCategory.active : navbarCategory.isActive;
                        
                        return (
                          <Draggable 
                            key={`nav-cat-${navbarCategory.id}`} 
                            draggableId={`nav-cat-${navbarCategory.id}`} 
                            index={index}
                          >
                            {(provided) => (
                              <li 
                                ref={provided.innerRef} 
                                {...provided.draggableProps} 
                                {...provided.dragHandleProps}
                                className={`flex items-center justify-between p-4 rounded-md border ${!isActive ? 'bg-gray-50 border-l-4 border-l-red-400 border-gray-200' : 'bg-white border-gray-200'} shadow-sm transition-all hover:shadow`}
                              >
                                <div className="flex items-center flex-1 min-w-0">
                                  <span className="flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mr-3">
                                    {navbarCategory.displayOrder}
                                  </span>
                                  <div className="min-w-0">
                                    <h3 className="text-base font-medium text-gray-800 truncate">{navbarCategory.category.name}</h3>
                                    <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2 ml-4">
                                  <button 
                                    onClick={() => handleToggleActive(navbarCategory.id, isActive)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md ${isActive ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'} transition-colors`}
                                    disabled={loading}
                                  >
                                    {isActive ? 'Deactivate' : 'Activate'}
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveCategory(navbarCategory.id)}
                                    className="px-3 py-1 text-xs font-medium rounded-md bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                                    disabled={loading}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarCategoryAdmin;
