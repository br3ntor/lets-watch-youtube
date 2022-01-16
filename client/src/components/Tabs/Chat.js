// Todo: This should be refactored to be able to handle large amounds of messages.
import { useRef, useEffect } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import MessageField from "./MessageField";

export default function Chat({ connectionStatus, roomMessages, sendMessage }) {
  const chatBox = useRef(null);

  useEffect(() => {
    if (chatBox.current) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  }, [roomMessages]);

  return (
    <Stack height={"100%"}>
      <Stack
        sx={{
          m: 1,
          flexGrow: 1,
          overflow: "auto",
          justifyContent: "flex-end",
        }}
      >
        <Box sx={{ overflow: "auto" }} ref={chatBox}>
          <Typography variant="h6" gutterBottom>
            Welcome to the chat
          </Typography>
          <Typography variant="body1" gutterBottom>
            The WebSocket is currently {connectionStatus}
          </Typography>
          {roomMessages.map((msg, i) => (
            <Typography variant="body1" gutterBottom key={i}>
              {msg}
            </Typography>
          ))}
        </Box>
      </Stack>
      <MessageField sendMessage={sendMessage} />
    </Stack>
  );
}
