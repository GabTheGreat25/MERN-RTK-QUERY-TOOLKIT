import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

// Import the configureStore function from the @reduxjs/toolkit package, and the apiSlice from the apiSlice.js file.

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Define a reducer property that uses the apiSlice.reducerPath and apiSlice.reducer.

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // Define a middleware property that adds the apiSlice.middleware to the default middleware.

  devTools: true,
  // Enable the Redux DevTools extension in the browser.
});
