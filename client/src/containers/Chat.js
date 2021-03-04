import React, { useState, useRef, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import MessageField from "../components/MessageField";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { useAuth } from "../libs/use-auth.js";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    // height: "calc(100vh - theme.mixins.toolbar["@media (min-width:600px)"].minHeight)",
    // height: "calc(100vh - 64px)",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  video: {
    flexGrow: 4,
    background: "lightblue",
    [theme.breakpoints.down("md")]: {
      flexGrow: 1,
    },
  },
  chat: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 64px)",
    flexGrow: 1,
    // background: "lightgreen",
    [theme.breakpoints.down("md")]: {
      flexGrow: 3,
    },
  },
  paper: {
    margin: theme.spacing(1),
    flexGrow: 1,
    overflow: "auto",
  },
}));

export default function Chat() {
  const [inputMessage, setMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);
  const chatBox = useRef(null);
  const classes = useStyles();
  const { user } = useAuth();

  const socketUrl = `ws://${window.location.hostname}:4000`;

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    console.log("lastmessage:", lastMessage);
    // FIXME: Do I need lastMessage && here? where did this line come from?
    lastMessage && setRoomMessages((prev) => prev.concat(lastMessage.data));
  }, [lastMessage]);

  useEffect(() => {
    chatBox.current.scrollTop = chatBox.current.scrollHeight;
  }, [roomMessages]);

  function messageChanged(event) {
    setMessage(event.target.value);
  }

  function handleSendMessage(event) {
    event.preventDefault();

    if (!user) {
      console.log("Not logged in");
      return;
    }

    sendMessage(inputMessage);
    setMessage("");
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className={classes.root}>
      <div className={classes.video}>
        <iframe
          title="poopy"
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/y8mAWYVwfEc"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className={classes.chat}>
        <Paper elevation={0} className={classes.paper} ref={chatBox}>
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
        </Paper>
        <MessageField
          inputMessage={inputMessage}
          messageChanged={messageChanged}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
