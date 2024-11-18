// Admin_Pages/components/experience/MediaUpload.js
import React from 'react';
import { Typography, Button, Box, Card, CardMedia, IconButton, Tooltip } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';

const MediaUpload = ({ 
  onImageUpload, 
  onVideoUpload, 
  currentImages, 
  currentVideo,
  onDeleteImage,
  onDeleteVideo,
  newImages 
}) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>Media</Typography>
      <Box display="flex" gap={2} mb={3}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={onImageUpload}
        />
        <label htmlFor="raised-button-file">
          <Button 
            variant="contained" 
            component="span"
            startIcon={<UploadIcon />}
          >
            Upload Images
          </Button>
        </label>

        <input
          accept="video/*"
          style={{ display: 'none' }}
          id="video-file"
          type="file"
          onChange={onVideoUpload}
        />
        <label htmlFor="video-file">
          <Button 
            variant="contained" 
            component="span"
            startIcon={<UploadIcon />}
          >
            Upload Video
          </Button>
        </label>
      </Box>

      {/* Display Images */}
      {(currentImages?.length > 0 || newImages?.length > 0) && (
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>Images</Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {currentImages?.map((url, index) => (
              <Card key={index} sx={{ width: 200 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={url}
                  alt={`Image ${index + 1}`}
                />
                <Box p={1}>
                  <Tooltip title="Delete Image">
                    <IconButton onClick={() => onDeleteImage(index)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            ))}
            {newImages?.map((file, index) => (
              <Card key={`new-${index}`} sx={{ width: 200 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={URL.createObjectURL(file)}
                  alt={`New Image ${index + 1}`}
                />
                <Box p={1} bgcolor="primary.main" color="white">
                  <Typography variant="caption">New Upload</Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Display Video */}
      {(currentVideo || newImages?.video) && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>Video</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <video width="320" height="240" controls>
              <source src={currentVideo || URL.createObjectURL(newImages.video)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {currentVideo && (
              <Tooltip title="Delete Video">
                <IconButton onClick={onDeleteVideo} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default MediaUpload;