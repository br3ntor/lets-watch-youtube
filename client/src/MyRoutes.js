// import { Route, Switch, Redirect } from "react-router-dom";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./containers/Home";
import LogIn from "./containers/LogIn";
import SignUp from "./containers/SignUp";
import Room from "./containers/Room";

import { useAuth } from "./libs/use-auth.js";

export default function MyRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      {/* <UnauthenticatedRoute path="/login" element={<LogIn />} /> */}
      {/* <PrivateRoute path="/room/:room" element={<Room />} /> */}
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

// Hoisted LOL, mad haters?
// function PrivateRoute({ children, ...rest }) {
//   const auth = useAuth();
//   return (
//     <Route
//       {...rest}
//       render={({ location }) =>
//         auth.user ? (
//           children
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/login",
//               state: { from: location },
//             }}
//           />
//         )
//       }
//     />
//   );
// }

// // FIXME: Fix this overly complicated flow...I think
// function UnauthenticatedRoute({ children, ...rest }) {
//   const auth = useAuth();
//   return (
//     <Route
//       {...rest}
//       render={({ location }) =>
//         !auth.user ? (
//           children
//         ) : (
//           <Redirect
//             to={{
//               pathname: location.state?.from.pathname || "/",
//               state: { from: location },
//             }}
//           />
//         )
//       }
//     />
//   );
// }
