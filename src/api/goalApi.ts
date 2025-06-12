import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const goalApi = createApi({
  reducerPath: 'goalApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://app.insightlyanalytics.ai/hivelapi/' }),
  endpoints: (builder) => ({
    getTeamMetrics: builder.mutation({
      query: ({ body, token, userId, accessToken }) => ({
        url: 'goals/team/metric',
        method: 'POST',
        body,
        headers: {
          'authorization': `Bearer ${token}`,
          'x-user-id': userId.toString(),
          'x-organization-id': '1960',
          'x-access-token': `${accessToken}`,
          'content-type': 'application/json',
          'userid': userId.toString(),
        },
      }),
    }),
    getAuthorMetrics: builder.mutation({
      query: ({ body, token, userId, accessToken }) => ({
        url: 'goals/author/metric',
        method: 'POST',
        body,
        headers: {
          'authorization': `Bearer ${token}`,
          'x-user-id': userId.toString(),
          'x-organization-id': '1960',
          'x-access-token': `${accessToken}`,
          'content-type': 'application/json',
          'userid': userId.toString(),
        },
      }),
    }),
  }),
});

export const { useGetTeamMetricsMutation, useGetAuthorMetricsMutation } = goalApi;
