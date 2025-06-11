
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { insightlyApi } from '../api/userService';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    [insightlyApi.reducerPath]: insightlyApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(insightlyApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch)
