import React from "react";
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
