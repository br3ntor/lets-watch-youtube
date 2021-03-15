import React, { useState, useRef, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import ReactPlayer from "react-player";

import MessageField from "../components/MessageField";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { useAuth } from "../libs/use-auth.js";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: `calc(100vh - 64px)`,
    // Fix for ReactPlayer creating overflow when loading in youtube video
    overflow: "hidden",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  video: {
    flexGrow: 1,
    background: "lightblue",
  },

  chat: {
    display: "flex",
    flexDirection: "column",
    width: "460px",
    [theme.breakpoints.down("md")]: {
      height: "70%",
      width: "unset",
    },
  },
  paper: {
    margin: theme.spacing(1),
    flexGrow: 1,
    overflow: "auto",
    wordBreak: "break-all",
  },
}));

// TODO: Can I force a refresh if websocket fails to connect? That might be nice.
export default function Chat() {
  const [inputMessage, setMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);
  const chatBox = useRef(null);
  const videoBox = useRef(null);
  const classes = useStyles();
  const { user } = useAuth();

  const socketUrl = `ws://${window.location.hostname}:4000`;

  // react-use-websocket hook
  // https://github.com/robtaussig/react-use-websocket#api
  // https://github.com/robtaussig/react-use-websocket#options
  const {
    // sendMessage,
    lastMessage,
    readyState,
    sendJsonMessage,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    shouldReconnect: () => true,
    reconnectAttempts: 5,
    onReconnectStop: () => window.location.reload(),
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

    sendJsonMessage({ chat: inputMessage });
    setMessage("");
  }

  function syncPlay() {
    sendJsonMessage({ play: true });
  }

  function syncPause() {
    sendJsonMessage({ play: false });
  }

  function sendTime(prog) {
    sendJsonMessage(prog);
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
        <ReactPlayer
          ref={videoBox}
          onPlay={syncPlay}
          onPause={syncPause}
          onProgress={sendTime}
          progressInterval={5000}
          controls
          url="https://www.youtube.com/watch?v=-ZVZgCrHy5E"
          width="100%"
          height="100%"
        />
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
