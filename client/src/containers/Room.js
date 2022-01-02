import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import ReactPlayer from "react-player";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Tabs from "../components/Tabs";
import { useAuth } from "../libs/use-auth.js";

export default function Room() {
  const [roomMessages, setRoomMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const videoBox = useRef(null);

  const { user } = useAuth();
  const { room } = useParams();
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [playlist, setPlaylist] = useState([]);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const protocol = window.location.hostname === "localhost" ? "ws" : "wss";
  const port = window.location.hostname === "localhost" ? ":4000" : "";
  const socketUrl = `${protocol}://${window.location.hostname}${port}/${room}`;

  const userIsHost =
    user.id.split("-").slice(-1)[0] === room ? true : undefined;

  /**
   * react-use-websocket hook
   * https://github.com/robtaussig/react-use-websocket#api
   * https://github.com/robtaussig/react-use-websocket#options
   */
  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("opened"),
      onError: (e) => console.error(e),
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      onReconnectStop: () => {
        navigate("/");
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
          prev.concat(`${lastJsonMessage.connected.name} has connected.`)
        );

        // Skip if connected message is for user since I get that on initial connection
        if (lastJsonMessage.connected.name !== user.name) {
          setMembers((prev) => prev.concat(lastJsonMessage.connected));
        }
      }

      if (lastJsonMessage.hasOwnProperty("disconnected")) {
        setRoomMessages((prev) =>
          prev.concat(`${lastJsonMessage.disconnected.name} has disconnected.`)
        );

        if (lastJsonMessage.disconnected.name !== user.name) {
          setMembers((prev) => {
            const leavingUser = prev.indexOf(lastJsonMessage.disconnected);
            const updatedList = [...prev];
            updatedList.splice(leavingUser, 1);
            return updatedList;
          });
        }
      }

      // This happens when entering chat, happens first.
      // users prop comes on the object sent on connection or disconnect
      if (lastJsonMessage.hasOwnProperty("users")) {
        setMembers(lastJsonMessage.users);
        setVideoUrl(lastJsonMessage.video);
      }

      // Might need to send this data as an object so I can Style it better in JSX component
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

      // Receive and set video url
      if (lastJsonMessage.videoUrl) {
        setVideoUrl(lastJsonMessage.videoUrl);
      }
    }
  }, [lastJsonMessage, userIsHost, user]);

  function sendMessage(message) {
    if (!user) {
      console.log("Not logged in");
      return;
    }

    sendJsonMessage({
      type: "chat",
      data: message,
    });
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

  function nextVideo(e) {
    const url = playlist[0];
    sendVideoUrl(url);
    setPlaylist((pl) => pl.slice(1));
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <Stack
      direction={matches ? "column" : "row"}
      sx={{
        height: `calc(100vh - 64px)`,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <ReactPlayer
          ref={videoBox}
          onPlay={userIsHost && sendPlay}
          onPause={userIsHost && sendPause}
          onProgress={userIsHost && sendTime}
          onEnded={userIsHost && nextVideo}
          playing={isPlaying}
          progressInterval={5000}
          controls
          url={videoUrl}
          width="100%"
          height="100%"
        />
      </Box>
      <Box
        sx={{
          height: { xs: "70%", md: "initial" },
          width: { sm: "initial", md: 375 },
        }}
      >
        <Tabs
          connectionStatus={connectionStatus}
          roomMessages={roomMessages}
          members={members}
          sendMessage={sendMessage}
          sendVideoUrl={sendVideoUrl}
          playlist={playlist}
          setPlaylist={setPlaylist}
        />
      </Box>
    </Stack>
  );
}
