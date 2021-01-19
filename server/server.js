const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const WebSocket = require("ws");

const router = require("./router");

const app = express();
const port = 4000;

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.static("build"));

// Could replace with body-parser to extend functionality.
app.use(express.json());

app.use(router);

// Hmm I guess all 404's can just be handled on the client if I do this?
app.get("*", (req, res) => {
  res.sendFile("/build/index.html", { root: __dirname });
});

//
// Create an HTTP server.
//
const server = http.createServer(app);

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

server.on("upgrade", (req, socket, head) => {
  // console.log("Parsing session from request...");
  console.log("protocol upgraded and switched from http to ws");
  // Lets dig into these parameters

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });

  // sessionParser(request, {}, () => {
  //   if (!request.session.userId) {
  //     socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  //     socket.destroy();
  //     return;
  //   }

  //   console.log("Session is parsed!");

  //   wss.handleUpgrade(request, socket, head, function (ws) {
  //     wss.emit("connection", ws, request);
  //   });
  // });
});

// After successful upgrade, we get the connection event on our websocket server
wss.on("connection", (socket, req) => {
  socket.on("message", (msg) => {
    console.log(msg);
    socket.send(msg);
  });
});

//
// Start the server.
//
server.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});
