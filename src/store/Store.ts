
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { insightlyApi } from '../api/userService';
import authReducer from './slices/authSlice';
import teamsReducer from './slices/teamSlice';
import { graphqlApi } from '../api/graphApi';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams:teamsReducer,
    

    [insightlyApi.reducerPath]: insightlyApi.reducer,
    [graphqlApi.reducerPath]: graphqlApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(insightlyApi.middleware)
  .concat(graphqlApi.middleware)
});

setupListeners(store.dispatch)
