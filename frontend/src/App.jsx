import { Routes, Route } from "react-router-dom";
import Layouts from "@components/Layouts";
import Public from "@components/Public";
import DashLayout from "@components/DashLayout";
import Login from "@features/auth/Login";
import Welcome from "@features/auth/Welcome";
import UsersList from "@features/users/UsersList";
import EditUser from "@features/users/EditUser";
import NewUserForm from "@features/users/NewUserForm";
import NotesList from "@features/notes/NotesList";
import EditNote from "@features/notes/EditNote";
import NewNote from "@features/notes/NewNote";
import Prefetch from "@features/auth/Prefetch";
import PersistLogin from "@features/auth/PersistLogin";
import RequireAuth from "@features/auth/RequireAuth";
import { RESOURCE } from "@/constants";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  RESOURCE.EMPLOYEE,
                  RESOURCE.MANAGER,
                  RESOURCE.ADMIN,
                ]}
              />
            }
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route
                  element={
                    <RequireAuth
                      allowedRoles={[RESOURCE.Manager, RESOURCE.Admin]}
                    />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>
              </Route>
              {/* End Dash */}
            </Route>
          </Route>
        </Route>
        {/* End Protected Routes */}
      </Route>
    </Routes>
  );
}

export default App;
