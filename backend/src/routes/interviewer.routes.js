// src/routes/interviewer.routes.js
import express from 'express';
import { getDashboard, getCandidateDetail } from '../controllers/interviewer.controller.js';

const router = express.Router();

router.get('/dashboard', getDashboard);
router.get('/candidate/:userId', getCandidateDetail);

export default router;
