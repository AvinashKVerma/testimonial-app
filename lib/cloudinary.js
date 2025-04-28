// lib/cloudinary.js
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME, // Replace with your Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY, // Replace with your API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your API Secret
});

export default cloudinary;
