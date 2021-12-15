// import { Route, Switch, Redirect } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import LogIn from "./containers/LogIn";
import SignUp from "./containers/SignUp";
import Room from "./containers/Room";

import { useAuth } from "./libs/use-auth.js";

export default function MyRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      {/* <UnauthenticatedRoute path="/login" element={<LogIn />} /> */}
      <Route path="/signup" element={<SignUp />} />
      {/* <PrivateRoute path="/room/:room" element={<Room />} /> */}
    </Routes>
  );
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
