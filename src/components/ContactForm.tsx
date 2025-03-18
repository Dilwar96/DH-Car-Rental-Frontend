import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { messages } from "../services/api";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      console.log("Sending message:", formData);
      const response = await messages.create(formData);
      console.log("Message creation response:", response);
      setNotification({
        type: "success",
        message: "Message sent successfully! We'll get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      setNotification({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Contact Us
      </Typography>
      {notification && (
        <Alert
          severity={notification.type}
          sx={{ mb: 2 }}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          required
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          required
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="phone"
          label="Phone (optional)"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          required
          name="message"
          label="Message"
          multiline
          rows={4}
          value={formData.message}
          onChange={handleChange}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ContactForm;
