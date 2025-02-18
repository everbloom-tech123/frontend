import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, IconButton, Tooltip, CircularProgress
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';// services/userService.js
export { getAllUsers, changeUserRole, getCurrentUserProfile } from '../../../services/userService';

const UserList = ({ onEditUser, refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [refreshTrigger]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await changeUserRole(userId, newRole);
      await loadUsers();
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Select
                  value={user.roles[0] || ''}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                  <MenuItem value="ROLE_CLIENT">Client</MenuItem>
                  <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
                  <MenuItem value="ROLE_USER">User</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Tooltip title="Edit User">
                  <IconButton onClick={() => onEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};