// src/components/experience/FormActions.js
import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

// FormActions handles the form submission and cancellation buttons
// including loading state display during form submission
const FormActions = ({ 
  onCancel, 
  isLoading, 
  experience 
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        variant="contained" 
        disabled={isLoading}
        sx={{ minWidth: 120 }}
      >
        {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
        {experience ? 'Update' : 'Create'}
      </Button>
    </Box>
  );
};

export default FormActions;