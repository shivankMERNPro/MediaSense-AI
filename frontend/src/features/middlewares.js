import { dashboardApiMiddleware } from "./apiSlices/dashboardApis";
import { authApiMiddleware } from "./apiSlices/authApi";

const middlewares = (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false, // Disable for RTK Query cache + redux-persist
  }).concat(authApiMiddleware, dashboardApiMiddleware);

export default middlewares;
