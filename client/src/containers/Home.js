import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import RoomsGrid from "../components/RoomsGrid";
import CreateRoomDialogButton from "../components/CreateRoom";

import { useAuth } from "../libs/use-auth.js";

export default function Home() {
  const { user } = useAuth();

  const roomNotCreated = ({ name }) => (
    <>
      <Typography variant="h3" gutterBottom>
        Welcome{" "}
        <Box component="span" color="primary.main">
          {name}
        </Box>
        , you may join a room or create your own.
      </Typography>
      <Box textAlign="center" m={4}>
        <CreateRoomDialogButton />
      </Box>
    </>
  );

  const roomCreated = ({ name }) => (
    <Typography variant="h3" gutterBottom>
      Welcome back{" "}
      <Box component="span" color="primary.main">
        {name}
      </Box>
      .
    </Typography>
  );

  return (
    <Container maxWidth="lg" sx={{ my: 2 }}>
      {user ? (
        user?.room ? (
          roomCreated(user)
        ) : (
          roomNotCreated(user)
        )
      ) : (
        <Typography variant="h2" gutterBottom>
          Welcome, please sign in.
        </Typography>
      )}
      <RoomsGrid />
    </Container>
  );
}
