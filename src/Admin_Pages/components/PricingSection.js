// Admin_Pages/components/experience/PricingSection.js
import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const PricingSection = ({ formData, handleInputChange }) => {
  const calculateDiscountedPrice = () => {
    const price = Number(formData.price);
    const discount = Number(formData.discount);
    if (isNaN(price) || isNaN(discount)) return 'N/A';
    return (price - (price * (discount / 100))).toFixed(2);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          required
          variant="outlined"
          InputProps={{
            startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Discount"
          name="discount"
          type="number"
          value={formData.discount}
          onChange={handleInputChange}
          variant="outlined"
          InputProps={{
            endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          Price after discount: ${calculateDiscountedPrice()}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default PricingSection;