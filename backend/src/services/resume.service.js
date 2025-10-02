// src/services/resume.service.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export async function uploadResumeToCloudinary(file) {
  console.log("Uploading to Cloudinary:", file.originalname);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      { resource_type: "auto", folder: "resumes" },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        // 🧹 Delete local temp file after successful upload
        fs.unlink(file.path, (err) => {
          if (err) console.error('Failed to delete temp file:', err);
        });

        resolve(result.secure_url);
      }
    );
  });
}
