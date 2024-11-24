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
import { useAuth } from '../../contexts/AuthContext';
import RatingInfo from '../../components/RatingInfo';
import BookingCard from '../../components/BookingCard';

const ExperienceDetails = ({ experience, open, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!experience) return null;

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/signin', { 
        state: { from: `/experience/${experience.id}` }
      });
    } else {
      navigate(`/booking/${experience.id}`);
    }
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/signin');
    } else {
      // Handle wishlist toggle logic
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          {experience.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Category: {experience.categoryName}
        </Typography>
        <RatingInfo 
          rating={experience.rating} 
          reviewCount={experience.reviewCount}
          viewCount={experience.viewCount}
        />
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left side - Experience details */}
          <Box sx={{ flex: '1 1 65%' }}>
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

            {/* Video */}
            {experience.videoUrl && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Video
                </Typography>
                <video
                  controls
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                  src={ExperienceService.getImageUrl(experience.videoUrl)}
                />
              </Box>
            )}
          </Box>

          {/* Right side - Booking card */}
          <Box sx={{ flex: '1 1 35%' }}>
            <BookingCard
              experience={experience}
              isAuthenticated={isAuthenticated}
              currentUser={user}
              isInWishlist={false} // You'll need to implement wishlist state
              onBooking={handleBookingClick}
              onWishlistToggle={handleWishlistToggle}
            />
          </Box>
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