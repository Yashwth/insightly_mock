
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { insightlyApi } from '../api/userService';
import authReducer from './slices/authSlice';
import teamsReducer from './slices/teamSlice';
import { graphqlApi } from '../api/graphApi';
import { goalApi } from '../api/goalApi';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams:teamsReducer,
    
    [goalApi.reducerPath]: goalApi.reducer,
    [insightlyApi.reducerPath]: insightlyApi.reducer,
    [graphqlApi.reducerPath]: graphqlApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(insightlyApi.middleware)
  .concat(graphqlApi.middleware)
  .concat(goalApi.middleware)
});

setupListeners(store.dispatch)
