const cloudinary = require("cloudinary").v2;
const fs = require("fs");

console.log("[Cloudinary Config] Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("[Cloudinary Config] API Key:", process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING");
console.log("[Cloudinary Config] API Secret:", process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder = null) => {
  try {
    if (!localFilePath) {
      console.log("[Cloudinary] No file path provided");
      return null;
    }

    console.log("[Cloudinary] Attempting upload for:", localFilePath);
    const uploadOptions = {
      resource_type: "auto",
    };
    
    if (folder) {
      uploadOptions.folder = folder;
      console.log("[Cloudinary] Uploading to folder:", folder);
    }

    const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);
    console.log("[Cloudinary] Upload successful:", response.url);
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file
    return response;
  } catch (error) {
    console.error("[Cloudinary] Upload failed:", error.message);
    console.error("[Cloudinary] Full error:", error);
    // Try to remove the file even if upload failed
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (unlinkError) {
      console.error("[Cloudinary] Failed to delete temp file:", unlinkError.message);
    }
    return null;
  }
};

module.exports = { uploadOnCloudinary };
