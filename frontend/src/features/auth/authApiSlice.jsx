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
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
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
