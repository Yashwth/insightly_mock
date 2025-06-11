import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlBaseQuery } from './baseQuery';
import { gql } from 'graphql-request';
import { logout } from '../store/slices/authSlice';
import { Team } from '../types/Team';



// Define a service using a base URL and expected endpoints
export const graphqlApi = createApi({
    reducerPath: 'graphqlApi',
    baseQuery: graphqlBaseQuery(),
    endpoints: (builder) => ({
      getTeams: builder.query({
        query: ({ uid }) => ({
          body: gql`
            query {  
              getTeams(uid:${uid}) { 
                id
                name
                teamType
                userId
                teamCount
                ownerId
                parentTeamId
                authorIds
                teamOwnerUserName
                teamOwnerEmail
                teamOwnerName
              }
            }
          `
        }),
        transformResponse: (response: any) => {
            const teamsExcludingALL = response.getTeams
              ?.filter((item: any) => item.name !== 'ALL')
              .sort((a: any, b: any) =>
                a?.name?.toLowerCase() > b?.name?.toLowerCase() ? 1 : a?.name?.toLowerCase() < b?.name?.toLowerCase() ? -1 : 0
              );
            const teams = response.getTeams?.map((t: any, idx: number) => {
              return {
                ...t,
                check: teamsExcludingALL.length > 0 ? t?.name === teamsExcludingALL[0]?.name : idx === 0
              };
            });
            return teams as Team[];
          },
          async onQueryStarted(id, { dispatch, queryFulfilled }) {
            try {
              await queryFulfilled;
            } catch (err: any) {
              if (err?.error?.status === 401) {
                dispatch(logout());
              }
            }
          }
        }),
      }),
    })

export const {
    useGetTeamsQuery,
    useLazyGetTeamsQuery,
} = graphqlApi;