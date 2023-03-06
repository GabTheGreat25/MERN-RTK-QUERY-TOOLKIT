import { useGetNotesQuery } from "./notesApiSlice"; // Importing useGetNotesQuery hook from notesApiSlice file
import Note from "./Note"; // Importing Note component from Note file

const NotesList = () => {
  // Defining a component called NotesList
  const {
    // Using object destructuring to extract properties from the useGetNotesQuery hook response
    data: notes, // Renaming 'data' property to 'notes'
    isLoading, // Loading state for when the request is still pending
    isSuccess, // Success state for when the request is completed successfully
    isError, // Error state for when the request encounters an error
    error, // Error object containing the error message and status code
  } = useGetNotesQuery("notesList", {
    pollingInterval: 60000, // the interval (in milliseconds) to poll for new data from the server
    refetchOnFocus: true, // whether to refetch data from the server when the window is focused
    refetchOnMountOrArgChange: true, // whether to refetch data from the server when the component mounts or when the query arguments change
  });

  let content; // Declaring a variable called content to hold JSX content to be rendered

  if (isLoading) {
    // If isLoading is true, set the content variable to a paragraph element with the text 'Loading...'
    content = <p>Loading...</p>;
  }

  if (isError) {
    // If isError is true, set the content variable to a paragraph element with the error message from the error object
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    // If isSuccess is true, build a table with the notes data
    const { ids } = notes; // Using object destructuring to extract the ids property from the notes object

    const tableContent = ids?.length // Check if the ids array is not empty
      ? ids.map((noteId) => <Note key={noteId} noteId={noteId} />) // Map over the ids array to render a Note component for each id
      : null; // If the ids array is empty, set tableContent to null

    content = // Set content variable to a table element with table header and body rows
      (
        <table className="table table--notes">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th note__status">
                Username
              </th>
              <th scope="col" className="table__th note__created">
                Created
              </th>
              <th scope="col" className="table__th note__updated">
                Updated
              </th>
              <th scope="col" className="table__th note__title">
                Title
              </th>
              <th scope="col" className="table__th note__username">
                Owner
              </th>
              <th scope="col" className="table__th note__edit">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      );
  }

  return content; // Render the content variable, which will be one of the three options based on the current state of the useGetNotesQuery hook
};

export default NotesList; // Export the NotesList component for use in other files
