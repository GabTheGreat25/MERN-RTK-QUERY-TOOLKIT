import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectNoteById } from "./notesApiSlice";

// Define a component that takes a noteId as a prop
const Note = ({ noteId }) => {
  // Use the useSelector hook to get the note with the specified noteId
  const note = useSelector((state) => selectNoteById(state, noteId));

  // Define an options object for formatting the date
  const options = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Manila",
  };

  // Use the useNavigate hook to get a navigation function for the current route
  const navigate = useNavigate();

  // If a note with the specified noteId exists
  if (note) {
    // Format the createdAt and updatedAt properties of the note using the options object
    const created = new Date(note.createdAt).toLocaleString("en-US", options);
    const updated = new Date(note.updatedAt).toLocaleString("en-US", options);

    // Define a handleEdit function that navigates to the edit page for the note
    const handleEdit = () => navigate(`/dash/notes/${noteId}`);

    // Render a table row with the note's status, creation date, update date, title, and author
    // Also include an edit button that calls the handleEdit function on click
    return (
      <tr className="table__row">
        <td className="table__cell note__status">
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Open</span>
          )}
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.username}</td>

        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else {
    // If no note with the specified noteId exists, return null
    return null;
  }
};

// Export the Note component as the default export of this module
export default Note;
