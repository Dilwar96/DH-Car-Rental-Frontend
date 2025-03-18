import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import InfoIcon from "@mui/icons-material/Info";
import ContactsIcon from "@mui/icons-material/Contacts";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Logo from "./components/Logo";
import AdminMenu from "./components/AdminMenu";
import { messages } from "./services/api";
import type { Message } from "./services/api";
import Profile from "./pages/Profile";
import "./App.css";
import Layout from "./components/Layout";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        setIsLoggedIn(true);
        setIsAdmin(userInfo.isAdmin || false);
        setUserName(`${userInfo.firstName} ${userInfo.lastName}`);
        setProfileImage(userInfo.profileImage || "");
        if (userInfo.isAdmin) {
          fetchUnreadMessages();
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserName("");
      setProfileImage("");
    }

    // Add storage event listener for profile updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userInfo" && e.newValue) {
        try {
          const userInfo = JSON.parse(e.newValue);
          setProfileImage(userInfo.profileImage || "");
          setUserName(`${userInfo.firstName} ${userInfo.lastName}`);
        } catch (error) {
          console.error("Error parsing updated user info:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Add message event listener for unread count updates
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "updateUnreadCount") {
        setUnreadMessages(event.data.count);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const fetchUnreadMessages = async () => {
    try {
      const response = await messages.getAll();
      const unreadCount = response.filter((msg: Message) => !msg.read).length;
      setUnreadMessages(unreadCount);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserName("");
    setProfileImage("");
    setUnreadMessages(0);
    handleClose();
  };

  const navigationItems = [
    { text: "Home", path: "/", icon: <HomeIcon /> },
    { text: "Cars", path: "/cars", icon: <DirectionsCarIcon /> },
    { text: "About", path: "/about", icon: <InfoIcon /> },
    { text: "Contact", path: "/contact", icon: <ContactsIcon /> },
  ];

  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {navigationItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        {!isLoggedIn && (
          <List>
            <ListItem
              button
              component={Link}
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </List>
        )}
      </Box>
    </Drawer>
  );

  return (
    <Router>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <AppBar position="static">
          <Toolbar sx={{ gap: 1 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ p: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Logo size={isMobile ? "small" : "medium"} />
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: "flex", ml: 2 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    sx={{ mx: 1 }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
              {isLoggedIn ? (
                <>
                  {isAdmin && <AdminMenu unreadMessages={unreadMessages} />}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton color="inherit" onClick={handleMenu}>
                      {profileImage ? (
                        <Avatar
                          src={profileImage}
                          sx={{
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            border: "2px solid white",
                          }}
                        />
                      ) : (
                        <AccountCircleIcon />
                      )}
                    </IconButton>
                    {!isMobile && (
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {userName}
                      </Typography>
                    )}
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleClose}
                    >
                      <AccountCircleIcon sx={{ mr: 1 }} />
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                !isMobile && (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/login"
                      startIcon={<LoginIcon />}
                    >
                      Login
                    </Button>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/register"
                      startIcon={<PersonAddIcon />}
                    >
                      Register
                    </Button>
                  </>
                )
              )}
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileDrawer()}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
              />
              <Route
                path="/admin/*"
                element={
                  isLoggedIn && isAdmin ? <Admin /> : <Navigate to="/login" />
                }
              />
            </Route>
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
