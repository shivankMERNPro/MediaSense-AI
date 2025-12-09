import { secureStorage } from "./security";
import { setUserProfile, logoutUser } from "../features/slices/userSlice";

export const persistAuthSession = (dispatch, data) => {
  if (!data) return;
  if (data.accessToken) {
    secureStorage.set("authToken", data.accessToken);
  }
  if (data.refreshToken) {
    secureStorage.set("refreshToken", data.refreshToken);
  }
  if (data.user) {
    dispatch(setUserProfile(data.user));
  }
};

export const clearAuthSession = (dispatch) => {
  secureStorage.clear();
  dispatch(logoutUser());
};

