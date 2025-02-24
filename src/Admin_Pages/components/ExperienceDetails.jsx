import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
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
  Divider,
  CircularProgress
} from '@mui/material';
import ExperienceService from '../ExperienceService';

const ExperienceDetails = ({ experience, open, onClose }) => {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  if (!experience) return null;

  // Calculate the final price after discount
  const finalPrice = experience.price - (experience.price * (experience.discount / 100));

  const handleVideoError = (error) => {
    console.error('Plyr error:', error);
    setVideoError(true);
    setIsVideoLoading(false);
  };

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
                    LKR{experience.price}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    LKR{finalPrice.toFixed(2)}
                  </Typography>
                  <Chip 
                    label={`${experience.discount}% OFF`}
                    color="error"
                    size="small"
                  />
                </>
              ) : (
                <Typography variant="h6">
                  LKR{experience.price}
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

          {/* Video Section */}
          {experience.videoUrl && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Video Preview
              </Typography>
              <Box sx={{ 
                width: '100%', 
                position: 'relative',
                backgroundColor: '#000',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {isVideoLoading && (
                  <CircularProgress 
                    sx={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-20px',
                      marginLeft: '-20px',
                      zIndex: 1
                    }} 
                  />
                )}
                <Plyr
                  source={{
                    type: 'video',
                    sources: [
                      {
                        src: ExperienceService.getVideoUrl(experience.videoUrl),
                        type: 'video/mp4',
                      }
                    ]
                  }}
                  options={{
                    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                  }}
                  onReady={() => setIsVideoLoading(false)}
                  onError={handleVideoError}
                />
                {videoError && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: 'white',
                    zIndex: 2
                  }}>
                    <Typography>Error loading video</Typography>
                  </Box>
                )}
              </Box>
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