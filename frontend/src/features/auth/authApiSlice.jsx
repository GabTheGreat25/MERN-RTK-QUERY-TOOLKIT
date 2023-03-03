import { apiSlice } from "../../app/api/apiSlice"; // Import the apiSlice from the apiSlice.js file in the app/api directory.
import { logOut } from "./authSlice"; // Import the logOut function from the authSlice.js file in the current directory.

// Create a new instance of the apiSlice with injectEndpoints method.
export const authApiSlice = apiSlice.injectEndpoints({
  // Define the endpoints object using the builder object.
  endpoints: (builder) => ({
    login: builder.mutation({
      // Define a login endpoint mutation that takes credentials as the argument.
      query: (credentials) => ({
        url: "/api/v1/auth", // Set the URL for the login endpoint.
        method: "POST", // Set the HTTP method for the login endpoint.
        body: { ...credentials }, // Set the body of the request to the provided credentials.
      }),
    }),
    sendLogout: builder.mutation({
      // Define a sendLogout endpoint mutation.
      query: () => ({
        url: "/api/v1/auth/logout", // Set the URL for the sendLogout endpoint.
        method: "POST", // Set the HTTP method for the sendLogout endpoint.
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Define an onQueryStarted function to handle the query lifecycle events.
        try {
          await queryFulfilled; // Wait for the query to complete successfully.
          dispatch(logOut()); // Dispatch the logOut action to update the auth state.
          dispatch(apiSlice.util.resetApiState()); // Reset the api state to clear any errors.
        } catch (err) {
          console.log(err); // Log any errors that occur during the query lifecycle.
        }
      },
    }),
    refresh: builder.mutation({
      // Define a refresh endpoint mutation.
      query: () => ({
        url: "/api/v1/auth/refresh", // Set the URL for the refresh endpoint.
        method: "GET", // Set the HTTP method for the refresh endpoint.
      }),
    }),
  }),
});

// Export the useLoginMutation, useSendLogoutMutation, and useRefreshMutation hooks from the authApiSlice.
export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
