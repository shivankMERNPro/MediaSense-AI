import axios from "axios";
import { secureStorage } from "./security";
import { store } from "../features/store";
import { logoutUser } from "../features/slices/userSlice";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

httpClient.interceptors.request.use((config) => {
  const token = secureStorage.get("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      secureStorage.clear();
      store.dispatch(logoutUser());
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);

export default httpClient;

