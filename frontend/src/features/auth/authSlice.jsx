import { createSlice } from "@reduxjs/toolkit";

// Create an authSlice using createSlice function from redux toolkit
const authSlice = createSlice({
  name: "auth",
  initialState: { token: null }, // Define the initial state with a property token that has a value of null.
  reducers: {
    // Define two reducers, setCredentials and logOut, as part of the reducers object.
    setCredentials: (state, action) => {
      const { accessToken } = action.payload; // Get the accessToken from the payload of the action.
      state.token = accessToken; // Set the state's token property to the accessToken.
    },
    logOut: (state, action) => {
      state.token = null; // Set the state's token property to null.
    },
  },
});

// Export the two reducers as named exports.
export const { setCredentials, logOut } = authSlice.actions;

// Export the authSlice.reducer as the default export.
export default authSlice.reducer;

// Define a selector function named selectCurrentToken that selects the auth slice's token property from the store's state.
export const selectCurrentToken = (state) => state.auth.token;
