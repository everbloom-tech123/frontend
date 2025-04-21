import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Select, 
  MenuItem, IconButton, Tooltip, CircularProgress,
  TextField, FormControl, InputLabel, Grid, Alert, Snackbar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import config from '../../config';

class AdminService {
  constructor() {
    this.apiUrl = `${config.API_BASE_URL}/api/v1/users/admin`;
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  #getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      ...this.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  async getAllUsers() {
    try {
      const response = await fetch(`${this.apiUrl}/all`, {
        method: 'GET',
        headers: this.#getAuthHeaders()
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await fetch(`${this.apiUrl}/create`, {
        method: 'POST',
        headers: this.#getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }
      return await response.json();
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${this.apiUrl}/update/${userId}`, {
        method: 'PUT',
        headers: this.#getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }
      return await response.json();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await fetch(`${this.apiUrl}/delete/${userId}`, {
        method: 'DELETE',
        headers: this.#getAuthHeaders()
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }
      return await response.json();
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  async changeUserRole(userId, newRole) {
    try {
      const roleToSend = newRole.replace('ROLE_', '');      
      const response = await fetch(`${this.apiUrl}/change-role?userId=${userId}&newRole=${roleToSend}`, {
        method: 'POST',
        headers: this.#getAuthHeaders()
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change user role');
      }
      return await response.json();
    } catch (error) {
      console.error('Change user role error:', error);
      throw error;
    }
  }
}

const adminService = new AdminService();

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'ROLE_USER'
  });
  useEffect(() => {
    loadUsers();
  }, []);
  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.changeUserRole(userId, newRole);
      await loadUsers();
      showNotification('Role updated successfully', 'success');
    } catch (error) {
      showNotification('Failed to change role', 'error');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.roles[0] || 'ROLE_USER',
      password: '' 
    });
    setShowForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        await loadUsers();
        showNotification('User deleted successfully', 'success');
      } catch (error) {
        showNotification('Failed to delete user', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, formData);
      } else {
        await adminService.createUser(formData);
      }
      showNotification(`User ${editingUser ? 'updated' : 'created'} successfully!`, 'success');
      setShowForm(false);
      setEditingUser(null);
      setFormData({ username: '', email: '', password: '', role: 'ROLE_USER' });
      await loadUsers();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({
      open: true,
      message,
      type
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">User Management</Typography>
        {!showForm && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add User
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2 }}>
        {showForm ? (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  helperText={editingUser ? "Leave blank to keep current password" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    label="Role"
                  >
                    <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                    <MenuItem value="ROLE_USER">User</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button 
                    type="button" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingUser(null);
                      setFormData({ username: '', email: '', password: '', role: 'ROLE_USER' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    {editingUser ? 'Update' : 'Create'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.roles[0] || ''}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        size="small"
                      >
                        <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                        <MenuItem value="ROLE_MERCHANT">Merchant</MenuItem>
                        <MenuItem value="ROLE_USER">User</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit User">
                          <IconButton onClick={() => handleEditUser(user)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;