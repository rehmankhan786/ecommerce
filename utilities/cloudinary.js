const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadPhoto = async (filename) => {
  let path = `${__dirname}../uploads`;

  // Configuration
  cloudinary.config({
    cloud_name: "dbzze2ytm",
    api_key: "562728934387699",
    api_secret: "utLpYt9y437xlGv2IFHBmMaYfQc", // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
  try {
    const imgUpload = await cloudinary.uploader.upload(
      `${__dirname}/../uploads/${filename}`,
      {
        // Transformation options
        folder: "profilePics",
        quality: "auto:good", // Auto-adjust quality for good compression
        format: "jpg", // Convert image to JPEG format (smaller size)
        width: 800, // Resize to max width of 800px (adjust as needed)
        height: 800, // Resize to max height of 800px (adjust as needed)
        crop: "limit", // Limit crop so that image keeps its aspect ratio
        public_id: `${filename}`,
      }
    );

    // console.log(imgUpload);
    fs.unlinkSync(`${path}/${filename}`);
    return imgUpload;
  } catch (error) {
    console.log(error);
  }
};
// module.exports = {uploadPhoto}
const uploadProductPhoto = async (filename) => {
  let path = `E:/fullStackProjects/ecommerceapp/backend/uploads`;

  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
  try {
    const imgUpload = await cloudinary.uploader.upload(
      `${__dirname}/../uploads/${filename}`,
      {
        // Transformation options
        folder: "ProductImages",
        quality: "auto:good", // Auto-adjust quality for good compression
        format: "jpg", // Convert image to JPEG format (smaller size)
        width: 800, // Resize to max width of 800px (adjust as needed)
        height: 800, // Resize to max height of 800px (adjust as needed)
        crop: "limit", // Limit crop so that image keeps its aspect ratio
        public_id: `${filename}`,
      }
    );

    // console.log(imgUpload);
    // console.log(`${__dirname}/../uploads`);
    fs.unlinkSync(`${__dirname}/../uploads/${filename}`);
    return imgUpload;
  } catch (error) {
    console.log(error);
  }
};
const deleteImage = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(`productImages/${publicId}`);
    //   console.log('Image deleted:', result);
      return result;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };
  
module.exports = { uploadPhoto, uploadProductPhoto, deleteImage };