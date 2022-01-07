import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

export default function MessageField({ sendMessage }) {
  const [message, setMessage] = useState("");

  function handleChange(event) {
    setMessage(event.target.value);
  }

  return (
    <Stack
      m={1}
      spacing={1}
      direction="row"
      component="form"
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
    </Stack>
  );
}
