import React from 'react';
import { Box, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CategorySection = ({ formData, categories, handleInputChange, onManageCategories }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <FormControl fullWidth sx={{ mr: 2 }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="category"
          value={formData.category || ''}
          onChange={handleInputChange}
          label="Category"
          required
        >
          <MenuItem value="" disabled>Select Category</MenuItem>
          {categories?.map((cat) => (
            <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
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