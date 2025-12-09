import { configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";

import rootReducer from "./rootReducer";
import middlewares from "./middlewares";
import env from "../consts/env";

export const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares,
  devTools: env.mode !== "production",
});

export const persistor = persistStore(store);
export default store;
