import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CandidateSummary {
  id: string;
  name: string;
  score: number;
  summary: string;
}

interface DashboardState {
  candidates: CandidateSummary[];
}

const initialState: DashboardState = {
  candidates: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    addCandidateSummary: (state, action: PayloadAction<CandidateSummary>) => {
      state.candidates.push(action.payload);
    },
    sortCandidates: (state) => {
      state.candidates.sort((a, b) => b.score - a.score);
    },
  },
});

export const { addCandidateSummary, sortCandidates } = dashboardSlice.actions;
export default dashboardSlice.reducer;
