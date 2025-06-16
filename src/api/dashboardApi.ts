import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



// export const dashboardApi = createApi({
//     reducerPath: 'dashboardApi',
//     baseQuery: baseQueryWithRedirection,
//     endpoints: (builder) => ({
//         getMetricGraphData: builder.mutation({
//             query: ({ graphType, payload }) => ({
//                 url: `/graph/${graphType}`,
//                 method: 'POST',
//                 body: payload,
//             }),
//             transformResponse: (response: any) => response,
//         }),
//     }),
// });

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://app.insightlyanalytics.ai/hivelapi/' }),
    endpoints: (builder) => ({
      getMetricGraphData: builder.mutation({
        query: ({ body, token, userId, accessToken, graphtype }) => ({
          url: `graph/${graphtype}`,
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
      getOverviewMetricSummary: builder.mutation({
        query: ({ body, token, userId, accessToken }) => ({
          url: `/overview/v2/team/metric-summary`,
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
      getOverviewMetricGraphData: builder.mutation({
        query: ({ body, token, userId, accessToken }) => ({
          url: `/overview/v2/team/metric`,
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

export const { useGetMetricGraphDataMutation, useGetOverviewMetricSummaryMutation, useGetOverviewMetricGraphDataMutation } = dashboardApi;

