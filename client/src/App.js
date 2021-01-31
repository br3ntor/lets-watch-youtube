import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import "./App.css";

import Routes from "./Routes";

export const UserContext = React.createContext();

function App(props) {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    getSession();
  }, []);

  async function getSession() {
    try {
      const response = await fetch("/session");
      const data = await response.json();
      console.log(data);
      setAuthenticatedUser({ name: data.name });
    } catch (e) {
      console.error(e);
    }
  }

  async function logOut() {
    try {
      const response = await fetch("/logout");
      const data = await response.json();
      console.log(data);
      setAuthenticatedUser(null);
      props.history.push("/");
    } catch (e) {
      console.error(e);
    }
  }

  const signedIn = (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/chat">Chat</Link>
      </li>
      <li>
        {/* FIXME: Temp solution anyways right? */}
        <a href="#" onClick={logOut}>
          Logout
        </a>
      </li>
    </ul>
  );

  const notSignedIn = (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/login">Log In</Link>
      </li>
      <li>
        <Link to="/signup">Sign Up</Link>
      </li>
    </ul>
  );

  const navLinks = authenticatedUser ? signedIn : notSignedIn;

  return (
    <div>
      <nav>{navLinks}</nav>

      <UserContext.Provider value={authenticatedUser}>
        <Routes setAuthenticatedUser={setAuthenticatedUser} />
      </UserContext.Provider>
    </div>
  );
}

// TODO: Figure how how to send this down through all routes
export default withRouter(App);
