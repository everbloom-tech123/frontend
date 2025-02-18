import React, { useState, useEffect } from 'react';
import { 
  Stack, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Box,
  OutlinedInput,
  FormHelperText,
  Alert
} from '@mui/material';

const CategorySelection = ({ categories, formData, handleChange, isEditing }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [error, setError] = useState('');

  // Initialize selections when component mounts or formData changes
  useEffect(() => {
    const initializeSelections = async () => {
      try {
        // Set all selected subcategories from formData
        if (formData.subCategoryIds?.length > 0) {
          setSelectedSubcategories(formData.subCategoryIds);

          // Find and set the initial category
          for (const category of categories) {
            const hasSubcategory = category.subcategories?.some(sub => 
              formData.subCategoryIds.includes(sub.id)
            );
            if (hasSubcategory) {
              setSelectedCategory(category.id);
              setAvailableSubcategories(category.subcategories || []);
              break;
            }
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
  const handleCategoryChange = (event) => {
    try {
      const categoryId = event.target.value;
      setSelectedCategory(categoryId);
      setError('');

      const selectedCategoryData = categories.find(cat => cat.id === categoryId);
      if (selectedCategoryData) {
        setAvailableSubcategories(selectedCategoryData.subcategories || []);
      }
    } catch (error) {
      console.error('Error handling category change:', error);
      setError('Failed to update category selection');
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

  // Get subcategory info for display
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

      {/* Display all selected subcategories as chips */}
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

      {/* Category Selector */}
      <FormControl required={!isEditing} fullWidth>
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

      {/* Subcategory Selector */}
      <FormControl required={!isEditing} fullWidth disabled={!selectedCategory}>
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
          {isEditing 
            ? 'Optionally select additional subcategories' 
            : 'Select subcategories from this category'}
        </FormHelperText>
      </FormControl>
    </Stack>
  );
};

export default CategorySelection;