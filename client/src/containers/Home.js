import React from "react";

import { useAuth } from "../libs/use-auth.js";

console.log("Home imported");

export default function Home() {
  console.log("Home rendered.");

  const { user } = useAuth();

  return (
    <main id="home">
      <h1>Home Page</h1>
      {user ? <p>Hello {user.name}</p> : <p>I don't know you.</p>}
    </main>
  );
}
