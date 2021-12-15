import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import makeStyles from '@mui/styles/makeStyles';

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
  const navigate = useNavigate();
  const classes = useStyles();
  const { user, setUser } = useAuth();
  const [fields, handleFieldChange] = useFormFields({
    name: `${user.name}'s Room`,
    url: "",
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
      navigate(`/room/${room}`);
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
          required
        />
        <TextField
          id="url"
          label="Media URL"
          margin="normal"
          fullWidth
          name="url"
          value={fields.url}
          onChange={handleFieldChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" size="large">
          Create Room
        </Button>
      </form>
    </div>
  );
}
