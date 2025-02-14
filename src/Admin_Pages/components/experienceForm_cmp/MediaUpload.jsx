// src/components/experience/MediaUpload.js
import React from 'react';
import { Box, Typography, Alert, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// MediaUpload handles both image and video uploads for the experience
// including preview functionality and file validation
const MediaUpload = ({ 
  handleFileChange, 
  imageError, 
  videoError,
  previewUrls,
  handleRemoveImage,
  formData
}) => {
  return (
    <>
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Images (Maximum 5)
        </Typography>
        <input
          type="file"
          name="images"
          onChange={handleFileChange}
          multiple
          accept="image/*"
        />
        {imageError && <Alert severity="error">{imageError}</Alert>}
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {previewUrls.map((url, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
              <IconButton
                size="small"
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 0, 
                  bgcolor: 'background.paper' 
                }}
                onClick={() => handleRemoveImage(index)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom>Video</Typography>
        <input
          type="file"
          name="video"
          onChange={handleFileChange}
          accept="video/*"
        />
        {videoError && <Alert severity="error">{videoError}</Alert>}
        {formData.video && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected video: {formData.video.name}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default MediaUpload;