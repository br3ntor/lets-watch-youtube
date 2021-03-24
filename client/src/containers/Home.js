import React from "react";
import { useHistory } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../libs/use-auth.js";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "25px",
    textAlign: "center",
  },
}));

export default function Home() {
  const { user } = useAuth();
  const classes = useStyles();
  const history = useHistory();

  async function createRoom(event) {
    event.preventDefault();

    try {
      const response = await fetch("/createroom");
      const room = await response.text();
      console.log(room);
      history.push(`/room/${room}`);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Container className={classes.root} maxWidth="sm">
      {user ? (
        <>
          <h1>Hello {user.name}</h1>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={createRoom}
          >
            Create Room
          </Button>
        </>
      ) : (
        <h1>Welcome, please sign in.</h1>
      )}
    </Container>
  );
}
