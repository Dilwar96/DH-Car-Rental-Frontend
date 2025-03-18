import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import ContactForm from "../components/ContactForm";
import config from "../config/config";

interface Car {
  _id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
}

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const heroBgImages = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1920",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1920",
    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1920",
  ];

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        console.log("Fetching cars from:", `${config.apiUrl}/api/cars`);
        const response = await axios.get(`${config.apiUrl}/api/cars`);
        console.log("API Response:", response.data);

        if (!response.data || response.data.length === 0) {
          console.log("No cars data received");
          // If no cars are available, use static featured cars
          setFeaturedCars(
            staticFeaturedCars.map((car) => ({
              _id: car.id.toString(),
              name: car.name,
              brand: car.brand,
              image: car.image,
              price: car.price,
            }))
          );
          return;
        }

        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setFeaturedCars(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured cars:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
        }
        // Fallback to static featured cars on error
        setFeaturedCars(
          staticFeaturedCars.map((car) => ({
            _id: car.id.toString(),
            name: car.name,
            brand: car.brand,
            image: car.image,
            price: car.price,
          }))
        );
      }
    };

    fetchFeaturedCars();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) =>
        prevIndex === heroBgImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
      title: "Wide Selection",
      description: "Choose from our diverse fleet of well-maintained vehicles.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Safe & Reliable",
      description:
        "All our cars undergo regular maintenance and safety checks.",
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: "24/7 Support",
      description: "Our customer service team is always ready to assist you.",
    },
  ];

  const staticFeaturedCars = [
    {
      id: 1,
      name: "S-Class",
      brand: "Mercedes-Benz",
      description: "Experience ultimate luxury with our premium sedan.",
      image:
        "https://images.unsplash.com/photo-1622200294772-e411743c0e07?auto=format&fit=crop&w=800",
      price: 299,
    },
    {
      id: 2,
      name: "X7",
      brand: "BMW",
      description: "Perfect for family trips and adventures.",
      image:
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800",
      price: 279,
    },
    {
      id: 3,
      name: "911",
      brand: "Porsche",
      description: "Feel the thrill of high performance.",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800",
      price: 399,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          color: "white",
          mb: 6,
          height: "80vh",
          minHeight: "600px",
          overflow: "hidden",
        }}
      >
        {/* Background Images */}
        {heroBgImages.map((img, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "opacity 1s ease-in-out",
              opacity: currentBgIndex === index ? 1 : 0,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: "rgba(0, 0, 0, 0.5)",
              },
            }}
          />
        ))}

        {/* Content */}
        <Container
          maxWidth="lg"
          sx={{
            height: "100%",
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} textAlign="center">
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "900",
                  textShadow: `
                    2px 2px 0 #000,
                    -2px -2px 0 #000,
                    2px -2px 0 #000,
                    -2px 2px 0 #000,
                    4px 4px 0 rgba(0,0,0,0.5)
                  `,
                  color: "#fff",
                  letterSpacing: "0.05em",
                  transform: "perspective(500px) rotateX(10deg)",
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                  textTransform: "uppercase",
                  mb: 4,
                }}
              >
                Premium Car Rental
              </Typography>
              <Typography
                variant="h4"
                paragraph
                sx={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                  mb: 4,
                  color: "#fff",
                  fontWeight: "500",
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                Experience luxury and comfort with our premium car rental
                service.
              </Typography>
              <Button
                component={Link}
                to="/cars"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transform: "translateY(0)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
                  },
                }}
              >
                Browse Cars
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Car Photos Carousel */}
      <Box sx={{ mb: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Featured Cars
          </Typography>
          <Carousel
            animation="slide"
            interval={5000}
            navButtonsAlwaysVisible
            indicators
            sx={{ minHeight: "400px" }}
          >
            {featuredCars.map((car) => (
              <Paper
                key={car._id}
                elevation={3}
                sx={{
                  position: "relative",
                  height: "400px",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={car.image}
                  alt={car.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    p: 3,
                  }}
                >
                  <Typography variant="h4" gutterBottom>
                    {car.brand} {car.name}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    ${car.price} per day
                  </Typography>
                  <Button
                    component={Link}
                    to="/cars"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1 }}
                  >
                    Book Now
                  </Button>
                </Box>
              </Paper>
            ))}
          </Carousel>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Cars Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          textAlign="center"
          sx={{
            mb: 6,
            fontWeight: "bold",
            background: "linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Featured Cars
        </Typography>
        <Grid container spacing={4}>
          {featuredCars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 20px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={car.image}
                  alt={`${car.brand} ${car.name}`}
                  sx={{
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                    }}
                  >
                    {car.brand} {car.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      mb: 2,
                      fontWeight: "bold",
                    }}
                  >
                    ${car.price} per day
                  </Typography>
                  <Button
                    component={Link}
                    to={`/cars`}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      py: 1,
                      fontWeight: "bold",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            component={Link}
            to="/cars"
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                transform: "scale(1.05)",
              },
            }}
          >
            View All Cars
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
