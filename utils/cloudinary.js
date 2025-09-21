// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dppzkbit4",
  api_key: "666617317185311",
  api_secret: "uNPe0Xckpowh1LQJ6WQ8GyeAA7U"
});

const uploadOnCloudinary = async (file) => {
  try {
    if (!file) return null;

    // If it's a base64 string (starts with "data:image")
    if (file.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(file, {
        folder: "qr-codes",
      });
      return result.secure_url;
    }

    // Else assume it's a file path
    const result = await cloudinary.uploader.upload(file, {
      folder: "qr-codes",
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export default uploadOnCloudinary;
