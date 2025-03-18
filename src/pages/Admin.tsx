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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useNavigate } from "react-router-dom";
import { cars, messages, bookings } from "../services/api";
import type { Car, Message, Booking } from "../services/api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface FormData extends Omit<Car, "_id"> {}

const Admin = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [messagesData, setMessagesData] = useState<Message[]>([]);
  const [bookingsData, setBookingsData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [refreshData, setRefreshData] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    brand: "",
    modelName: "",
    year: 2024,
    price: 0,
    transmission: "Automatic",
    fuelType: "Gasoline",
    seats: 5,
    mileage: "",
    image: "",
    available: true,
  });

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (currentTab === 0) {
          const carsData = await cars.getAll();
          setCarsData(carsData);
        } else if (currentTab === 1) {
          const bookingsData = await bookings.getAll();
          setBookingsData(bookingsData);
        } else if (currentTab === 2) {
          const messagesData = await messages.getAll();
          setMessagesData(messagesData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentTab, refreshData]);

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" ||
        name === "price" ||
        name === "seats" ||
        name === "mileage"
          ? Number(value)
          : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCarId) {
        await cars.update(editingCarId, formData);
        setNotification({
          type: "success",
          message: "Car updated successfully!",
        });
      } else {
        await cars.create(formData);
        setNotification({
          type: "success",
          message: "Car added successfully!",
        });
      }
      setRefreshData(!refreshData);
      handleCloseDialog();
    } catch (error) {
      setError("Failed to save car");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      setLoading(true);
      try {
        await cars.delete(id);
        setNotification({
          type: "success",
          message: "Car deleted successfully!",
        });
        setRefreshData(!refreshData);
      } catch (error) {
        setError("Failed to delete car");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messages.markAsRead(messageId);
      // Refresh messages after marking as read
      const updatedMessages = await messages.getAll();
      setMessagesData(updatedMessages);

      // Update the unread messages count in the parent component
      const unreadCount = updatedMessages.filter((msg) => !msg.read).length;
      if (window.parent) {
        window.parent.postMessage(
          { type: "updateUnreadCount", count: unreadCount },
          "*"
        );
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      setError("Failed to mark message as read");
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCarId(car._id);
    setFormData({
      name: car.name,
      brand: car.brand,
      modelName: car.modelName,
      year: car.year,
      price: car.price,
      transmission: car.transmission,
      fuelType: car.fuelType,
      seats: car.seats,
      mileage: car.mileage,
      image: car.image,
      available: car.available,
    });
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setEditingCarId(null);
    setFormData({
      name: "",
      brand: "",
      modelName: "",
      year: 2024,
      price: 0,
      transmission: "Automatic",
      fuelType: "Gasoline",
      seats: 5,
      mileage: "",
      image: "",
      available: true,
    });
    setOpenDialog(true);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBookingStatusChange = async (
    id: string,
    newStatus: "pending" | "confirmed" | "cancelled"
  ) => {
    try {
      await bookings.updateStatus(id, newStatus);
      setNotification({
        type: "success",
        message: "Booking status updated successfully!",
      });
      setRefreshData(!refreshData);
    } catch (error) {
      setError("Failed to update booking status");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await bookings.delete(id);
        setNotification({
          type: "success",
          message: "Booking deleted successfully!",
        });
        setRefreshData(!refreshData);
      } catch (error) {
        setError("Failed to delete booking");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Cars Management" />
          <Tab label="Bookings" />
          <Tab label="Messages" />
        </Tabs>
      </Box>

      {notification && (
        <Alert
          severity={notification.type}
          sx={{ mb: 2 }}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

      <TabPanel value={currentTab} index={0}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
          >
            Add New Car
          </Button>
        </Box>

        <Grid container spacing={3}>
          {carsData.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    car.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={car.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {car.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {car.brand} {car.modelName} ({car.year})
                  </Typography>
                  <Typography variant="body2">
                    Price: ${car.price}/day
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <IconButton onClick={() => handleEdit(car)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(car._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Typography variant="h6" gutterBottom>
          All Bookings
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : bookingsData.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No bookings found
          </Alert>
        ) : (
          <List>
            {bookingsData.map((booking) => (
              <React.Fragment key={booking._id}>
                <ListItem
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "flex-start",
                    py: 2,
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <DirectionsCarIcon />
                      <Box component="span" sx={{ fontSize: "1.1rem" }}>
                        {booking.car?.brand} {booking.car?.modelName}
                      </Box>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      {/* Customer Details Section */}
                      <Box sx={{ mb: 2 }}>
                        <Box component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                          Customer Details:
                        </Box>
                        {booking.user ? (
                          <Box sx={{ ml: 2 }}>
                            <Box component="div" sx={{ mb: 0.5 }}>
                              Name: {booking.user.firstName}{" "}
                              {booking.user.lastName}
                            </Box>
                            <Box component="div" sx={{ mb: 0.5 }}>
                              Email: {booking.user.email}
                            </Box>
                            {booking.user.phone && (
                              <Box component="div">
                                Phone: {booking.user.phone}
                              </Box>
                            )}
                          </Box>
                        ) : (
                          <Box sx={{ ml: 2, color: "error.main" }}>
                            Customer information not available
                          </Box>
                        )}
                      </Box>

                      {/* Booking Details Section */}
                      <Box sx={{ mb: 2 }}>
                        <Box component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                          Booking Details:
                        </Box>
                        <Box sx={{ ml: 2 }}>
                          <Box component="div" sx={{ mb: 0.5 }}>
                            From:{" "}
                            {new Date(booking.startDate).toLocaleDateString()}
                          </Box>
                          <Box component="div" sx={{ mb: 0.5 }}>
                            To: {new Date(booking.endDate).toLocaleDateString()}
                          </Box>
                          <Box component="div" sx={{ mb: 0.5 }}>
                            Total Price: ${booking.totalPrice}
                          </Box>
                          <Box component="div">
                            Booking Date:{" "}
                            {new Date(booking.createdAt).toLocaleString()}
                          </Box>
                        </Box>
                      </Box>

                      {/* Message Section */}
                      {booking.message && (
                        <Box>
                          <Box
                            component="div"
                            sx={{ fontWeight: "bold", mb: 1 }}
                          >
                            Message:
                          </Box>
                          <Box component="div" sx={{ ml: 2 }}>
                            {booking.message}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: { xs: 2, sm: 0 },
                      width: { xs: "100%", sm: "auto" },
                      justifyContent: { xs: "flex-end", sm: "flex-end" },
                    }}
                  >
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={booking.status}
                        onChange={(e) =>
                          handleBookingStatusChange(
                            booking._id,
                            e.target.value as
                              | "pending"
                              | "confirmed"
                              | "cancelled"
                          )
                        }
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirmed">Confirm</MenuItem>
                        <MenuItem value="cancelled">Cancel</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteBooking(booking._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Typography variant="h6" gutterBottom>
          Messages
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : messagesData.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No messages found
          </Alert>
        ) : (
          <List>
            {messagesData.map((message) => (
              <React.Fragment key={message._id}>
                <ListItem
                  sx={{
                    bgcolor: message.read ? "transparent" : "action.hover",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "flex-start",
                    py: 2,
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    {/* Message Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <EmailIcon
                        color={message.read ? "disabled" : "primary"}
                      />
                      <Box component="span" sx={{ fontSize: "1.1rem" }}>
                        {message.name}
                      </Box>
                      {!message.read && (
                        <Chip
                          label="New"
                          color="primary"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>

                    {/* Message Details */}
                    <Box sx={{ mt: 1, color: "text.secondary" }}>
                      <Box component="div" sx={{ mb: 0.5 }}>
                        Email: {message.email}
                      </Box>
                      {message.phone && (
                        <Box component="div" sx={{ mb: 0.5 }}>
                          Phone: {message.phone}
                        </Box>
                      )}
                      <Box component="div" sx={{ mb: 0.5 }}>
                        Message: {message.message}
                      </Box>
                      <Box component="div">
                        Sent: {new Date(message.createdAt).toLocaleString()}
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: { xs: 2, sm: 0 },
                      width: { xs: "100%", sm: "auto" },
                      justifyContent: { xs: "flex-end", sm: "flex-end" },
                    }}
                  >
                    {!message.read && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleMarkAsRead(message._id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </TabPanel>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingCarId ? "Edit Car" : "Add New Car"}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="name"
              label="Car Name"
              value={formData.name}
              onChange={handleTextInputChange}
              fullWidth
            />
            <TextField
              name="brand"
              label="Brand"
              value={formData.brand}
              onChange={handleTextInputChange}
              fullWidth
            />
            <TextField
              name="modelName"
              label="Model"
              value={formData.modelName}
              onChange={handleTextInputChange}
              fullWidth
            />
            <TextField
              name="year"
              label="Year"
              type="number"
              value={formData.year}
              onChange={handleTextInputChange}
              fullWidth
            />
            <TextField
              name="price"
              label="Price per Day"
              type="number"
              value={formData.price}
              onChange={handleTextInputChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Transmission</InputLabel>
              <Select
                name="transmission"
                value={formData.transmission}
                onChange={handleSelectChange}
              >
                <MenuItem value="Automatic">Automatic</MenuItem>
                <MenuItem value="Manual">Manual</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Fuel Type</InputLabel>
              <Select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleSelectChange}
              >
                <MenuItem value="Gasoline">Gasoline</MenuItem>
                <MenuItem value="Diesel">Diesel</MenuItem>
                <MenuItem value="Electric">Electric</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="seats"
              label="Number of Seats"
              type="number"
              value={formData.seats}
              onChange={handleTextInputChange}
              fullWidth
            />
            <TextField
              name="mileage"
              label="Mileage"
              value={formData.mileage}
              onChange={handleTextInputChange}
              fullWidth
            />
            <TextField
              name="image"
              label="Image URL"
              value={formData.image}
              onChange={handleTextInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCarId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
