import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import GroupsIcon from '@mui/icons-material/Groups';

const About = () => {
  const values = [
    {
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      title: 'Excellence',
      description: 'We strive to exceed expectations in every service we provide.',
    },
    {
      icon: <EmojiObjectsIcon sx={{ fontSize: 40 }} />,
      title: 'Innovation',
      description: 'Continuously improving our services with the latest technology.',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: 'Customer Focus',
      description: 'Your satisfaction is our top priority.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Company Overview */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          About DH Cars Rental
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph align="center">
          Your Premier Car Rental Service Provider
        </Typography>
        <Typography variant="body1" paragraph sx={{ mt: 4 }}>
          DH Cars Rental has been a leading name in the car rental industry since 2020. 
          We take pride in offering our customers a wide selection of premium vehicles 
          coupled with exceptional service. Our commitment to quality, reliability, and 
          customer satisfaction has made us the preferred choice for both business and 
          leisure travelers.
        </Typography>
      </Box>

      {/* Our Values */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Values
        </Typography>
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 60,
                      height: 60,
                      margin: '0 auto 16px',
                    }}
                  >
                    {value.icon}
                  </Avatar>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Our Mission */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph align="center" sx={{ maxWidth: 800, mx: 'auto' }}>
          Our mission is to provide convenient, reliable, and affordable car rental solutions 
          while ensuring the highest levels of customer satisfaction. We aim to make the car 
          rental process as seamless as possible, offering modern vehicles and exceptional 
          service to meet all your transportation needs.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
