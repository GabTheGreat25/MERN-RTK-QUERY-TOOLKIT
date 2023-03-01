import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";

// Component for displaying a single user row in the table
const User = ({ userId }) => {
  // Get the user data from the Redux store using the selectUserById selector
  const user = useSelector((state) => selectUserById(state, userId));

  // Use the useNavigate hook to get the navigation function for going to the edit page
  const navigate = useNavigate();

  // If user data is available, render the user row with the edit button
  if (user) {
    // Define a function for handling the edit button click
    const handleEdit = () => {
      // Use the navigate function to go to the edit page for the current user
      navigate(`/dash/users/${userId}`);
    };

    // Convert the user's roles array to a string with comma-separated values
    const userRolesString = user.roles.toString().replaceAll(",", ", ");

    // Determine the CSS class for the cell status based on whether the user is active or not
    const cellStatus = user.active ? "" : "table__cell--inactive";

    // Render the user row with the user data and edit button
    return (
      <tr className="table__row user">
        <td className={`table__cell ${cellStatus}`}>{user.username}</td>
        <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  }
  // If user data is not available, do not render anything
  else {
    return null;
  }
};

export default User;
