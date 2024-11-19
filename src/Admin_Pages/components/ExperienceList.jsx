// src/Admin_Pages/components/ExperienceList.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableRow, Paper, 
  IconButton, Chip, TableContainer 
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import ExperienceService from '../../../services/ExperienceService';

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

  if (loading) {
    return <div>Loading experiences...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
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
              <TableCell>{experience.title}</TableCell>
              <TableCell>{experience.category?.name}</TableCell>
              <TableCell>${experience.price}</TableCell>
              <TableCell>
                {experience.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    style={{ marginRight: 4 }}
                  />
                ))}
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