import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableRow, Paper, 
  IconButton, Chip, TableContainer, Box
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import ExperienceService from '../ExperienceService';

const ExperienceList = ({ onEdit, onView, refreshList }) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, [refreshList]);

  const fetchExperiences = async () => {
    try {
      const data = await ExperienceService.getAllExperiences();
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await ExperienceService.deleteExperience(id);
        fetchExperiences();
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    return imageUrl.includes('http') ? imageUrl : `/public/api/products/files/${imageUrl}`;
  };

  if (loading) {
    return <div>Loading experiences...</div>;
  }

  return (
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
                    src={getImageUrl(experience.imageUrls[0])}
                    alt={experience.title}
                    style={{ 
                      width: 60, 
                      height: 60, 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                )}
              </TableCell>
              <TableCell>{experience.title}</TableCell>
              <TableCell>{experience.category?.name}</TableCell>
              <TableCell>${experience.price}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {experience.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      style={{ marginRight: 4 }}
                    />
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onView(experience)}>
                  <Visibility />
                </IconButton>
                <IconButton onClick={() => onEdit(experience)}>
                  <Edit />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(experience.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExperienceList;