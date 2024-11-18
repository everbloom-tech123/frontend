// Admin_Pages/components/experience/CategoryDialog.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryDialog = ({
  open,
  onClose,
  categories,
  onAdd,
  onUpdate,
  onDelete,
  editingCategory
}) => {
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
    } else {
      setCategoryName('');
    }
  }, [editingCategory]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editingCategory ? 'Edit Category' : 'Add New Category'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Category Name"
          fullWidth
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          variant="outlined"
        />
        <List sx={{ mt: 2 }}>
          {categories.map((category) => (
            <ListItem key={category.id}>
              <ListItemText primary={category.name} />
              <ListItemSecondaryAction>
                <Tooltip title="Edit">
                  <IconButton onClick={() => onUpdate(category)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(category.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => {
            editingCategory ? onUpdate(categoryName) : onAdd(categoryName);
            setCategoryName('');
          }}
          variant="contained"
          disabled={!categoryName.trim()}
        >
          {editingCategory ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;