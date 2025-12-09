import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  preferences: {},
  isLoggedIn: false,
};

//----------------------------------------
// User Slice
//    - Handles login/logout
//    - Updates profile and preferences
//----------------------------------------
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.profile = action.payload;
      state.isLoggedIn = true;
    },

    updateUserPreferences(state, action) {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    logoutUser(state) {
      state.profile = null;
      state.preferences = {};
      state.isLoggedIn = false;
    },
  },
});

//----------------------------------------
// Export actions to use in components
//----------------------------------------
export const { setUserProfile, updateUserPreferences, logoutUser } =
  userSlice.actions;

//-------------------------------------------------------------
// Export reducer for persisting or combining in rootReducer
//-------------------------------------------------------------
export const userSliceReduce = userSlice.reducer;
