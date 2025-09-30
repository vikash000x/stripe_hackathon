// src/routes/user.routes.js
import express from 'express';
import multer from 'multer';
import { uploadResume } from '../controllers/user.controller.js';
import { getUserByEmail } from '../controllers/user.controller.js';
const router = express.Router();

// Multer setup: save file to local temp folder first
const upload = multer({ dest: 'uploads/' }); // ✅ saves file in /uploads

router.post('/upload-resume', upload.single('resume'), uploadResume);
router.get('/user', getUserByEmail);
export default router;
