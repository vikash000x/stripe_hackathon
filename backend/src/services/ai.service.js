// src/services/ai.service.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Helper to call Gemini (or chosen LLM).
 * Expects the LLM to return JSON when appropriate.
 */
async function callGemini(prompt, maxTokens = 800) {
  if (!GEMINI_API_URL || !GEMINI_API_KEY) {
    throw new Error('Gemini API config missing in env');
  }

  console.log("Calling Gemini with prompt...");

  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.2
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  console.log("Gemini response status:", res.status);

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini error: ${res.status} ${txt}`);
  }

  const data = await res.json();

  // ✅ Extract actual text from Gemini's structured response
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error("Unexpected Gemini response format:", data);
    throw new Error("Gemini response did not contain any text.");
  }

  return { text };  // <-- Return clean text only
}


/**
 * Generate 6 questions given types/difficulties
 * `specs`: [{ type: 'MCQ'|'MSQ'|'TEXT', difficulty: 1..6, topic?: string }]
 * Returns array of question objects that match your assessment JSON shape.
 */
export async function generateQuestions(specs = []) {
  // Build a prompt that asks the model to return strict JSON array.
  console.log("inside aiservice");
const instruction = `
You are an expert full-stack interviewer for React, Node.js, and JavaScript roles.
Produce a JSON array of question objects exactly in this shape (do NOT add extra fields):
[
  {
    "id": "<unique id>",
    "text": "<question text>",
    "type": "MCQ"|"MSQ"|"TEXT",
    "difficulty": 1,                // 1..6
    "timeAllowedSec": 20,           // compute from difficulty: 1-2 ->20, 3-4 ->40, 5-6 ->120
    "points": 10,
    "options": ["optA","optB"],    // only for MCQ/MSQ
    "correctAnswer": ["A"],        // array (single element for MCQ)
    "exemplarAnswer": "<short model answer>"
  }
]

Rules to ensure fresh questions:
- Each question must be **new and unique** (never repeated from previous batches).
- Include a balanced mix of React (~40%), Node.js (~30%), and JavaScript (~30%) questions.
- Randomize difficulty levels between 1 and 6.
- Keep questions concise and suitable for technical interviews.
- Use the provided ${JSON.stringify(specs)} if relevant.
Return **only valid JSON**. No extra fields, no comments outside JSON objects.
`;


  const specsText = JSON.stringify(specs);
  const prompt = `${instruction}\n\nSPEC: ${specsText}\n\nRespond with JSON only.`;
console.log("Prompt to Gemini:");
  const raw = await callGemini(prompt, 1200);

//  console.log("Gemini raw response:", raw);

  // Depending on provider, extract text -> parse JSON
  const text = raw?.text || raw?.output || JSON.stringify(raw);
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    // Try to extract JSON substring (robustness)
    const m = text.match(/\[.*\]/s);
    if (m) parsed = JSON.parse(m[0]);
    else throw new Error('Failed to parse Gemini response as JSON: ' + text.slice(0, 1000));
  }

  //console.log("Parsed questions:", parsed);

  // Basic normalization & safety: ensure timeAllowedSec present
  const normalized = parsed.map(q => {
    const difficulty = q.difficulty || 1;
    const timeAllowedSec = q.timeAllowedSec || (difficulty <= 2 ? 20 : difficulty <= 4 ? 40 : 120);
    const points = q.points || 10;
    return {
      id: q.id || `q_${Math.random().toString(36).slice(2,9)}`,
      text: q.text,
      type: q.type || 'TEXT',
      difficulty,
      timeAllowedSec,
      points,
      options: q.options || null,
      correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer : q.correctAnswer ? [q.correctAnswer] : [],
      exemplarAnswer: q.exemplarAnswer || null,
      userAnswer: null,
      userCode: null,
      timeTakenSec: null,
      scoreGiven: null,
      scoredBy: null,
      feedback: null
    };
  });

  //console.log("Normalized questions:", normalized);

  return normalized;
}

/**
 * Score a text answer using Gemini.
 * returns { score: 0..1, feedback: "..." }
 */
export async function scoreTextAnswer(exemplarAnswer, userAnswer) {
  const prompt = `
You are an expert interviewer grader. Given a model answer and a candidate answer, return a JSON object:
{"score": 0.0, "feedback": "short feedback text"}
Constraints:
- Score is a number between 0 and 1 (1 = perfect).
- Be concise in feedback.

MODEL_ANSWER:
${exemplarAnswer}

CANDIDATE_ANSWER:
${userAnswer}

Return only valid JSON.
`;
  const raw = await callGemini(prompt, 400);
  const text = raw?.text || raw?.output || JSON.stringify(raw);
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    const m = text.match(/\{.*\}/s);
    if (m) parsed = JSON.parse(m[0]);
    else {
      // fallback: naive scoring
      return { score: 0.5, feedback: 'Could not parse scoring. Please review.' };
    }
  }
  return {
    score: typeof parsed.score === 'number' ? Math.max(0, Math.min(1, parsed.score)) : 0,
    feedback: parsed.feedback || null
  };
}

/**
 * Summarize whole assessment and produce short summary + improvement tips.
 * Accepts assessment object (with questions, user answers, per-question scores).
 */
export async function summarizeAssessment(assessment) {
  const prompt = `
You are an expert interviewer. Given the following assessment JSON, produce a JSON object:
{
  "summary": "short 1-2 sentence summary of candidate performance",
  "improvementTip": "one concrete tip",
  "perQuestionNotes": [
    {"questionId": "q1", "note": "1-2 sentence note"}
  ]
}
Assessment:
${JSON.stringify(assessment, null, 2)}

Return only valid JSON.
`;
  const raw = await callGemini(prompt, 800);
  const text = raw?.text || raw?.output || JSON.stringify(raw);
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (err) {
    const m = text.match(/\{.*\}/s);
    if (m) return JSON.parse(m[0]);
    return { summary: 'No summary available', improvementTip: null, perQuestionNotes: [] };
  }
}

export default {
  generateQuestions,
  scoreTextAnswer,
  summarizeAssessment,
  callGemini
};
