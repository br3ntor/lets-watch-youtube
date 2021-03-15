import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./containers/Home";
import LogIn from "./containers/LogIn";
import SignUp from "./containers/SignUp";
import Chat from "./containers/Chat";

import { useAuth } from "./libs/use-auth.js";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute path="/login">
        <LogIn />
      </UnauthenticatedRoute>
      {/* <Route path="/login">
        <LogIn />
      </Route> */}
      <Route path="/signup">
        <SignUp />
      </Route>
      <PrivateRoute path="/chat">
        <Chat />
      </PrivateRoute>
      {/* <Route path="/">
        <Home />
      </Route> */}
    </Switch>
  );
}

// Hoisted LOL, mad haters?
function PrivateRoute({ children, ...rest }) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

// FIXME: Fix this overly complicated flow...I think
function UnauthenticatedRoute({ children, ...rest }) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: location.state?.from.pathname || "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
