import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@api/apiSlice";
import { RESOURCE } from "@/constants";

// create an entity adapter for notes, with a custom sort comparator
const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed
      ? RESOURCE.SORT_EQUAL
      : a.completed
      ? RESOURCE.SORT_FIRST_AFTER_SECOND
      : RESOURCE.SORT_FIRST_BEFORE_SECOND,
});

// get the initial state for the notes slice using the adapter
const initialState = notesAdapter.getInitialState();

// inject API endpoints for notes using the `apiSlice` from the app API
export const notesApiSlice = apiSlice.injectEndpoints({
  // define a `getNotes` endpoint with a `query` function
  endpoints: (builder) => ({
    getNotes: builder.query({
      // define the endpoint URL for the `getNotes` query
      query: () => RESOURCE.NOTE_URL,
      // define a custom response validation function
      validateStatus: (response, result) => {
        return response.status === RESOURCE.HTTP_STATUS_OK && !result.isError;
      },
      // specify how long to keep unused data in cache
      keepUnusedDataFor: RESOURCE.TIMEOUT_SECONDS,
      // define a custom response transformation function
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          // rename the `"_id"` property to `"id"`
          note.id = note._id;
          return note;
        });
        // use the adapter to set all loaded notes in the slice state
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      // define tags to associate with the query result
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          // create tags for each note and a tag for the entire list of notes
          return [
            { type: RESOURCE.NOTE, id: RESOURCE.LIST },
            ...result.ids.map((id) => ({ type: RESOURCE.NOTE, id })),
          ];
        }
        // create a tag for the entire list of notes
        else return [{ type: RESOURCE.NOTE, id: RESOURCE.LIST }];
      },
    }),
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: RESOURCE.NOTE_URL,
        method: "POST",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: [{ type: RESOURCE.NOTE, id: RESOURCE.LIST }],
    }),
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: RESOURCE.NOTE_URL,
        method: "PATCH",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: RESOURCE.NOTE, id: arg.id },
      ],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: RESOURCE.NOTE_URL,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: RESOURCE.NOTE, id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// create a memoized selector to select the result object of the `getNotes` query
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// create a memoized selector to select the normalized data from the notes slice state
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
);

// use the adapter to create selectors for the notes slice state
export const {
  // rename the `selectAll` selector to `selectAllNotes`
  selectAll: selectAllNotes,
  // rename the `selectById` selector to `selectNoteById`
  selectById: selectNoteById,
  // rename the `selectIds` selector to `selectNoteIds`
  selectIds: selectNoteIds,
  // pass in the `selectNotesData` selector as an argument to create the selectors
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
