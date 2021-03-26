import React, { useState, useRef, useEffect } from "react";

import { useParams, useHistory } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import ReactPlayer from "react-player";
import { makeStyles } from "@material-ui/core/styles";

import Chat from "../components/Chat";
import { useAuth } from "../libs/use-auth.js";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: `calc(100vh - 64px)`,
    overflow: "hidden", // Fix for ReactPlayer creating overflow when loading in youtube video
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

export default function Room() {
  const [inputMessage, setMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const videoBox = useRef(null);
  const classes = useStyles();
  const { user } = useAuth();
  const { room } = useParams();
  const history = useHistory();

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/watch?v=TEJMdMwMJCs"
  );

  const socketUrl = `ws://${window.location.hostname}:4000/${room}`;

  const userIsHost =
    user.id.split("-").slice(-1)[0] ===
    history.location.pathname.split("/").slice(-1)[0]
      ? true
      : undefined;

  /**
   * react-use-websocket hook
   * https://github.com/robtaussig/react-use-websocket#api
   * https://github.com/robtaussig/react-use-websocket#options
   */
  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("opened"),
      shouldReconnect: () => true,
      reconnectAttempts: 1,
      onReconnectStop: () => {
        // There seem to be a few ways I could do this...
        history.push("/");
        window.location.reload();
      },
    }
  );

  // TODO: Change some of these names, like lastJsonMessage.connected doesn't reflect that its a string of a username
  useEffect(() => {
    console.log("lastJsonMessage", lastJsonMessage);

    // Checking if object exists and has keys
    if (lastJsonMessage && Object.keys(lastJsonMessage).length > 0) {
      if (lastJsonMessage.hasOwnProperty("connected")) {
        setRoomMessages((prev) =>
          prev.concat(`${lastJsonMessage.connected} has connected.`)
        );

        // Skip if connected message is for user since I get that on initial connection
        if (lastJsonMessage.connected !== user.name) {
          setMembers((prev) => prev.concat(lastJsonMessage.connected));
        }
      }

      if (lastJsonMessage.hasOwnProperty("disconnected")) {
        setRoomMessages((prev) =>
          prev.concat(`${lastJsonMessage.disconnected} has disconnected.`)
        );

        // Skip if connected message is for user since I get that on initial connection
        if (lastJsonMessage.disconnected !== user.name) {
          setMembers((prev) => {
            const leavingUser = prev.indexOf(lastJsonMessage.disconnected);
            const updatedList = [...prev];
            updatedList.splice(leavingUser, 1);
            return updatedList;
          });
        }
      }

      // users prop comes on the object sent on connection or disconnect
      if (lastJsonMessage.hasOwnProperty("users")) {
        setMembers(lastJsonMessage.users);
      }

      if (lastJsonMessage.hasOwnProperty("chat")) {
        setRoomMessages((prev) =>
          prev.concat(`[${lastJsonMessage.username}]: ${lastJsonMessage.chat}`)
        );
      }

      // This also sets the host, so host sends, recieves this
      // (like a chat message) then the prop is set, not sure
      // if I should do this or only if not host...
      if (lastJsonMessage.hasOwnProperty("play")) {
        setIsPlaying(lastJsonMessage.play);
      }

      if (lastJsonMessage.hasOwnProperty("currentTime") && !userIsHost) {
        const clientsTime = videoBox.current.getCurrentTime();
        const inSync = Math.abs(lastJsonMessage.currentTime - clientsTime) < 2;

        if (!inSync) {
          videoBox.current.seekTo(lastJsonMessage.currentTime);
        } else {
          console.log("Video synced to within 2 seconds.");
        }
      }

      // Revieve and set video url
      if (lastJsonMessage.videoUrl) {
        setVideoUrl(lastJsonMessage.videoUrl);
      }
    }
  }, [lastJsonMessage, userIsHost, user]);

  function messageChanged(event) {
    setMessage(event.target.value);
  }

  function handleSendMessage(event) {
    event.preventDefault();

    if (!user) {
      console.log("Not logged in");
      return;
    }

    // sendJsonMessage({ chat: inputMessage });
    sendJsonMessage({
      type: "chat",
      data: inputMessage,
    });
    setMessage("");
  }

  /**
   * Video messages that host will send to server to in turn
   * send to clients to sync with the host.
   */
  function sendPlay() {
    sendJsonMessage({ play: true });
  }

  function sendPause() {
    sendJsonMessage({ play: false });
  }

  function sendTime(prog) {
    sendJsonMessage(prog);
  }

  function sendVideoUrl(url) {
    if (userIsHost) {
      sendJsonMessage({
        videoUrl: url,
      });
    }
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
          onPlay={userIsHost && sendPlay}
          onPause={userIsHost && sendPause}
          onProgress={userIsHost && sendTime}
          playing={isPlaying}
          progressInterval={5000}
          controls
          url={videoUrl}
          width="100%"
          height="100%"
        />
      </div>
      <div className={classes.chat}>
        <Chat
          connectionStatus={connectionStatus}
          roomMessages={roomMessages}
          handleSendMessage={handleSendMessage}
          sendJsonMessage={sendJsonMessage}
          inputMessage={inputMessage}
          messageChanged={messageChanged}
          members={members}
          sendVideoUrl={sendVideoUrl}
        />
      </div>
    </div>
  );
}
