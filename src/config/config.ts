const config = {
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:5003",
  cloudinaryUrl:
    process.env.REACT_APP_CLOUDINARY_URL ||
    "https://api.cloudinary.com/v1_1/your-cloud-name",
  defaultAvatarUrl:
    "https://res.cloudinary.com/your-cloud-name/image/upload/v1/default-avatar.png",
};

export default config;
