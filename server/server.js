const express = require("express");
const http = require("http");
// const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const WebSocket = require("ws");
const session = require("express-session");
const redis = require("redis");

let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();

const passport = require("./passport");
const router = require("./router");

const app = express();
const port = 4000;

// Socket connections go in here
// const map = new Map();
const roomObj = require("./rooms");

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  secret: "$eCuRiTy",
  resave: false,
  cookie: { maxAge: 60000 * 30 },
});

app.use(morgan("tiny"));
app.use(express.static("build"));
app.use(express.json());
app.use(sessionParser);
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

/**
 * Whoa dude, whats going on? I don't need this? I'm such a noob :(
 */
// Hmm I guess all 404's can just be handled on the client if I do this?
// app.get("*", (req, res) => {
//   res.sendFile("/build/index.html", { root: __dirname });
// });

/**
 * Create an HTTP server.
 */
const server = http.createServer(app);

/**
 * Create a WebSocket server completely detached from the HTTP server.
 */
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

server.on("upgrade", (req, socket, head) => {
  console.log("Upgrade request recieved, checking for active session...");

  sessionParser(req, {}, () => {
    const user = req.session?.passport?.user;
    const roomID = req.url.slice(1);
    const room = roomObj.rooms[roomID];

    if (!user) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    // If I restart server, the room object is destroyed but the session remains valid because redis
    // These are only seperate because it seemed easier to test manually, could combine with an ||
    if (!room) {
      socket.write("HTTP/1.1 401 Hello\r\n\r\n");
      socket.destroy();
      return;
    }

    console.log("Session found, connecting to chat...");

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });
});

// After successful upgrade, we get the connection event from our websocket server
wss.on("connection", (socket, req) => {
  console.log("Connected to wss!");

  const userName = req.session.passport.user.name;
  const userID = req.session.passport.user.id;
  const roomID = req.url.slice(1);
  const currentRoom = roomObj.rooms[roomID];

  currentRoom.users.set(userName, socket);
  console.log(roomObj.rooms);
  console.log(`${userName} has joined the chat.`);

  // Get a list of all users in the room and send to the client that just connected
  const usersInCurrentRoom = Array.from(currentRoom.users.keys());
  socket.send(JSON.stringify({ users: usersInCurrentRoom }));

  currentRoom.users.forEach((ws) => {
    ws.send(JSON.stringify({ connected: userName }));
  });

  socket.on("message", (clientMessage) => {
    const socketMessage = JSON.parse(clientMessage);

    // Not sure if I should use this object type strategy or
    // just find what I need with the hasOwnProperty method like below
    // if (msg.hasOwnProperty("chat")) {
    if (socketMessage.type === "chat") {
      currentRoom.users.forEach((ws) => {
        ws.send(
          JSON.stringify({ username: userName, chat: socketMessage.data })
        );
      });
    }

    // These video controls messages can only be performed by the creator/host of the room
    const lastSegmentOfUserId = userID.split("-").slice(-1)[0];
    if (roomID === lastSegmentOfUserId) {
      if (socketMessage.hasOwnProperty("play")) {
        currentRoom.users.forEach((ws) => {
          ws.send(JSON.stringify(socketMessage));
        });
      }

      if (socketMessage.hasOwnProperty("playedSeconds")) {
        currentRoom.users.forEach((ws) => {
          ws.send(JSON.stringify({ currentTime: socketMessage.playedSeconds }));
        });
      }

      if (socketMessage.videoUrl) {
        currentRoom.users.forEach((ws) => {
          ws.send(JSON.stringify({ videoUrl: socketMessage.videoUrl }));
        });
      }
    }
  });

  socket.on("close", () => {
    console.log(`${userName} has left the chat.`);
    currentRoom.users.delete(userName);

    currentRoom.users.forEach((ws) => {
      ws.send(JSON.stringify({ disconnected: userName }));
    });

    // Rooms don't get cleaned up here because it can nuke
    // the room if I just want to refresh. I'll think about
    // cleanup here later.

    // TL;DR: Rooms stick around on the room object forever
  });
});

//
// Start the server.
//
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
