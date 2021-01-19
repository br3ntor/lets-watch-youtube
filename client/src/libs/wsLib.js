let ws;

function connect() {
  if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
  }
  console.log(window.location.host);
  // FIXME: Figure out how to fix this, might have to configure in package.json proxy
  // ws = new WebSocket(`ws://${window.location}`);
  ws = new WebSocket(`ws://localhost:4000`);
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
