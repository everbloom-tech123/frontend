import React, { useState } from 'react';
import { Container, Paper, ThemeProvider, createTheme, Button } from '@mui/material';
import ExperienceForm from './components/ExperienceForm.jsx';

const theme = createTheme({
  palette: {
    primary: { main: '#2196f3' },
  }
});

const ManageExperience = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    additionalInfo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <ExperienceForm 
              formData={formData}
              handleInputChange={handleInputChange}
            />
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default ManageExperience;