import { Routes, Route } from "react-router-dom";
import Layouts from "@components/Layouts";
import Public from "@components/Public";
import DashLayout from "@components/DashLayout";
import Login from "@features/auth/Login";
import Welcome from "@features/auth/Welcome";
import NotesList from "@features/notes/NotesList";
import UsersList from "@features/users/UsersList";

// define the main app component
function App() {
  return (
    <Routes>
      {/* set the root path to the Layouts component */}
      <Route path="/" element={<Layouts />} />

      {/* set the index page to the Public component */}
      <Route index element={<Public />} />

      {/* set the path for the Login component */}
      <Route path="/login" element={<Login />} />

      {/* set the path for the Dashboard component */}
      <Route path="/dash" element={<DashLayout />}>
        {/* set the index page for the Dashboard */}
        <Route index element={<Welcome />} />

        {/* set the path for the NotesList component */}
        <Route path="notes">
          <Route index element={<NotesList />} />
        </Route>

        {/* set the path for the UsersList component */}
        <Route path="users">
          <Route index element={<UsersList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
