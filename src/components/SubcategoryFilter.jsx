import React, { useEffect, useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CategoryService from '../Admin_Pages/CategoryService';

const SubcategoryFilter = ({ categoryId, onSubcategorySelect }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        const response = await CategoryService.getCategoryById(categoryId);
        setSubcategories(response.subcategories || []);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setError('Failed to load subcategories');
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  if (loading) return <p>Loading subcategories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <FormControl fullWidth>
      <InputLabel>Subcategory</InputLabel>
      <Select
        onChange={(e) => onSubcategorySelect(e.target.value)}
        defaultValue=""
      >
        <MenuItem value="">All</MenuItem>
        {subcategories.map((sub) => (
          <MenuItem key={sub.id} value={sub.name}>
            {sub.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SubcategoryFilter; 