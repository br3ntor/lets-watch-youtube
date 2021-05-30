import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import { useFormFields } from "../../libs/use-formFields";
import { useAuth } from "../../libs/use-auth.js";

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
  form: {},
}));

export default function ModalBody() {
  const history = useHistory();
  const classes = useStyles();
  const { user, setUser } = useAuth();
  const [fields, handleFieldChange] = useFormFields({
    name: `${user.name}'s Room`,
  });

  async function createRoom(event) {
    event.preventDefault();
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      };
      const response = await fetch("/createroom", options);
      const room = await response.text();
      console.log(room);
      setUser((prev) => {
        return { ...prev, room: room };
      });
      history.push(`/room/${room}`);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h5">
        Room details:
      </Typography>
      <form className={classes.form} onSubmit={createRoom}>
        <TextField
          id="name"
          label="Room Name"
          margin="normal"
          fullWidth
          name="name"
          value={fields.name}
          onChange={handleFieldChange}
        />
        <Button type="submit" variant="contained" color="primary" size="large">
          Create Room
        </Button>
      </form>
    </div>
  );
}
