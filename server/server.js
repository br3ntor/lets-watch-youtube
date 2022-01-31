const express = require("express");
const http = require("http");
const morgan = require("morgan");
const WebSocket = require("ws");
const session = require("express-session");
const redis = require("redis");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient(6379, "redis");

const passport = require("./passport");
const router = require("./router");

const app = express();
const port = 4000;

// Socket connections go in here
const roomObj = require("./rooms");

const csrf = require("csurf");
// Can't get this to work with the cookie option set to true, nor do I understand
// how it is different from the way I have this implemented now.
// TRY NOT TO DEV SERVER STUFF WHILE WORKING ON REACT LOL
const csrfProtection = csrf();

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const seshOptions = {
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false, // CSRF on req.session seems to effect this
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: { maxAge: 60 * 60000, sameSite: true },
  name: process.env.SESSION_NAME,
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  seshOptions.cookie.secure = true; // serve secure cookies
}

const sessionParser = session(seshOptions);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "https://*.youtube.com"],
        "connect-src": ["'self'", "https://*.googleapis.com"],
        "img-src": ["*"],
        "frame-src": ["https://*.youtube.com"],
      },
    },
    hsts: {
      maxAge: 63072000,
    },
    crossOriginResourcePolicy: true,
    crossOriginOpenerPolicy: true,
    // Requires remote resoursce to whitelist me basically I think
    // crossOriginEmbedderPolicy: true,
    originAgentCluster: true,
  })
);

app.use(morgan("tiny"));
app.use(express.static("build", { index: false }));
app.use(express.json());
app.use(cookieParser());
app.use(sessionParser);
app.use(passport.initialize());
app.use(passport.session());
app.use(csrfProtection);
app.use(snoop);
app.use(router);

// Note: For some reason, while developing client side redis sets two sessions idk why
// but seems normal I guess when served by express.
function snoop(req, res, next) {
  next();
}

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

    // If I restart server, the room object is destroyed but the session remains valid because redis
    if (!user || !room) {
      console.log("No chat 4 u");
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    console.log("Session found, connecting to chat...");

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });
});

/**
 * TODO: Implement websocket message system
 * Socket messaging system should look like this:
 * {type: string, data: object}
 * then maybe send those to a dispatch function?
 */

// After successful upgrade, we get the connection event from our websocket server
wss.on("connection", (socket, req) => {
  console.log("Connected to wss!");

  const user = req.session.passport.user;
  const userName = user.name;
  const userID = user.id;
  const roomID = req.url.slice(1);
  const currentRoom = roomObj.rooms[roomID];

  currentRoom.users.set(user, socket);
  console.log(`${userName} has joined the chat.`);

  // Get a list of all users in the room and send to the client that just connected
  const usersInCurrentRoom = Array.from(currentRoom.users.keys());
  socket.send(
    JSON.stringify({
      users: usersInCurrentRoom,
      video: currentRoom.video,
    })
  );

  // Send all members in the room the newly connected clients info
  currentRoom.users.forEach((ws) => {
    ws.send(JSON.stringify({ connected: user }));
  });

  // Now we setup a message system
  // Both for chat messages and video control messages
  // So those two types and potentially more
  // This area below needs to be reworked/abstracted
  // Cleaned up, refactored etc.
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

    // Maybe a lazy way to authenticate, will have to think about it, but not now of course.
    // These video controls messages can only be performed by the creator/host of the room
    const lastSegmentOfUserId = userID.split("-").slice(-1)[0];
    if (roomID === lastSegmentOfUserId) {
      if (socketMessage.hasOwnProperty("play")) {
        currentRoom.users.forEach((ws) => {
          ws.send(JSON.stringify(socketMessage));
        });
      }

      if (socketMessage.type == "time") {
        currentRoom.users.forEach((ws) => {
          ws.send(
            JSON.stringify({
              currentTime: socketMessage.data.prog.playedSeconds,
              pl_index: socketMessage.data.pl_index,
            })
          );
        });
      }

      if (socketMessage.videoUrl) {
        currentRoom.video = socketMessage.videoUrl;
        currentRoom.users.forEach((ws) => {
          ws.send(JSON.stringify({ videoUrl: socketMessage.videoUrl }));
        });
      }
    }
  });

  socket.on("close", () => {
    console.log(`${userName} has left the chat.`);
    currentRoom.users.delete(user);

    currentRoom.users.forEach((ws) => {
      ws.send(JSON.stringify({ disconnected: user }));
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

const gracefulShutdown = () => {
  console.log("Starting shutdown of express...");

  server.close(() => {
    console.log("Express shut down!");
    process.exit(0);
  });

  // Hmm,I don't think I need to handle the redis or postgres here.
  // wss.close(() => {
  //   console.log("Wss shut down!");

  //   redisClient.quit(() => {
  //     console.log("Redis client shut down!");

  //     server.close(() => {
  //       console.log("Express shut down!");
  //     });
  //   });
  // });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

process.once("SIGUSR2", function () {
  console.log("This is the signal nodemon uses to restart.");
  gracefulShutdown(function () {
    process.kill(process.pid, "SIGUSR2");
  });
});
