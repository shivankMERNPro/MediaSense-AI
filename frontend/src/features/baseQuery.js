import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { apiLogger } from "../utils/logger";
import { secureStorage } from "../utils/security";
import { logoutUser } from "./slices/userSlice";

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
};

const persistTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) secureStorage.set("authToken", accessToken);
  if (refreshToken) secureStorage.set("refreshToken", refreshToken);
};

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: "include",
  withCredentials: true,
  prepareHeaders: (headers) => {
    const token = secureStorage.get("authToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Accept", "application/json");
    headers.set("X-App-Version", "1.0.0");
    return headers;
  },
});

let refreshPromise = null;

const refreshAccessToken = async (api, extraOptions) => {
  if (!refreshPromise) {
    const refreshToken = secureStorage.get("refreshToken");
    if (!refreshToken) return null;

    refreshPromise = baseQuery(
      {
        url: "/api/v1/auth/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions,
    );
  }

  const refreshResult = await refreshPromise;
  refreshPromise = null;

  if (refreshResult?.data?.data) {
    persistTokens(refreshResult.data.data);
    return true;
  }

  secureStorage.clear();
  api.dispatch(logoutUser());
  return false;
};

export const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  try {
    apiLogger("Request", args);

    const isAuthEndpoint =
      typeof args.url === "string" && args.url.includes("/auth/");
    const isRefreshEndpoint =
      typeof args.url === "string" && args.url.includes("/auth/refresh");

    const accessToken = secureStorage.get("authToken");
    if (
      accessToken &&
      isTokenExpired(accessToken) &&
      !isAuthEndpoint &&
      !isRefreshEndpoint
    ) {
      const refreshed = await refreshAccessToken(api, extraOptions);
      if (!refreshed) {
        toast.error("Session expired. Please log in again.");
        secureStorage.clear();
        api.dispatch(logoutUser());
      }
    }

    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401 && !isRefreshEndpoint) {
      const refreshed = await refreshAccessToken(api, extraOptions);
      if (refreshed) {
        result = await baseQuery(args, api, extraOptions);
      } else {

        toast.error("Session expired. Please log in again.");
        secureStorage.clear();
        api.dispatch(logoutUser());

      }
    }

    if (result?.error && result.error.status !== 401) {
      const { status, data } = result.error;
      apiLogger("API Error", result.error);

      if (status === 0) {
        apiLogger("Network error, retrying request...");
        result = await baseQuery(args, api, extraOptions);
      } else if (data?.message) {
        toast.error(data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }

    return result;
  } catch (err) {
    apiLogger("Unexpected Error", err);
    toast.error("Unexpected error occurred.");
    return { error: { status: "CUSTOM_ERROR", data: err } };
  }
};
