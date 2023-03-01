// Importing necessary React hooks and components
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

// Defining NewNoteForm component with props users
const NewNoteForm = ({ users }) => {
  // Using useAddNewNoteMutation hook to add a new note and getting the status and errors if any
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  // Using useNavigate hook to navigate to the notes page after successfully adding a new note
  const navigate = useNavigate();

  // Initializing state variables for title, text and userId using useState hook
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(users[0].id);

  // useEffect hook to clear the input fields and navigate to the notes page after successfully adding a new note
  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  // Event handler functions to update the title, text and userId state variables
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  // Determining if the form can be saved or not by checking if the input fields are not empty and isLoading is false
  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  // Event handler function to handle the form submission by calling addNewNote function to add a new note
  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ user: userId, title, text });
    }
  };

  // Mapping through the users array to create options for the select element
  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  // Determining the class for error message and input fields based on the status of isError and input fields respectively
  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const content = (
    <>
      {/*  Render error message if there is an error */}
      <p className={errClass}>{error?.data?.message}</p>
      {/* Render form with save button */}
      <form className="form" onSubmit={onSaveNoteClicked}>
        {/* Render title row with "New Note" heading and save button */}
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        {/* Render title input field */}
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />
        {/* Render text input field */}
        <label className="form__label" htmlFor="text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />
        {/* Render select input field for assigning note to a user */}
        <label
          className="form__label form__checkbox-container"
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <select
          id="username"
          name="username"
          className="form__select"
          value={userId}
          onChange={onUserIdChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default NewNoteForm;
