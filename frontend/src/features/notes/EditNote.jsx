// Import the necessary functions and components from various libraries and files.
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNoteById } from "./notesApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";

// Define the EditNote component, which returns the content to be rendered on the page.
const EditNote = () => {
  // Use the useParams hook to extract the id parameter from the URL.
  const { id } = useParams();

  // Use the useSelector hook to retrieve the note and users objects from the Redux store using the appropriate selectors.
  const note = useSelector((state) => selectNoteById(state, id));
  const users = useSelector(selectAllUsers);

  // Use a conditional statement to check if both note and users objects exist before rendering the EditNoteForm component, passing in the note and users objects as props. Otherwise, display a loading message.
  const content =
    note && users ? (
      <EditNoteForm note={note} users={users} />
    ) : (
      <p>Loading...</p>
    );

  // Return the content to be rendered on the page.
  return content;
};

// Export the EditNote component as the default export.
export default EditNote;
