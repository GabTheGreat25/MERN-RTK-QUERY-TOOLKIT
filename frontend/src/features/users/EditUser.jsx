// Import the necessary dependencies from React and Redux
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
// Import the selectUserById selector function from the usersApiSlice file
import { selectUserById } from "./usersApiSlice";
// Import the EditUserForm component
import EditUserForm from "./EditUserForm";

// Create a functional component called EditUser
const EditUser = () => {
  // Retrieve the user id from the URL using the useParams hook from react-router-dom
  const { id } = useParams();
  // Retrieve the user object from the Redux store using the selectUserById selector function
  const user = useSelector((state) => selectUserById(state, id));
  // If the user object exists, render the EditUserForm component with the user as a prop, otherwise render a "Loading..." message
  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>;
  // Return the content variable
  return content;
};

// Export the EditUser component as the default export of this module
export default EditUser;
