import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Chip, 
  TableContainer, 
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import ExperienceService from '../ExperienceService';
import ExperienceDetails from './ExperienceDetails';

const ExperienceList = ({ onEdit, onView, refreshList }) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, [refreshList]);

  const fetchExperiences = async () => {
    try {
      const data = await ExperienceService.getAllExperiences();
      setExperiences(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setError('Failed to load experiences. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await ExperienceService.deleteExperience(id);
        await fetchExperiences();
      } catch (error) {
        console.error('Error deleting experience:', error);
        setError('Failed to delete experience. Please try again.');
      }
    }
  };

  const handleView = (experience) => {
    setSelectedExperience(experience);
    setDetailsOpen(true);
  };

  if (loading) {
    return <div>Loading experiences...</div>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell>
                  {experience.imageUrls && experience.imageUrls[0] && (
                    <img 
                      src={ExperienceService.getImageUrl(experience.imageUrls[0])}
                      alt={experience.title}
                      style={{ 
                        width: 60, 
                        height: 60, 
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/60';
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>{experience.title}</TableCell>
                <TableCell>{experience.category?.name}</TableCell>
                <TableCell>LKR{experience.price}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {experience.tags?.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(experience)} title="View">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => onEdit(experience)} title="Edit">
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(experience.id)}
                    color="error"
                    title="Delete"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <ExperienceDetails
        experience={selectedExperience}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedExperience(null);
        }}
      />
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExperienceList;