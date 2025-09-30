// src/services/resume.service.js

import cloudinary from '../config/cloudinary.js';


// Extract fields from text (same as before)




// Upload file to Cloudinary
export async function uploadResumeToCloudinary(file) {
  console.log("Uploading to Cloudinary:", file.originalname);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      { resource_type: "auto", folder: "resumes" },
      (error, result) => {
          console.log("Cloudinary upload result:", result);
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
  });
}
