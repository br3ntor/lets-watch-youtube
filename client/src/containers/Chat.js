import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  // useCallback,
  // useMemo,
} from "react";

import useWebSocket, { ReadyState } from "react-use-websocket";
import { UserContext } from "../App";
import "./Chat.css";

export default function Chat() {
  const user = useContext(UserContext);
  const [inputMessage, setMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);
  const chatBox = useRef(null);

  // const socketUrl = "ws://localhost:4000";
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
    <div>
      <h1>WS Chat</h1>
      <p>The WebSocket is currently {connectionStatus}</p>
      <div className="chat-container" ref={chatBox}>
        {roomMessages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          name="message"
          autoComplete="off"
          value={inputMessage}
          onChange={messageChanged}
        />
        <button disabled={readyState !== ReadyState.OPEN}>Send</button>
      </form>
    </div>
  );
}
