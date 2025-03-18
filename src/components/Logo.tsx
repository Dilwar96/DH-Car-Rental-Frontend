import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Link } from "react-router-dom";

interface LogoProps {
  showText?: boolean;
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ showText = true, size = "medium" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sizes = {
    small: {
      icon: 24,
      text: "0.85rem",
      spacing: 0.5,
    },
    medium: {
      icon: isMobile ? 24 : 32,
      text: isMobile ? "0.9rem" : "1.5rem",
      spacing: isMobile ? 0.5 : 1.5,
    },
    large: {
      icon: 48,
      text: "2rem",
      spacing: 2,
    },
  };

  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: sizes[size].spacing,
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "primary.main",
          color: "white",
          borderRadius: "50%",
          p: isMobile ? 0.5 : 1,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          "&:hover": {
            transform: "scale(1.05)",
            transition: "transform 0.3s ease",
          },
        }}
      >
        <DirectionsCarIcon
          sx={{
            fontSize: sizes[size].icon,
            transform: "rotate(-45deg)",
          }}
        />
      </Box>
      {showText && (
        <Typography
          sx={{
            fontSize: sizes[size].text,
            fontWeight: 700,
            background: "linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: isMobile ? 0 : "0.5px",
            textTransform: "none",
            fontFamily: '"Poppins", sans-serif',
            whiteSpace: "nowrap",
          }}
        >
          <Box component="span" sx={{ color: "#1a237e" }}>
            DH
          </Box>
          {" Cars Rental"}
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
