import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body,
      }),
    }),
    refresh: builder.mutation({
      query: (body) => ({
        url: "/api/v1/auth/refresh",
        method: "POST",
        body,
      }),
    }),
    oauthGoogle: builder.mutation({
      query: (body) => ({
        url: "/api/v1/auth/oauth/google",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useOauthGoogleMutation,
} = authApi;

export const authApiReducer = authApi.reducer;
export const authApiMiddleware = authApi.middleware;
export const authApiReducerPath = authApi.reducerPath;

