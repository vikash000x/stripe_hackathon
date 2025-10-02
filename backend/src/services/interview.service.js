// src/services/interview.service.js
import { prisma } from '../config/db.js';
import aiService from './ai.service.js';

/**
 * Create an assessment for a user with generated questions.
 * `specs` is array describing desired 6 questions [{type,difficulty,topic?},...]
 */
export async function createAssessmentForUser(userId, specs) {
  // generate questions via AI
  console.log("inside service");
   const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error(`User with id ${userId} does not exist`);

  const questions = await aiService.generateQuestions(specs);

  const assessment = await prisma.assessment.create({
    data: {
      userId,
      qaData: questions,
      totalScore: 0
    }
  });
  console.log("assessment",assessment);
  return assessment;
}

/**
 * Load assessment
 */
export async function getAssessmentById(id) {
  return prisma.assessment.findUnique({ where: { id } });
}

/**
 * Submit an answer (manual submit)
 * index is question index in the qaData array
 */
export async function submitAnswer(assessmentId, index, answerPayload) {
  const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) throw new Error('Assessment not found');

  const qa = Array.isArray(assessment.qaData) ? [...assessment.qaData] : [];
  const q = qa[index];
  if (!q) throw new Error('Question not found at index ' + index);

  // update fields
  q.userAnswer = answerPayload.userAnswer ?? q.userAnswer;
  q.timeTakenSec = answerPayload.timeTakenSec ?? q.timeTakenSec;

  // auto-score MCQ/MSQ here
  let score = null;
  if (q.type === 'MCQ') {
  const correct = q.correctAnswer && q.correctAnswer[0];
  const userLetter = String.fromCharCode(65 + q.options.indexOf(answerPayload.userAnswer)); // 65 = 'A'
  
  score = (userLetter === correct) ? q.points : 0;
  q.scoreGiven = score;
  q.scoredBy = 'AUTO';
  q.feedback = score === q.points ? 'Correct' : 'Incorrect';
}
  else if (q.type === 'MSQ') {
  const user = Array.isArray(answerPayload.userAnswer) ? answerPayload.userAnswer : [];

  // Convert user selected text into letters (A, B, C...)
  const userLetters = user.map(opt => String.fromCharCode(65 + q.options.indexOf(opt)));

  const correctSet = new Set(q.correctAnswer || []);
  const userSet = new Set(userLetters);

  // ✅ All-or-nothing scoring:
  // 1. The sets must be the same size.
  // 2. Every correct answer must be in user's answers.
  const isExactMatch =
    userSet.size === correctSet.size &&
    [...correctSet].every(letter => userSet.has(letter));

  score = isExactMatch ? q.points : 0;
  q.scoreGiven = score;
  q.scoredBy = 'AUTO';
  q.feedback = isExactMatch
    ? 'Correct'
    : `Incorrect — expected ${[...correctSet].join(', ')}`;
}
 else if (q.type === 'TEXT') {
    // call AI to score
    const exemplar = q.exemplarAnswer || '';
    const { score: aiScore, feedback } = await aiService.scoreTextAnswer(exemplar, answerPayload.userAnswer || '');
    score = Math.round(q.points * aiScore * 100) / 100;
    q.scoreGiven = score;
    q.scoredBy = 'AI';
    q.feedback = feedback;
  } else {
    // default
    q.scoreGiven = 0;
    q.scoredBy = 'AUTO';
  }

  qa[index] = q;

  // compute totalScore
  const totalScore = qa.reduce((s, it) => s + (it.scoreGiven || 0), 0);

  // persist update
  const updated = await prisma.assessment.update({
    where: { id: assessmentId },
    data: {
      qaData: qa,
      totalScore
    }
  });

  return updated;
}

/**
 * Auto-submit when timeouts happen:
 * we just record an empty or partial answer and score accordingly (usually 0)
 */
export async function autoSubmit(assessmentId, index) {
  return submitAnswer(assessmentId, index, { userAnswer: null, timeTakenSec: null });
}

/**
 * Finish assessment: produce final summary (AI) and finalize total score
 */
export async function finishAssessment(assessmentId) {
  const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) throw new Error('Assessment not found');

  // Ensure per-question scoring for any unanswered text questions by scoring empty answers
  const qa = Array.isArray(assessment.qaData) ? [...assessment.qaData] : [];
  for (let i = 0; i < qa.length; i++) {
    const q = qa[i];
    if (q.scoreGiven == null) {
      // auto-score empty or run scoring (if TEXT -> AI)
      if (q.type === 'TEXT') {
        const { score: aiScore, feedback } = await aiService.scoreTextAnswer(q.exemplarAnswer || '', q.userAnswer || '');
        q.scoreGiven = Math.round(q.points * aiScore * 100) / 100;
        q.scoredBy = 'AI';
        q.feedback = feedback;
      } else if (q.type === 'MCQ' || q.type === 'MSQ') {
        // give zero if no answer
        q.scoreGiven = 0;
        q.scoredBy = 'AUTO';
        q.feedback = 'No answer';
      } else {
        q.scoreGiven = 0;
        q.scoredBy = 'AUTO';
      }
    }
    qa[i] = q;
  }

  const totalScore = qa.reduce((s, it) => s + (it.scoreGiven || 0), 0);

  // ask AI to produce summary & tips
  const aiResult = await aiService.summarizeAssessment({ qa, totalScore });

  const updated = await prisma.assessment.update({
    where: { id: assessmentId },
    data: {
      qaData: qa,
      totalScore,
      aiSummary: aiResult?.summary || null
    }
  });

  return { assessment: updated, aiResult };
}
