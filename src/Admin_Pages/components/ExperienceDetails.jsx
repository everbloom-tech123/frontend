import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  ImageList,
  ImageListItem,
  Divider
} from '@mui/material';
import ExperienceService from '../ExperienceService';

const ExperienceDetails = ({ experience, open, onClose }) => {
  const navigate = useNavigate();

  if (!experience) return null;

  // Calculate the final price after discount
  const finalPrice = experience.price - (experience.price * (experience.discount / 100));

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="div">
            {experience.title}
          </Typography>
          {experience.special && (
            <Chip 
              label="Special"
              color="secondary"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Category: {experience.categoryName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          {/* Images */}
          {experience.imageUrls && experience.imageUrls.length > 0 && (
            <ImageList sx={{ width: '100%', height: 300 }} cols={3} rowHeight={164}>
              {experience.imageUrls.map((url, index) => (
                <ImageListItem key={index}>
                  <img
                    src={ExperienceService.getImageUrl(url)}
                    alt={`Experience ${index + 1}`}
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300';
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}

          {/* Price and Booking Section */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {experience.discount > 0 ? (
                <>
                  <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                    ${experience.price}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${finalPrice.toFixed(2)}
                  </Typography>
                  <Chip 
                    label={`${experience.discount}% OFF`}
                    color="error"
                    size="small"
                  />
                </>
              ) : (
                <Typography variant="h6">
                  ${experience.price}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Description */}
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {experience.description}
          </Typography>

          {/* Additional Info */}
          {experience.additionalInfo && (
            <>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Typography variant="body1" paragraph>
                {experience.additionalInfo}
              </Typography>
            </>
          )}

          {/* Tags */}
          {experience.tags && experience.tags.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {experience.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Video if available */}
          {experience.videoUrl && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Video
              </Typography>
              <video
                controls
                style={{ maxWidth: '100%', maxHeight: '300px' }}
                src={ExperienceService.getVideoUrl(experience.videoUrl)}
                onError={(e) => {
                  console.error('Error loading video:', e);
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExperienceDetails;