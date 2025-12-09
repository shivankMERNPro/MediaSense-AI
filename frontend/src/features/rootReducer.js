import { combineReducers } from "@reduxjs/toolkit";
import persistors from "./persistors";

import {
  dashboardApiReducer,
  dashboardApiReducerPath,
} from "./apiSlices/dashboardApis";
import {
  authApiReducer,
  authApiReducerPath,
} from "./apiSlices/authApi";


// ----------------------------------------------------
//  Combine all reducers into one root reducer
//     - Include persisted slices
//     - Include RTK Query slices (usually not persisted)
// ----------------------------------------------------
const rootReducer = combineReducers({
  ...persistors,
  [dashboardApiReducerPath]: dashboardApiReducer,
  [authApiReducerPath]: authApiReducer,
});

export default rootReducer;
