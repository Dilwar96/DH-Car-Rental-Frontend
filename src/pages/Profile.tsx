import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { auth } from "../services/api";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      setProfile({
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        profileImage: userInfo.profileImage,
      });
      if (userInfo.profileImage) {
        setImagePreview(userInfo.profileImage);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile information");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size should not exceed 5MB");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
      setSuccess("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phone", profile.phone);
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const response = await auth.updateProfile(formData);

      // Update local storage with new user info
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const updatedUserInfo = {
        ...userInfo,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        profileImage: response.user.profileImage,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      // Update the profile state with the new image URL
      setProfile((prev) => ({
        ...prev,
        profileImage: response.user.profileImage,
      }));

      // Update image preview
      if (response.user.profileImage) {
        setImagePreview(response.user.profileImage);
      }

      setSuccess("Profile updated successfully");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={imagePreview || profile.profileImage}
                  sx={{
                    width: 150,
                    height: 150,
                    mb: 2,
                    border: "2px solid #1976d2",
                  }}
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="profile-image-upload">
                  <Button variant="outlined" component="span" sx={{ mt: 1 }}>
                    Change Photo
                  </Button>
                </label>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profile.email}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
