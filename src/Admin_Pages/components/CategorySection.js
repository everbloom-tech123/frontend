// Admin_Pages/components/experience/CategorySection.js
import React from 'react';
import { Box, Select, MenuItem, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CategorySection = ({ formData, categories, handleInputChange, onManageCategories }) => {
  return (
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
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
        ))}
      </Select>
      <Button 
        onClick={onManageCategories} 
        startIcon={<AddIcon />}
        variant="outlined"
        color="primary"
      >
        Manage Categories
      </Button>
    </Box>
  );
};

export default CategorySection;