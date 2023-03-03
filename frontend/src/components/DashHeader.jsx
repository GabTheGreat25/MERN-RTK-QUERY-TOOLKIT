import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";

// Define regular expressions for matching URLs
const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  // Declare variables for React hooks
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Declare variables for Redux hooks
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  // Define an effect to handle successful logout
  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  // Handle loading and error states
  if (isLoading) return <p>Logging Out...</p>;

  if (isError) return <p>Error: {error.data?.message}</p>;

  // Determine if the current URL matches any of the regular expressions
  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  // Define the logout button
  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  // Define the content to be displayed in the header
  const content = (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
        <nav className="dash-header__nav">
          {/* add more buttons later */}
          {logoutButton}
        </nav>
      </div>
    </header>
  );

  // Return the content to be rendered
  return content;
};

// Export the component as the default export
export default DashHeader;
