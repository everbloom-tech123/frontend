// src/components/experience/TagsInput.js
import React from 'react';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';

// TagsInput provides functionality for adding and removing tags
// associated with the experience. It manages a list of tags with
// add/remove capabilities and displays them as interactive chips
const TagsInput = ({ 
  newTag, 
  setNewTag, 
  handleAddTag, 
  handleRemoveTag, 
  formData 
}) => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>Tags</Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
        <TextField 
          value={newTag} 
          onChange={(e) => setNewTag(e.target.value)} 
          placeholder="Add a tag" 
          size="small"
          fullWidth
        />
        <Button variant="outlined" onClick={handleAddTag}>
          Add Tag
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {formData.tags?.map((tag, index) => (
          <Chip 
            key={index} 
            label={tag} 
            onDelete={() => handleRemoveTag(tag)} 
            color="primary" 
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default TagsInput;