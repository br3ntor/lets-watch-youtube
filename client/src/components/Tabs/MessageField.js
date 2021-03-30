import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/core/styles";

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
