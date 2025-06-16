import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/RootState";

export const templatesApi = createApi({
  reducerPath: "templatesApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://app.insightlyanalytics.ai/hivelapi/dashboards/templates/org/1960",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.user?.user?.authToken;
      const accessToken = state.auth.user?.accessToken;
      const userId = state.auth.user?.user?.id;
      const orgId = state.auth.user?.user?.orgId;
      
      if (token) headers.set("authorization", `Bearer ${token}`);
      if (accessToken) headers.set("x-access-token", accessToken);
      if (userId) {
        headers.set("x-user-id", `${userId}`);
        headers.set("userid", `${userId}`);
      }
    headers.set("x-organization-id", `1960`);
      headers.set("content-type", "application/json");

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTemplates: builder.query<any, void>({
      query: () => "", // since all params come from Redux, no args needed
    }),
  }),
});

export const { useGetTemplatesQuery } = templatesApi;
