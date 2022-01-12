import { createContext, useContext, useState, useEffect } from "react";

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);

  const getSession = async () => {
    try {
      const response = await fetch("/session");

      if (!response.ok) {
        console.log("Session not found.");
        return;
      }

      const data = await response.json();
      console.log("Session found.");
      setUser(data);
    } catch (e) {
      console.error(e);
    }
  };

  // TODO: Change these functions to reflect server, login/logout
  const login = async (username, password) => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // This will only work if theres one browser cookie to grab
          "CSRF-Token": document.cookie.split("=")[1],
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Sent:", { username, password });

      const data = await response.json();

      console.log("Received:", data);

      if (!data.error) {
        setUser(data);
        // Hmm not sure if I need the return actually
        // return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const signup = async (username, password) => {
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": document.cookie.split("=")[1],
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Sent:", { username, password });

      const data = await response.json();

      console.log("Received:", data);

      if (!data.error) {
        setUser(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // FIX: Inconsistency in app with names signup, login, logout, signout etc
  const logout = async () => {
    try {
      const response = await fetch("/logout");
      const data = await response.json();
      console.log(data);

      // false over null? but null is cool, I wonder what reasoning is
      setUser(false);

      // Reload on logout so if user does a signin or login after,
      // they will have a valid csrf token. I'm not sure if I want to
      // keep this way. Handleing this without a refresh would improve the UX
      // but atm I'm lazy and want to move on. My attitude is becoming, build
      // something big and buggy. But also bare minimum, they are becoming the same...
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  // Subscribe to user on mount
  useEffect(() => {
    console.log("Checking for session...");
    getSession();
  }, []);

  // Return the user object and auth methods
  return {
    user,
    setUser,
    signin: login,
    signup,
    signout: logout,
    getSession,
  };
}
