import React, { useState } from 'react';
import {
  Box, TextField, Button, Grid,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    role: user?.roles[0] || 'ROLE_USER',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
              <MenuItem value="ROLE_CLIENT">Client</MenuItem>
              <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
              <MenuItem value="ROLE_USER">User</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {user ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
