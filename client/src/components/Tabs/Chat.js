import { useRef, useEffect } from "react";
import Typography from "@mui/material/Typography";
import makeStyles from '@mui/styles/makeStyles';

import MessageField from "./MessageField";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    flexGrow: 1,
    overflow: "auto",
    wordBreak: "break-all",
  },
  tabs: {
    "&  button": {
      [theme.breakpoints.up("sm")]: {
        minWidth: "125px", // This overides .MuiTab-root @media (min-width: 600px)
      },
    },
  },
  tabpanel: {
    height: `calc(100% - 48px)`,
  },
}));

export default function Chat({ connectionStatus, roomMessages, sendMessage }) {
  const classes = useStyles();
  const chatBox = useRef(null);

  useEffect(() => {
    if (chatBox.current) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  }, [roomMessages]);

  return (
    <>
      <div className={classes.root} ref={chatBox}>
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
      </div>
      <MessageField sendMessage={sendMessage} />
    </>
  );
}
