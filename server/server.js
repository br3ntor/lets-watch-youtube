const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const WebSocket = require("ws");
const session = require("express-session");
const redis = require("redis");

let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();

// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

const router = require("./router");

const app = express();
const port = 4000;

const map = new Map();

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  secret: "$eCuRiTy",
  resave: false,
  // cookie: { maxAge: 60000 },
});

app.use(morgan("tiny"));
app.use(express.static("build"));
// I think the docs said something like 'maybe dont use this' and I don't think I need this anymore
// app.use(cookieParser());
app.use(sessionParser);

// Could replace with body-parser to extend functionality.
app.use(express.json());

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
  console.log("protocol upgraded and switched from http to ws");

  sessionParser(req, {}, () => {
    if (!req.session.username) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    console.log("Session is parsed!");

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });
});

// After successful upgrade, we get the connection event on our websocket server
wss.on("connection", (socket, req) => {
  const user = req.session.username;

  map.set(user, socket);

  map.forEach((ws) => {
    ws.send(`${user} has joined the chat.`);
  });

  socket.on("message", (msg) => {
    map.forEach((ws) => {
      ws.send(`[${user}]: ${msg}`);
    });
  });

  socket.on("close", () => {
    map.forEach((ws) => {
      ws.send(`${user} has left the chat.`);
    });
    map.delete(user);
  });
});

//
// Start the server.
//
server.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});
