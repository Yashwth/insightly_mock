import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const insightlyApi = createApi({
  reducerPath: 'insightlyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://app.insightlyanalytics.ai/hivelapi',
    prepareHeaders: (headers) => {
      headers.set('accept', '*/*');
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login/native',
        method: 'POST',
        body,
      }),
    }),

    
  }),
});

export const { useLoginMutation } = insightlyApi;



