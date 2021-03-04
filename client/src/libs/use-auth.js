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
      const data = await response.json();
      console.log(data);
      setUser(data);
    } catch (e) {
      console.error(e);
    }
  };

  const signin = async (username, password) => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  // FIXME: Inconsistency in app with names signup, login, logout, signout etc
  const signout = async () => {
    try {
      const response = await fetch("/logout");
      const data = await response.json();
      console.log(data);
      // false over null? but null is cool, I wonder what reasoning is
      setUser(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Subscribe to user on mount
  useEffect(() => {
    getSession();
  }, []);

  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
  };
}
