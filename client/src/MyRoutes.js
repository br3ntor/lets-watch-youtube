// import { Route, Switch, Redirect } from "react-router-dom";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./containers/Home";
import LogIn from "./containers/LogIn";
import SignUp from "./containers/SignUp";
import Room from "./containers/Room";

import { useAuth } from "./libs/use-auth.js";

export default function MyRoutes() {
  // TODO: Refactor to pattern shown in docs
  // This routing works but a nested style is how all the examples show it in the docs.
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <UnauthenticatedRoute>
            <LogIn />
          </UnauthenticatedRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <UnauthenticatedRoute>
            <SignUp />
          </UnauthenticatedRoute>
        }
      />

      <Route
        path="/room/:room"
        element={
          <RequireAuth>
            <Room />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

function UnauthenticatedRoute({ children }) {
  let auth = useAuth();

  if (auth.user) {
    return <Navigate to="/" replace={true} />;
  }

  return children;
}
