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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SpeedIcon from "@mui/icons-material/Speed";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { bookings } from "../services/api";

interface Car {
  _id: string;
  name: string;
  brand: string;
  modelName: string;
  year: number;
  price: number;
  transmission: string;
  fuelType: string;
  seats: number;
  mileage: string;
  image: string;
  available: boolean;
}

interface BookingDialogProps {
  open: boolean;
  car: Car | null;
  onClose: () => void;
  onBook: (startDate: Date, endDate: Date, message: string) => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  car,
  onClose,
  onBook,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleBook = () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start >= end) {
      setError("End date must be after start date");
      return;
    }

    if (start < today) {
      setError("Start date cannot be in the past");
      return;
    }

    onBook(start, end, message);
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Book {car?.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: "300px", pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ mb: 2 }}>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setError("");
              }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
              fullWidth
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setError("");
              }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: startDate || today }}
              fullWidth
            />
          </Box>
          <TextField
            label="Message (Optional)"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />
          {startDate && endDate && car && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total Price: $
              {car.price *
                Math.ceil(
                  (new Date(endDate).getTime() -
                    new Date(startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleBook} variant="contained" color="primary">
          Book Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Cars = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:5003/api/cars");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceRangeChange = (event: SelectChangeEvent) => {
    setPriceRange(event.target.value);
  };

  const handleTransmissionChange = (event: SelectChangeEvent) => {
    setTransmission(event.target.value);
  };

  const handleBookClick = (car: Car) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAlert({ type: "error", message: "Please log in to book a car" });
      navigate("/login");
      return;
    }
    setSelectedCar(car);
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = async (
    startDate: Date,
    endDate: Date,
    message: string
  ) => {
    if (!selectedCar) return;

    try {
      await bookings.create({
        carId: selectedCar._id,
        startDate,
        endDate,
        message,
      });
      setAlert({
        type: "success",
        message:
          "Booking created successfully! Waiting for admin confirmation.",
      });
      setBookingDialogOpen(false);
      setSelectedCar(null);
    } catch (error) {
      console.error("Booking error:", error);
      setAlert({
        type: "error",
        message: "Failed to create booking. Please try again.",
      });
    }
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriceRange =
      priceRange === "all" ||
      (priceRange === "low" && car.price <= 200) ||
      (priceRange === "medium" && car.price > 200 && car.price <= 300) ||
      (priceRange === "high" && car.price > 300);

    const matchesTransmission =
      transmission === "all" || car.transmission.toLowerCase() === transmission;

    return matchesSearch && matchesPriceRange && matchesTransmission;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {alert && (
        <Alert
          severity={alert.type}
          sx={{ mb: 2 }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Available Cars
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Cars"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceRange}
                label="Price Range"
                onChange={handlePriceRangeChange}
              >
                <MenuItem value="all">All Prices</MenuItem>
                <MenuItem value="low">$0 - $200</MenuItem>
                <MenuItem value="medium">$201 - $300</MenuItem>
                <MenuItem value="high">$301+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Transmission</InputLabel>
              <Select
                value={transmission}
                label="Transmission"
                onChange={handleTransmissionChange}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="automatic">Automatic</MenuItem>
                <MenuItem value="manual">Manual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Cars Grid */}
      <Grid container spacing={4}>
        {filteredCars.map((car) => (
          <Grid item xs={12} md={6} lg={4} key={car._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="200"
                image={car.image}
                alt={car.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {car.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`$${car.price}/day`}
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={car.year}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={car.available ? "Available" : "Not Available"}
                    color={car.available ? "success" : "error"}
                    sx={{ mb: 1 }}
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCarIcon color="action" />
                      <Typography variant="body2">
                        {car.transmission}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalGasStationIcon color="action" />
                      <Typography variant="body2">{car.fuelType}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AirlineSeatReclineNormalIcon color="action" />
                      <Typography variant="body2">{car.seats} Seats</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <SpeedIcon color="action" />
                      <Typography variant="body2">{car.mileage}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!car.available}
                  onClick={() => handleBookClick(car)}
                >
                  {car.available ? "Book Now" : "Not Available"}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCars.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No cars found matching your criteria.
          </Typography>
        </Box>
      )}

      <BookingDialog
        open={bookingDialogOpen}
        car={selectedCar}
        onClose={() => setBookingDialogOpen(false)}
        onBook={handleBookingSubmit}
      />
    </Container>
  );
};

export default Cars;
