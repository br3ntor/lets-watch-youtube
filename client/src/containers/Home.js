import React, { useContext } from "react";
import { UserContext } from "../App";

console.log("Home imported");

export default function Home() {
  console.log("Home rendered.");

  const user = useContext(UserContext);

  return (
    <main id="home">
      <h1>Home Page</h1>
      {user ? <p>Hello {user.name}</p> : <p>I don't know you.</p>}
    </main>
  );
}
