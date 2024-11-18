// Admin_Pages/components/experience/TagsSection.js
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TagsSection = ({ tags, onAddTag, onRemoveTag }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      onAddTag(newTag);
      setNewTag('');
    }
  };

  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>Tags</Typography>
      <Box display="flex" flexWrap="wrap" gap={1} marginBottom={2}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => onRemoveTag(tag)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
      <Box display="flex" gap={1}>
        <TextField
          label="Add Tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button 
          onClick={handleAddTag} 
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
        >
          Add
        </Button>
      </Box>
    </div>
  );
};

export default TagsSection;