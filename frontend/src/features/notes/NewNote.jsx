import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
  // Get all users from the store
  const users = useSelector(selectAllUsers);

  // If users are not yet loaded, display a loading message
  // Otherwise, display the new note form with the list of users as a prop
  const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>;

  // Return the content to be displayed
  return content;
};

export default NewNote;
