import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
    message: {
      width: "100%",
    },
  },
}));

export default function MessageField({
  inputMessage,
  messageChanged,
  handleSendMessage,
}) {
  const classes = useStyles();

  return (
    <form
      className={classes.root}
      noValidate
      autoComplete="off"
      onSubmit={handleSendMessage}
    >
      <TextField
        fullWidth
        id="outlined-basic"
        name="message"
        label="Message"
        value={inputMessage}
        onChange={messageChanged}
        variant="outlined"
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        type="submit"
      >
        <SendIcon />
      </Button>
    </form>
  );
}
