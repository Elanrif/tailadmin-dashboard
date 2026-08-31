import environment from "@config/environment.config";

const { baseUrl, apiBaseUrl, apiProxyBase } = environment;

export const proxyEnvironment = {
  baseUrl,
  apiBaseUrl,
  apiProxyBase,
  api: {
    rest: {
      endpoints: {
        addresses: `/addresses`,
        comments: `/comments`,
        posts: `/posts`,
        login: `/auth/login`,
        signOut: `/auth/logout`,
        register: `/auth/register`,
        users: `/users`,
      },
    },
  },
};
