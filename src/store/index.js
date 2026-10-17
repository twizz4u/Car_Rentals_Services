import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "./adminApi";

// The admin data store. For now the only slice is the RTK Query cache, which
// owns every figure the admin pages read from the API. Auth/session state
// deliberately stays in AuthContext + sessionStorage: the token is what the
// api slice reads to authorise its requests, not something it stores.
export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
});
