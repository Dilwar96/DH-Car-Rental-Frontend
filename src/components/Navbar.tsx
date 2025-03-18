import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

interface MenuItem {
  title: string;
  path: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userInfoStr = localStorage.getItem('userInfo');
    
    if (token && userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        setIsLoggedIn(true);
        setUserName(`${userInfo.firstName} ${userInfo.lastName}`);
      } catch (error) {
        console.error('Error parsing user info:', error);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserName('');
    handleClose();
    navigate('/');
  };

  const menuItems: MenuItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Cars', path: '/cars' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            Hello, {userName}
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            Logout
          </Button>
        </Box>
      );
    }
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
          color="inherit" 
          component={Link} 
          to="/login"
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          Login
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/register"
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          Register
        </Button>
      </Box>
    );
  };

  const renderMobileMenu = () => {
    const mobileMenuItems: MenuItem[] = [
      ...menuItems,
      ...(isLoggedIn
        ? [
            { title: `Hello, ${userName}`, path: '', disabled: true },
            { title: 'Logout', path: '', onClick: handleLogout },
          ]
        : [
            { title: 'Login', path: '/login' },
            { title: 'Register', path: '/register' },
          ]),
    ];

    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ mt: 1 }}
      >
        {mobileMenuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              } else if (!item.disabled) {
                navigate(item.path);
                handleClose();
              }
            }}
            disabled={item.disabled}
          >
            {item.title}
          </MenuItem>
        ))}
      </Menu>
    );
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a237e' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          DH CARS RENTAL
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
            {renderMobileMenu()}
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mr: 4 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                >
                  {item.title}
                </Button>
              ))}
            </Box>
            {renderAuthButtons()}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
