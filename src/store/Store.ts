
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { insightlyApi } from '../api/userService';
import authReducer from './slices/authSlice';
import teamsReducer from './slices/teamSlice';
import { graphqlApi } from '../api/graphApi';
import { goalApi } from '../api/goalApi';
import { dashboardApi } from '../api/dashboardApi';
import { templatesApi } from "../api/templates";
import cockpitReducer from './slices/cockpit';
import durationReducer from './slices/durationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams:teamsReducer,
    cockpit:cockpitReducer,
    duration:durationReducer,
    [goalApi.reducerPath]: goalApi.reducer,
    [insightlyApi.reducerPath]: insightlyApi.reducer,
    [graphqlApi.reducerPath]: graphqlApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [templatesApi.reducerPath]: templatesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(insightlyApi.middleware)
  .concat(graphqlApi.middleware)
  .concat(goalApi.middleware)
  .concat(dashboardApi.middleware)
  .concat(templatesApi.middleware)
});

setupListeners(store.dispatch)
