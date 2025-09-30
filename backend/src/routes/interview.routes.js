// src/routes/interview.routes.js
import express from 'express';
import {
  generateAssessment,
  getAssessment,
  submitAnswer,
  autoSubmit,
  finishAssessment
} from '../controllers/interview.controller.js';

const router = express.Router();

router.post('/assessments/generate', generateAssessment);
router.get('/assessments/:id', getAssessment);
router.post('/assessments/:id/answer', submitAnswer);
router.post('/assessments/:id/auto-submit', autoSubmit);
router.post('/assessments/:id/finish', finishAssessment);

export default router;
