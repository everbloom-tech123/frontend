// src/components/experience/BasicInformation.js
import React from 'react';
import { TextField, Stack } from '@mui/material';

// BasicInformation component handles the core information fields of the experience
// including title, description, and additional information
const BasicInformation = ({ formData, handleChange }) => {
  return (
    <Stack spacing={3}>
      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        multiline
        rows={4}
        fullWidth
      />
      <TextField
        label="Additional Information"
        name="additionalInfo"
        value={formData.additionalInfo}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
      />
    </Stack>
  );
};

export default BasicInformation;