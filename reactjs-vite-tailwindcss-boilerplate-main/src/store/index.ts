import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import candidateReducer from "./slices/candidateSlice";
import interviewReducer from "./slices/interviewSlices"
import dashboardReducer from "./slices/dashboardSlice";



const rootReducer = combineReducers({
  candidate: candidateReducer,
  interview: interviewReducer,
  dashboard: dashboardReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
