// src/controllers/user.controller.js
import { prisma } from '../config/db.js';
import { uploadResumeToCloudinary } from '../services/resume.service.js';

export const uploadResume = async (req, res) => {
   try {

    console.log("bro i came to backend");
     const { name, email, phone } = req.body; // Removed to avoid redeclaration
    const file = req.file;
    console.log("File received:", req.file);
console.log("req.body:");
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
     if (!email) return res.status(400).json({ error: 'Email not found in resume' });

console.log('File received:');

    // 1️⃣ Upload resume to Cloudinary
    const resumeUrltt = await uploadResumeToCloudinary(file);


   // console.log('Resume uploaded to Cloudinary:', resumeUrltt);
    // 2️⃣ Parse resume PDF
   // const { name, email, phone } = await parseResume(file);

   

    // 3️⃣ Create or update user
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, phone, resumeUrl: resumeUrltt },
      create: { name, email, phone, resumeUrl: resumeUrltt },
    });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};


//GET /api/user?email=test@gmail.com
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        assessments: true
      }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
