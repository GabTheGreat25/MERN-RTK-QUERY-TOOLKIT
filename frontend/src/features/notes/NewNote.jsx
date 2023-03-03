// Importing the necessary dependencies and modules from react and redux
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

// Defining a functional component for the NewNote feature
const NewNote = () => {
  // Selecting all the users from the Redux store using the `useSelector` hook
  const users = useSelector(selectAllUsers);

  // If the users array is empty or undefined, return a message to the user
  if (!users?.length) return <p>Not Currently Available</p>;

  // Rendering the `NewNoteForm` component with the `users` array as a prop
  const content = <NewNoteForm users={users} />;

  // Returning the component to be rendered
  return content;
};

// Exporting the `NewNote` component as the default export of this module
export default NewNote;
