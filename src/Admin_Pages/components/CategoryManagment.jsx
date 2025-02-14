import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Button, TextField, IconButton, TableContainer, Box,
  Collapse, Typography, Alert, Snackbar
} from '@mui/material';
import {
  Edit, Delete, Add, KeyboardArrowDown, KeyboardArrowUp,
  Cancel as CancelIcon
} from '@mui/icons-material';
import CategoryService from '../CategoryService';

const CategoryManagement = () => {
  // State management for categories and UI
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [openRows, setOpenRows] = useState({});
  const [newSubcategories, setNewSubcategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories from the backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch categories: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle category form submission (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCategory) {
        await CategoryService.updateCategory(editingCategory.id, { 
          name: newCategory.name.trim(),
          subcategories: editingCategory.subcategories 
        });
        setSuccess('Category updated successfully');
      } else {
        await CategoryService.createCategory({ name: newCategory.name.trim() });
        setSuccess('Category created successfully');
      }
      await fetchCategories();
      resetForm();
    } catch (error) {
      setError('Error saving category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form and editing state
  const resetForm = () => {
    setNewCategory({ name: '' });
    setEditingCategory(null);
  };

  // Set up category for editing
  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name });
  };

  // Handle category deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setLoading(true);
        await CategoryService.deleteCategory(id);
        setSuccess('Category deleted successfully');
        await fetchCategories();
      } catch (error) {
        setError('Error deleting category: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle row expansion for subcategories
  const handleToggleRow = (categoryId) => {
    setOpenRows(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
    // Initialize newSubcategory field for this category if it's being opened
    if (!newSubcategories[categoryId]) {
      setNewSubcategories(prev => ({
        ...prev,
        [categoryId]: ''
      }));
    }
  };

  // Handle adding a new subcategory
  const handleAddSubcategory = async (categoryId) => {
    const subcategoryName = newSubcategories[categoryId];
    if (!subcategoryName?.trim()) return;

    try {
      setLoading(true);
      await CategoryService.addSubcategory(categoryId, subcategoryName.trim());
      setSuccess('Subcategory added successfully');
      // Clear the input field for this category
      setNewSubcategories(prev => ({
        ...prev,
        [categoryId]: ''
      }));
      await fetchCategories();
    } catch (error) {
      setError('Error adding subcategory: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle subcategory deletion
  const handleDeleteSubcategory = async (categoryId, subcategory) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        setLoading(true);
        await CategoryService.removeSubcategory(categoryId, subcategory.name);
        setSuccess('Subcategory deleted successfully');
        await fetchCategories();
      } catch (error) {
        setError('Error deleting subcategory: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle changes to new subcategory input fields
  const handleSubcategoryInputChange = (categoryId, value) => {
    setNewSubcategories(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      {/* Notifications */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Category Form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ name: e.target.value })}
            required
            size="small"
            sx={{ minWidth: 300 }}
            disabled={loading}
            error={!!error && error.includes('name')}
            helperText={error && error.includes('name') ? error : ''}
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {editingCategory ? 'Update Category' : 'Add Category'}
          </Button>
          {editingCategory && (
            <Button
              variant="outlined"
              onClick={resetForm}
              startIcon={<CancelIcon />}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </Box>
      </form>

      {/* Categories Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Subcategories</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleRow(category.id)}
                      disabled={loading}
                    >
                      {openRows[category.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {category.subcategories?.length || 0} subcategories
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleEdit(category)}
                      disabled={loading}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(category.id)}
                      color="error"
                      disabled={loading}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openRows[category.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Subcategories
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <TextField
                            size="small"
                            label="New Subcategory"
                            value={newSubcategories[category.id] || ''}
                            onChange={(e) => handleSubcategoryInputChange(category.id, e.target.value)}
                            disabled={loading}
                          />
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleAddSubcategory(category.id)}
                            disabled={loading || !newSubcategories[category.id]?.trim()}
                          >
                            Add Subcategory
                          </Button>
                        </Box>
                        {category.subcategories && category.subcategories.length > 0 ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {category.subcategories.map((subcategory) => (
                                <TableRow key={subcategory.id}>
                                  <TableCell>{subcategory.name}</TableCell>
                                  <TableCell align="right">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteSubcategory(category.id, subcategory)}
                                      color="error"
                                      disabled={loading}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography color="textSecondary">
                            No subcategories found
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CategoryManagement;