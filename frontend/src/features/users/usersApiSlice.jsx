// import necessary dependencies
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@api/apiSlice";
import { RESOURCE } from "@/constants";
// create an entity adapter for managing normalized state
// usersAdapter is initialized by calling createEntityAdapter() with no arguments,
// which creates an instance of the adapter with default configuration.
const usersAdapter = createEntityAdapter({}); //! In built CRUD for reduxjs toolkit

// set the initial state for the users slice of state
const initialState = usersAdapter.getInitialState();
//! This where the id, the content, and metadata / token is save coming from the backend as a state object

// create an api slice using the createApi method from @reduxjs/toolkit
export const usersApiSlice = apiSlice.injectEndpoints({
  // specify the endpoints for the api slice using a builder function
  endpoints: (builder) => ({
    //! builder brain of the query from toolkit
    // create a getUsers query endpoint
    getUsers: builder.query({
      // specify the endpoint url for the getUsers query
      query: () => RESOURCE.USER_URL,
      // validate the status of the response to ensure it is successful and not an error
      validateStatus: (response, result) => {
        return response.status === RESOURCE.HTTP_STATUS_OK && !result.isError;
      },
      // transform the response data by normalizing the data using the usersAdapter
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      // specify tags for the query result to improve performance
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          //? ids are the id of the users and you can change this to whatever you want
          return [
            { type: RESOURCE.USER, id: RESOURCE.LIST }, //! Handling multiple users return
            ...result.ids.map((id) => ({ type: RESOURCE.USER, id })),
          ];
        }
        //! Handling single user return
        else return [{ type: RESOURCE.USER, id: RESOURCE.LIST }];
      },
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: RESOURCE.USER_URL,
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: RESOURCE.USER, id: RESOURCE.LIST }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: RESOURCE.USER_URL,
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: RESOURCE.USER, id: arg.id },
      ],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: RESOURCE.USER_URL,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: RESOURCE.USER, id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// This selector uses the `select` function to get the query result object for the `getUsers` endpoint.
// The query result object contains data, error, isLoading, isFetching, and other properties related to the query.
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// create a memoized selector to get the normalized state object with ids & entities
const selectUsersData = createSelector(
  selectUsersResult, //? Memoization is a technique that caches the result of a function based on its input parameters to avoid redundant work and improve performance.
  (usersResult) => usersResult.data // normalized state object with ids & entities
); //! it waits for one data to be updated or deleted else do nothing

// create selectors for getting specific pieces of data from the normalized state
export const {
  selectAll: selectAllUsers, //? selectAll predefine from toolkit selectAllUsers is just a constant
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors(
  // pass in a selector function to get the users data from the state
  (state) => selectUsersData(state) ?? initialState
  //! Get the normalize data and show it to the user else when reload or error show it again
);
