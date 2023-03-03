import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

// Define Login component
const Login = () => {
  // Create references for username input and error message element
  const userRef = useRef();
  const errRef = useRef();

  // Set initial states for username, password, and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Create necessary functions using React hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  // Set focus on username input when the component is mounted
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Reset error message when username or password changes
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call login API and get access token
      const { accessToken } = await login({ username, password }).unwrap();
      // Save access token to Redux store and reset username and password
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      // Navigate to dashboard page
      navigate("/dash");
    } catch (err) {
      // Handle error cases and set error message
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      // Set focus on error message element
      errRef.current.focus();
    }
  };

  // Handle user input for username
  const handleUserInput = (e) => setUsername(e.target.value);
  // Handle user input for password
  const handlePwdInput = (e) => setPassword(e.target.value);

  // Set error message class based on error message state
  const errClass = errMsg ? "errmsg" : "offscreen";

  // Return content based on isLoading state
  if (isLoading) return <p>Loading...</p>;

  // Define content for Login component
  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Sign In</button>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};
export default Login;
