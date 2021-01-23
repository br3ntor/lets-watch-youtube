let ws;

console.log(process.env.NODE_ENV);

function connect() {
  if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
  }

  console.log(window.location.host);

  const url =
    process.env.NODE_ENV === "production"
      ? `ws://${window.location}`
      : `ws://localhost:4000`;
  ws = new WebSocket(url);
  ws.onerror = () => console.log("WebSocket error");

  ws.onopen = () => console.log("WebSocket connection established");

  ws.onclose = () => {
    console.log("WebSocket connection closed");
    ws = null;
  };

  // I need this here to update the react state.
  ws.onmessage = (message) => console.log(message.data);
}

function sendMessage(msg) {
  if (!ws) {
    console.log("No WebSocket connection");
    return;
  }

  ws.send(msg);
}

module.exports = {
  connect,
  sendMessage,
};
