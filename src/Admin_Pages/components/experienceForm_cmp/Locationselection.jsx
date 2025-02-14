// src/components/experience/LocationSelection.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

// LocationSelection handles the selection of district and city,
// with city selection being dependent on the selected district
const LocationSelection = ({ 
  districts, 
  cities, 
  formData, 
  handleChange 
}) => {
  return (
    <>
      <FormControl required fullWidth>
        <InputLabel>District</InputLabel>
        <Select 
          name="districtId" 
          value={formData.districtId} 
          onChange={handleChange}
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
          value={formData.cityId} 
          onChange={handleChange}
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
        value={formData.address}
        onChange={handleChange}
        required
        multiline
        rows={2}
        fullWidth
      />
    </>
  );
};

export default LocationSelection;