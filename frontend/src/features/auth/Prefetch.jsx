import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    // useEffect hook is used to initiate API requests when component is mounted
    console.log("subscribing");
    const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate()); // initiate API request for notes
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate()); // initiate API request for users

    return () => {
      // a cleanup function to cancel the API requests when the component is unmounted
      console.log("unsubscribing");
      notes.unsubscribe(); // cancel the notes API request
      users.unsubscribe(); // cancel the users API request
    };
  }, []);

  return <Outlet />; // return Outlet component from react-router-dom to render any child routes of the current route
};

export default Prefetch;
