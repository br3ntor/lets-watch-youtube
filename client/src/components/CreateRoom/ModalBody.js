import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%)`,
  },
}));

export default function ModalBody() {
  const history = useHistory();
  const classes = useStyles();

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
    <div className={classes.paper}>
      <h2 id="simple-modal-title">Create Room</h2>
      <p id="simple-modal-description">
        Gotta put a form here to add name to room object
      </p>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={createRoom}
      >
        Actually Create Room
      </Button>
    </div>
  );
}
