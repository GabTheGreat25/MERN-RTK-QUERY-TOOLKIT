import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { RESOURCE } from "@/constants";

const EditUserForm = ({ user }) => {
  // Initializing updateUser mutation function
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  // Initializing deleteUser mutation function
  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  // Initializing navigate function from react-router-dom
  const navigate = useNavigate();

  // Initializing state variables for username, password, roles, and active status
  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  // Validating username input
  useEffect(() => {
    setValidUsername(RESOURCE.USER_REGEX.test(username));
  }, [username]);

  // Validating password input
  useEffect(() => {
    setValidPassword(RESOURCE.PWD_REGEX.test(password));
  }, [password]);

  // When user is successfully updated or deleted, clear input fields and navigate to the user dashboard page
  useEffect(() => {
    console.log(isSuccess);
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  // Handling changes in the username input field
  const onUsernameChanged = (e) => setUsername(e.target.value);

  // Handling changes in the password input field
  const onPasswordChanged = (e) => setPassword(e.target.value);

  // Handling changes in the roles select field
  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };

  // Handling changes in the active checkbox field
  const onActiveChanged = () => setActive((prev) => !prev);

  // Handling submission of form to update user details
  const onSaveUserClicked = async (e) => {
    if (password) {
      await updateUser({ id: user.id, username, password, roles, active });
    } else {
      await updateUser({ id: user.id, username, roles, active });
    }
  };

  // Handling click event to delete a user
  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  // Creating options for roles select field
  const options = [RESOURCE.EMPLOYEE, RESOURCE.MANAGER, RESOURCE.ADMIN].map(
    (role) => {
      return (
        <option key={role} value={role}>
          {role}
        </option>
      );
    }
  );

  // Define a variable to store whether the form can be saved
  let canSave;

  // If a password has been entered, check that all required fields are valid and that the form is not currently loading
  if (password) {
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  }
  // Otherwise, check that all required fields are valid and that the form is not currently loading
  else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }

  // Define a class for error messages, which will be displayed if there is an error or delete error
  const errClass = isError || isDelError ? "errmsg" : "offscreen";

  // Define a class for invalid username inputs, which will add a visual indicator to the input field
  const validUserClass = !validUsername ? "form__input--incomplete" : "";

  // Define a class for invalid password inputs, which will add a visual indicator to the input field
  const validPwdClass =
    password && !validPassword ? "form__input--incomplete" : "";

  // Define a class for invalid roles inputs, which will add a visual indicator to the input field
  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : "";

  // Define an error message content variable, which will be displayed if there is an error or delete error
  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  // Define the content of the component
  const content = (
    <>
      {/*  // Display error message if isError or isDelError is true */}
      <p className={errClass}>{errContent}</p>
      {/* Create a form with a title and action buttons */}
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            {/* Save button */}
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave} // Disable button if canSave is false
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {/* Delete button */}
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        {/* Username input field */}
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
        {/* Password input field */}
        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[empty = no change]</span>{" "}
          <span className="nowrap">[4-12 chars incl. !@#$%]</span>
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
        {/* Active checkbox */}
        <label
          className="form__label form__checkbox-container"
          htmlFor="user-active"
        >
          ACTIVE:
          <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={active}
            onChange={onActiveChanged}
          />
        </label>
        {/* Roles selection field */}
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
          {options}
        </select>
      </form>
    </>
  );
  return content;
};
export default EditUserForm;
