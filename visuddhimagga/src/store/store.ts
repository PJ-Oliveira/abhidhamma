// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import readingReducer from './slices/readingSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    reading: readingReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: true }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
