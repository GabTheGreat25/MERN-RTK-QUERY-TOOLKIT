import { Link } from "react-router-dom"; // import the Link component from react-router-dom

const Welcome = () => {
  const date = new Date(); // create a new Date object
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Manila",
  };

  // create an options object to configure how the date should be formatted
  // these options specify that the date should be formatted to display the full weekday, year, month, day, hour, minute, and second
  // the timeZone option is set to "Asia/Manila" to display the date and time in the Philippine Standard Time (PST) time zone

  const formatter = new Intl.DateTimeFormat("en-US", options); // create a new Intl.DateTimeFormat object to format the date using the specified options

  const today = formatter.format(date); // format the current date using the formatter object and assign it to the today variable

  const content = (
    <section className="welcome">
      {/* a section with a class of "welcome" */}
      <p>{today}</p> {/* display the formatted date using the today variable */}
      <h1>Welcome!</h1> {/* a heading */}
      <p>
        <Link to="/dash/notes">View techNotes</Link>
        {/* a Link to the notes page */}
      </p>
      <p>
        <Link to="/dash/notes/new">Add New techNote</Link>
        {/* a Link to add a new note */}
      </p>
      <p>
        <Link to="/dash/users">View User Settings</Link>
        {/* a Link to the user settings page */}
      </p>
      <p>
        <Link to="/dash/users/new">Add New User</Link>
        {/* a Link to add a new user */}
      </p>
    </section>
  );

  return content; // return the content variable, which contains the JSX code for the Welcome component
};

export default Welcome;
