import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function MessageField({ sendMessage }) {
  const [message, setMessage] = useState("");
  const classes = useStyles();

  function handleChange(event) {
    setMessage(event.target.value);
  }

  return (
    <form
      className={classes.root}
      noValidate
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        sendMessage(message);
        setMessage("");
      }}
    >
      <TextField
        fullWidth
        id="outlined-basic"
        name="message"
        label="Message"
        value={message}
        onChange={handleChange}
        variant="outlined"
      />
      <Button variant="contained" color="primary" type="submit">
        <SendIcon />
      </Button>
    </form>
  );
}
