import React, { useState, useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Box,
  Stack,
  OutlinedInput,
  FormHelperText,
  Alert,
} from '@mui/material';
import CategoryService from '../../CategoryService';

const CategorySelection = ({ categories, formData, handleChange }) => {
  // We keep selectedCategory to track which category's subcategories to display
  const [selectedCategory, setSelectedCategory] = useState('');
  // selectedSubcategories now maintains ALL selected subcategories across categories
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  // availableSubcategories shows only the subcategories for the current category
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [error, setError] = useState('');

  // Initialize selections when editing an existing experience
  useEffect(() => {
    const initializeSelections = async () => {
      try {
        if (formData.subCategoryIds?.length > 0) {
          // Set all selected subcategories from formData
          setSelectedSubcategories(formData.subCategoryIds);

          // Find the first category that contains any of the selected subcategories
          const firstCategory = categories.find(category => 
            category.subcategories?.some(sub => 
              formData.subCategoryIds.includes(sub.id)
            )
          );

          if (firstCategory) {
            setSelectedCategory(firstCategory.id);
            setAvailableSubcategories(firstCategory.subcategories || []);
          }
        }
      } catch (error) {
        console.error('Error initializing selections:', error);
        setError('Failed to load initial category data');
      }
    };

    initializeSelections();
  }, [categories, formData.subCategoryIds]);

  // Handle category selection change
  const handleCategoryChange = async (event) => {
    try {
      const categoryId = event.target.value;
      setSelectedCategory(categoryId);
      setError('');

      // Fetch fresh category data for the selected category
      const categoryData = await CategoryService.getCategoryById(categoryId);
      if (categoryData) {
        // Update available subcategories for the selected category
        setAvailableSubcategories(categoryData.subcategories || []);
      }
    } catch (error) {
      console.error('Error fetching category details:', error);
      setError('Failed to load subcategories for this category');
    }
  };

  // Handle subcategory selection changes
  const handleSubcategoryChange = (event) => {
    try {
      const newSelectedIds = event.target.value;
      
      // Get all currently selected subcategories from other categories
      const otherCategoriesSelections = selectedSubcategories.filter(id => 
        !availableSubcategories.some(sub => sub.id === id)
      );

      // Combine with new selections from current category
      const allSelections = [...otherCategoriesSelections, ...newSelectedIds];
      
      setSelectedSubcategories(allSelections);
      handleChange({
        target: {
          name: 'subCategoryIds',
          value: allSelections
        }
      });
    } catch (error) {
      console.error('Error updating subcategory selections:', error);
      setError('Failed to update subcategory selections');
    }
  };

  // Handle removing a subcategory
  const handleRemoveSubcategory = (idToRemove) => {
    const newSelections = selectedSubcategories.filter(id => id !== idToRemove);
    setSelectedSubcategories(newSelections);
    handleChange({
      target: {
        name: 'subCategoryIds',
        value: newSelections
      }
    });
  };

  // Get detailed information about a subcategory
  const getSubcategoryInfo = (id) => {
    let info = { name: 'Unknown', categoryName: 'Unknown Category' };
    
    categories.some(category => {
      const subcategory = category.subcategories?.find(sub => sub.id === id);
      if (subcategory) {
        info = { 
          name: subcategory.name, 
          categoryName: category.name,
          categoryId: category.id
        };
        return true;
      }
      return false;
    });
    
    return info;
  };

  // Get currently selected subcategories for the active category
  const getCurrentCategorySelections = () => {
    return selectedSubcategories.filter(id => 
      availableSubcategories.some(sub => sub.id === id)
    );
  };

  return (
    <Stack spacing={2}>
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Display all selected subcategories as chips above the selects */}
      {selectedSubcategories.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedSubcategories.map((id) => {
            const { name, categoryName } = getSubcategoryInfo(id);
            return (
              <Chip
                key={id}
                label={`${name} (${categoryName})`}
                onDelete={() => handleRemoveSubcategory(id)}
                sx={{ 
                  backgroundColor: 'primary.light',
                  '& .MuiChip-label': { color: 'white' }
                }}
              />
            );
          })}
        </Box>
      )}

      <FormControl required fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Category"
        >
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Select a category to view its subcategories
        </FormHelperText>
      </FormControl>

      <FormControl required fullWidth disabled={!selectedCategory}>
        <InputLabel>Subcategories</InputLabel>
        <Select
          multiple
          value={getCurrentCategorySelections()}
          onChange={handleSubcategoryChange}
          input={<OutlinedInput label="Subcategories" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((id) => {
                const { name } = getSubcategoryInfo(id);
                return (
                  <Chip
                    key={id}
                    label={name}
                    size="small"
                    sx={{ 
                      backgroundColor: 'primary.light',
                      '& .MuiChip-label': { color: 'white' }
                    }}
                  />
                );
              })}
            </Box>
          )}
          MenuProps={{
            PaperProps: { style: { maxHeight: 300 } }
          }}
        >
          {availableSubcategories.map(subcategory => (
            <MenuItem 
              key={subcategory.id} 
              value={subcategory.id}
            >
              {subcategory.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Select subcategories from this category
        </FormHelperText>
      </FormControl>
    </Stack>
  );
};

export default CategorySelection;