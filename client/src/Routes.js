import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Chat from "./containers/Chat";

export default function Routes({ setAuthenticatedUser }) {
  return (
    <Switch>
      <Route path="/login">
        <Login setUser={setAuthenticatedUser} />
      </Route>
      <Route path="/signup">
        <Signup setUser={setAuthenticatedUser} />
      </Route>
      <Route path="/chat">
        <Chat />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}
