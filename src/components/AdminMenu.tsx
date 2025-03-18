import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';

interface AdminMenuProps {
  unreadMessages?: number;
}

const AdminMenu = ({ unreadMessages = 0 }: AdminMenuProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AdminPanelSettingsIcon />}
        onClick={handleClick}
        sx={{
          bgcolor: 'success.main',
          color: 'white !important',
          '&:hover': {
            bgcolor: 'success.dark',
          },
        }}
      >
        Admin Panel
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            minWidth: 250,
            mt: 1
          }
        }}
      >
        <MenuItem onClick={() => handleNavigation('/admin')}>
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleNavigation('/admin?tab=cars&action=view')}>
          <ListItemIcon>
            <DirectionsCarIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="View All Cars" />
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/admin?tab=cars&action=add')}>
          <ListItemIcon>
            <AddCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Add New Car" />
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/admin?tab=cars&action=edit')}>
          <ListItemIcon>
            <EditIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Edit Cars" />
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/admin?tab=cars&action=delete')}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete Cars" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleNavigation('/admin?tab=messages')}>
          <ListItemIcon>
            <Badge badgeContent={unreadMessages} color="error">
              <EmailIcon color="primary" />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default AdminMenu; 