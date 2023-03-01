import { Routes, Route } from "react-router-dom";
import Layouts from "@components/Layouts";
import Public from "@components/Public";
import DashLayout from "@components/DashLayout";
import Login from "@features/auth/Login";
import Welcome from "@features/auth/Welcome";
import Prefetch from "@features/auth/Prefetch";
import UsersList from "@features/users/UsersList";
import EditUser from "@features/users/EditUser";
import NewUserForm from "@features/users/NewUserForm";
import NotesList from "@features/notes/NotesList";
import EditNote from "@features/notes/EditNote";
import NewNote from "@features/notes/NewNote";

// define the main app component
function App() {
  return (
    <Routes>
      {/* set the root path to the Layouts component */}
      <Route path="/" element={<Layouts />} />

      {/* set the index page to the Public component */}
      <Route index element={<Public />} />

      {/* set the path for the Login component */}
      <Route path="login" element={<Login />} />

      <Route element={<Prefetch />}>
        {/* set the path for the Dashboard component */}
        <Route path="dash" element={<DashLayout />}>
          {/* set the index page for the Dashboard */}
          <Route index element={<Welcome />} />

          {/* set the path for the NotesList component */}
          <Route path="notes">
            <Route index element={<NotesList />} />
            <Route path=":id" element={<EditNote />} />
            <Route path="new" element={<NewNote />} />
          </Route>

          {/* set the path for the UsersList component */}
          <Route path="users">
            <Route index element={<UsersList />} />

            <Route path=":id" element={<EditUser />} />
            <Route path="new" element={<NewUserForm />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
