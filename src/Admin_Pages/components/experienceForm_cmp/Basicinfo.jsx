import React from 'react';
import {
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';

const BasicInformation = ({ formData, handleChange }) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Basic Information</Typography>
      
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={4}
        required
      />
      
      <TextField
        fullWidth
        label="Additional Information"
        name="additionalInfo"
        value={formData.additionalInfo}
        onChange={handleChange}
        multiline
        rows={3}
      />

      <Stack direction="row" spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.mostPopular}
              onChange={handleChange}
              name="mostPopular"
            />
          }
          label="Mark as Most Popular"
        />
      </Stack>
    </Stack>
  );
};

export default BasicInformation;