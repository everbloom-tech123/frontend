import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

const LocationSelection = ({ 
  districts, 
  cities, 
  formData, 
  handleChange,
  onCityChange 
}) => {
  const handleDistrictChange = (event) => {
    handleChange(event);
    if (formData.cityId) {
      handleChange({ 
        target: { 
          name: 'cityId', 
          value: '' 
        } 
      });
    }
  };

  const handleCitySelect = (event) => {
    handleChange(event);
    onCityChange?.(event.target.value);
  };

  return (
    <>
      <FormControl required fullWidth>
        <InputLabel>District</InputLabel>
        <Select 
          name="districtId" 
          value={formData.districtId || ''} 
          onChange={handleDistrictChange}
        >
          {districts.map(district => (
            <MenuItem key={district.id} value={district.id}>
              {district.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl 
        required 
        fullWidth 
        disabled={!formData.districtId}
      >
        <InputLabel>City</InputLabel>
        <Select 
          name="cityId" 
          value={formData.cityId || ''} 
          onChange={handleCitySelect}
        >
          {cities.map(city => (
            <MenuItem key={city.id} value={city.id}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Address"
        name="address"
        value={formData.address || ''}
        onChange={handleChange}
        required
        multiline
        rows={2}
        fullWidth
        error={!!formData.cityId && !formData.address}
      />
    </>
  );
};

export default LocationSelection;