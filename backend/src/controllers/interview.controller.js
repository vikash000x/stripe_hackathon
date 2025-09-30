// src/controllers/interview.controller.js
import * as interviewService from '../services/interview.service.js';
import { prisma } from '../config/db.js';

/**
 * POST /api/assessments/generate
 * Body: { userId, specs: [...] }  (specs = array of 6 {type, difficulty, topic?})
 */
export async function generateAssessment(req, res) {
  try {
    const { userId, specs } = req.body;
    if (!userId || !Array.isArray(specs) || specs.length !== 6) {
      return res.status(400).json({ error: 'userId and 6 specs required' });
    }
    const assessment = await interviewService.createAssessmentForUser(userId, specs);
    res.json({ assessment });
  } catch (err) {
    console.error('generateAssessment', err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/assessments/:id
 */
export async function getAssessment(req, res) {
  try {
    const { id } = req.params;
    const assessment = await interviewService.getAssessmentById(id);
    if (!assessment) return res.status(404).json({ error: 'Not found' });
    res.json({ assessment });
  } catch (err) {
    console.error('getAssessment', err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/assessments/:id/answer
 * body: { index, userAnswer, timeTakenSec }
 */
export async function submitAnswer(req, res) {
  try {
    const { id } = req.params;
    const { index, userAnswer, timeTakenSec } = req.body;
    const updated = await interviewService.submitAnswer(id, index, { userAnswer, timeTakenSec });
    res.json({ assessment: updated });
  } catch (err) {
    console.error('submitAnswer', err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/assessments/:id/auto-submit
 * body: { index }
 */
export async function autoSubmit(req, res) {
  try {
    const { id } = req.params;
    const { index } = req.body;
    const updated = await interviewService.autoSubmit(id, index);
    res.json({ assessment: updated });
  } catch (err) {
    console.error('autoSubmit', err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/assessments/:id/finish
 */
export async function finishAssessment(req, res) {
  try {
    const { id } = req.params;
    const result = await interviewService.finishAssessment(id);
    res.json(result);
  } catch (err) {
    console.error('finishAssessment', err);
    res.status(500).json({ error: err.message });
  }
}
