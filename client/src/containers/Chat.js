import React, { useState, useRef, useEffect, useContext } from "react";
import "./Chat.css";
import { UserContext } from "../App";

export default function Chat() {
  const user = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);

  const chatBox = useRef(null);

  function messageChanged(event) {
    setMessage(event.target.value);
  }

  // TODO: I will need to send to server instead of this, WS will be setuphere, or call the function here at least
  function sendMessage(event) {
    event.preventDefault();
    setRoomMessages([...roomMessages, { name: user.name, msg: message }]);
    setMessage("");
  }

  useEffect(() => {
    chatBox.current.scrollTop = chatBox.current.scrollHeight;
  }, [roomMessages]);

  return (
    <div>
      <h1>WS Chat</h1>
      <div className="chat-container" ref={chatBox}>
        {user && <p>{user.name} has entered the chat</p>}
        {roomMessages.map((msg, i) => (
          <p key={i}>
            {msg.name}: {msg.msg}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          name="message"
          autoComplete="off"
          value={message}
          onChange={messageChanged}
        />
        <button>Send</button>
      </form>
    </div>
  );
}
