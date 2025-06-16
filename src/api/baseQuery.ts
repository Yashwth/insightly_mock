import { request, ClientError } from 'graphql-request';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const graphqlBaseQuery = () => {
  const baseUrl ='https://app.insightlyanalytics.ai/hivelapi'; // or however your env is set
  console.log("baseUrl",baseUrl);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log("use1231231231r",user.user?.authToken);
  return async ({ body }: { body: string }) => {
    const requestHeaders = new Headers();
    const authToken = user.user?.authToken;
    if (authToken) {
      requestHeaders.set('Authorization', `Bearer ${authToken}`);
      requestHeaders.set('UserId', user.user.id);
      requestHeaders.set('X-User-Id', user.user.id);
      requestHeaders.set('X-Access-Token', user.accessToken);
      requestHeaders.set('X-Organization-ID', user.user.organization?.id);
    }

    try {
      const result = await request(`${baseUrl}/graphql`, body, undefined, requestHeaders);
      return { data: result };
    } catch (error) {
      if (error instanceof ClientError) {
        const errorMessage = error.response.errors?.[0].message || '';
        if (errorMessage?.toLowerCase().includes('logout')) {
          return { error: { status: 401, data: errorMessage } };
        }
        return { error: { status: 500, data: errorMessage } };
      }
      return { error: { status: 500, data: error } };
    }
  };
};



export const baseQueryWithRedirection = fetchBaseQuery({
  baseUrl: 'https://app.insightlyanalytics.ai/hivelapi',
  prepareHeaders: (headers) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const accessToken = user.accessToken;

    if (user?.authToken) {
      headers.set('Authorization', `Bearer ${user.user.authToken}`);
      headers.set('UserId', user.user.id);
      headers.set('X-User-Id', user.user.id);
      headers.set('X-Access-Token', accessToken);
      headers.set('X-Organization-ID', user.user.organization?.id);
      headers.set('X-Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    return headers;
  },
});
