import React from "react";
import { useFormFields } from "../libs/hooksLib";
import { withRouter } from "react-router-dom";

function Signup(props) {
  const [fields, handleFieldChange] = useFormFields({
    username: "",
    password: "",
  });

  async function submitCredentials(event) {
    event.preventDefault();

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      console.log("Sent:", fields);

      const data = await response.json();

      console.log("Received:", data);

      if (!data.error) {
        props.setUser({ name: fields.username });
        props.history.push("/");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <main id="signup">
      <h1>Sign Up</h1>
      <form onSubmit={submitCredentials}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          onChange={handleFieldChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          onChange={handleFieldChange}
        />
        <button>Sign Up</button>
      </form>
    </main>
  );
}

export default withRouter(Signup);
