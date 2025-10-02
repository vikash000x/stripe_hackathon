import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Question {
  id: string;
  text: string;
  type: "MCQ" | "MSQ" | "TEXT";
  options?: string[];
  difficulty?: "easy" | "medium" | "hard";
  userAnswer?: string | string[];
  scoreGiven?: number;
  exemplarAnswer?: string | null;
  timeLeftSec?: number;
  timeAllowedSec?: number;
  correctAnswer?: string | string[]; // for reference, not to be sent to backend
}

interface AssessmentState {
  id: string | null;
  questions: Question[];
  currentIndex: number;
  started: boolean;
  completed: boolean;
  totalScore: number;
  paused: boolean;
  aiSummary?: string | null;       // 🟡 added
  aiResult?: any;                  // 🟡 added
}

const initialState: AssessmentState = {
  id: null,
  questions: [],
  currentIndex: 0,
  started: false,
  completed: false,
  totalScore: 0,
  paused: false,
  aiSummary: null,
  aiResult: null,
};

const interviewSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
   setAssessment(state, action: PayloadAction<{ id: string; questions: Question[]; currentIndex?: number }>) {
  state.id = action.payload.id;
  state.questions = action.payload.questions.map(q => ({
    ...q,
    timeLeftSec: q.timeLeftSec ?? q.timeAllowedSec ?? 30,
  }));
  state.started = true;
  state.currentIndex = action.payload.currentIndex ?? 0; // restore exact index
  state.completed = false;
  state.paused = false;
}
,

    recordAnswer(state, action: PayloadAction<string | string[]>) {
      const q = state.questions[state.currentIndex];
      if (q) q.userAnswer = action.payload;
    },

    nextQuestion(state) {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex += 1;
      } else {
        state.completed = true;
      }
    },

    setScore(state, action: PayloadAction<number>) {
      state.totalScore = action.payload;
    },

    // 🟡 New: when finishAssessment API returns complete result
    setFinishedAssessment(
      state,
      action: PayloadAction<{
        id: string;
        questions: Question[];
        totalScore: number;
        aiSummary?: string;
        aiResult?: any;
      }>
    ) {
      state.id = action.payload.id;
      state.questions = action.payload.questions;
      state.totalScore = action.payload.totalScore;
      state.completed = true;
      state.aiSummary = action.payload.aiSummary || null;
      state.aiResult = action.payload.aiResult || null;
    },

    resetAssessment() {
      return initialState;
    },

    pauseAssessment(state) {
      state.paused = true;
    },

    resumeAssessment(state) {
      state.paused = false;
    },

    decrementTime(state) {
      const q = state.questions[state.currentIndex];
      if (q && q.timeLeftSec !== undefined) {
        q.timeLeftSec = Math.max(0, q.timeLeftSec - 1);
      }
    },

    setTime(state, action: PayloadAction<number>) {
      const q = state.questions[state.currentIndex];
      if (q) q.timeLeftSec = action.payload;
    },
  },
});

export const {
  setAssessment,
  recordAnswer,
  nextQuestion,
  setScore,
  setFinishedAssessment,
  resetAssessment,
  pauseAssessment,
  resumeAssessment,
  decrementTime,
  setTime,
} = interviewSlice.actions;

export default interviewSlice.reducer;
