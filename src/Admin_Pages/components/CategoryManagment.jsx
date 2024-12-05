import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Button, TextField, IconButton, TableContainer, Box,
  Collapse, Typography
} from '@mui/material';
import { Edit, Delete, Add, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import CategoryService from '../CategoryService.js';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [openRows, setOpenRows] = useState({});
  const [newSubcategory, setNewSubcategory] = useState('');
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await CategoryService.updateCategory(editingCategory.id, { name: newCategory.name });
      } else {
        await CategoryService.createCategory({ name: newCategory.name });
      }
      fetchCategories();
      setNewCategory({ name: '' });
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await CategoryService.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleToggleRow = (categoryId) => {
    setOpenRows(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleAddSubcategory = async (categoryId) => {
    if (!newSubcategory.trim()) return;
    try {
      await CategoryService.addSubcategory(categoryId, newSubcategory);
      setNewSubcategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  const handleDeleteSubcategory = async (categoryId, subCategoryName) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await CategoryService.removeSubcategory(categoryId, subCategoryName);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ name: e.target.value })}
            required
            size="small"
            sx={{ minWidth: 300 }}
          />
          <Button type="submit" variant="contained">
            {editingCategory ? 'Update Category' : 'Add Category'}
          </Button>
          {editingCategory && (
            <Button
              variant="outlined"
              onClick={() => {
                setEditingCategory(null);
                setNewCategory({ name: '' });
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </form>

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
                    >
                      {openRows[category.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {category.sub ? `${category.sub.length} subcategories` : 'No subcategories'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(category.id)}
                      color="error"
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
                            value={newSubcategory}
                            onChange={(e) => setNewSubcategory(e.target.value)}
                          />
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleAddSubcategory(category.id)}
                          >
                            Add Subcategory
                          </Button>
                        </Box>
                        {category.sub && category.sub.length > 0 ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {category.sub.map((subcategory, index) => (
                                <TableRow key={index}>
                                  <TableCell>{subcategory}</TableCell>
                                  <TableCell align="right">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteSubcategory(category.id, subcategory)}
                                      color="error"
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