import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resetAssessment } from "./interviewSlices"; // import action

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
}

const initialState: Candidate = {
  id: "",
  name: "",
  email: "",
  phone: "",
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    setCandidate: {
      reducer: (state, action: PayloadAction<Candidate>) => {
        return action.payload;
      },
      prepare: (candidate: Candidate) => {
        return { payload: candidate };
      },
    },
    clearCandidate: () => initialState,
  },
});

export const { setCandidate, clearCandidate } = candidateSlice.actions;

// Optional: listener middleware or store subscription
export default candidateSlice.reducer;
