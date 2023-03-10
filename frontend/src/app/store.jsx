import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  // configure the Redux store using configureStore function
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Define a reducer property that uses the apiSlice.reducerPath and apiSlice.reducer.
    auth: authReducer, // Define a reducer for handling authentication actions
  },
  middleware: (
    getDefaultMiddleware // Define a middleware property that adds the apiSlice.middleware to the default middleware.
  ) => getDefaultMiddleware().concat(apiSlice.middleware), // use getDefaultMiddleware function to get the default middleware, then concatenate the middleware generated by apiSlice.middleware
  devTools: true, // Enable the Redux DevTools extension in the browser.
});

setupListeners(store.dispatch); // call setupListeners function with store.dispatch as argument to setup listeners for handling async actions
