import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { RESOURCE } from "@/constants";

const NewUserForm = () => {
  // Define state and mutation hooks
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  // Define effects for validating input fields
  useEffect(() => {
    setValidUsername(RESOURCE.USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(RESOURCE.PWD_REGEX.test(password));
  }, [password]);

  // Define effect for resetting state and navigating on success
  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  // Define input field change handlers
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  // Define role selection change handler
  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions, // HTMLCollection
      (option) => option.value
    );
    setRoles(values);
  };

  // Define function to check if form can be saved
  const canSave =
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  // Define function to handle save button click
  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };

  // Define options for role selection dropdown
  const options = [RESOURCE.EMPLOYEE, RESOURCE.MANAGER, RESOURCE.ADMIN].map(
    (role) => {
      return (
        <option key={role} value={role}>
          {role}
        </option>
      );
    }
  );

  // Define CSS classes for error and incomplete fields
  const errClass = isError ? "errmsg" : "offscreen"; //offscreen hides it
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass = !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : "";

  const content = (
    <>
      {/*  Display an error message if there is an error */}
      <p className={errClass}>{error?.data?.message}</p>
      {/* Display a form for creating a new user */}
      <form className="form" onSubmit={onSaveUserClicked}>
        {/* Display the title of the form and a save button */}
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        {/* Display an input field for entering the username */}
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />
        {/* Display an input field for entering the password */}
        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={onPasswordChanged}
        />
        {/* Display a dropdown for selecting the roles */}
        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select
          id="roles"
          name="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {/* Display the options for the dropdown */}
          {options}
        </select>
      </form>
    </>
  );

  // Return the content
  return content;
};

// Export the component
export default NewUserForm;
