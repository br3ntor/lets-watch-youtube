import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import RoomsGrid from "../components/RoomsGrid";
import CreateRoom from "../components/CreateRoom";
import { useAuth } from "../libs/use-auth.js";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "25px",
  },
}));

export default function Home() {
  const { user } = useAuth();
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="md">
      {user ? (
        <>
          <h1>
            Welcome{" "}
            <Box component="span" color="primary.main">
              {user.name}
            </Box>
            , you may join a room or create your own.
          </h1>
          <Box textAlign="center" m={4}>
            <CreateRoom />
          </Box>
        </>
      ) : (
        <h1>Welcome, please sign in.</h1>
      )}
      <RoomsGrid />
    </Container>
  );
}
