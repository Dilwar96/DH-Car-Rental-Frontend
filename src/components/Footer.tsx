import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: { xs: 4, md: 6 },
        width: "100%",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
            >
              About DH Car Rental
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            >
              We provide premium car rental services with a wide selection of
              vehicles to meet your needs. Experience luxury and comfort with
              our fleet of well-maintained cars.
            </Typography>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <IconButton
                color="inherit"
                aria-label="Facebook"
                size={isMobile ? "small" : "medium"}
              >
                <FacebookIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Twitter"
                size={isMobile ? "small" : "medium"}
              >
                <TwitterIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Instagram"
                size={isMobile ? "small" : "medium"}
              >
                <InstagramIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="LinkedIn"
                size={isMobile ? "small" : "medium"}
              >
                <LinkedInIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Quick Links
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-start" },
              }}
            >
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{ mb: 1, fontSize: { xs: "0.875rem", md: "1rem" } }}
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/cars"
                color="inherit"
                sx={{ mb: 1, fontSize: { xs: "0.875rem", md: "1rem" } }}
              >
                Our Cars
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                color="inherit"
                sx={{ mb: 1, fontSize: { xs: "0.875rem", md: "1rem" } }}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                color="inherit"
                sx={{ mb: 1, fontSize: { xs: "0.875rem", md: "1rem" } }}
              >
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Contact Info
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-start" },
                "& > div": {
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  width: "100%",
                },
              }}
            >
              <Box>
                <LocationOnIcon
                  sx={{ mr: 1, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                >
                  123 Car Street, Auto City, AC 12345
                </Typography>
              </Box>
              <Box>
                <PhoneIcon
                  sx={{ mr: 1, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                >
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box>
                <EmailIcon
                  sx={{ mr: 1, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                >
                  info@dhcarrental.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Divider
          sx={{ my: { xs: 2, md: 3 }, bgcolor: "rgba(255, 255, 255, 0.2)" }}
        />
        <Typography
          variant="body2"
          align="center"
          sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
        >
          © {new Date().getFullYear()} DH Car Rental. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
