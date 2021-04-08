import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import RoomGrid from "../components/RoomGrid";
import CreateRoom from "../components/CreateRoom";
import { useAuth } from "../libs/use-auth.js";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "25px",
    // paddingTop: theme.spacing(8),
    // paddingBottom: theme.spacing(8),
    // textAlign: "center",
  },
}));

export default function Home() {
  const { user } = useAuth();
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="md">
      {user ? (
        <>
          <h1>Hello {user.name}</h1>
          <CreateRoom />
        </>
      ) : (
        <h1>Welcome, please sign in.</h1>
      )}
      <RoomGrid />
    </Container>
  );
}
