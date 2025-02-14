// src/components/experience/PricingSection.js
import React from 'react';
import { TextField, Box, FormControlLabel, Switch } from '@mui/material';

// PricingSection handles all pricing-related inputs including the base price,
// discount percentage, and special status toggle
const PricingSection = ({ formData, handleChange }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Discount %"
        name="discount"
        type="number"
        value={formData.discount}
        onChange={handleChange}
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch 
            checked={formData.special} 
            onChange={handleChange} 
            name="special" 
          />
        }
        label="Special"
      />
    </Box>
  );
};

export default PricingSection;