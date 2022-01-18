const argon2 = require("argon2");

const db = require("./postgres");
const passport = require("./passport");
const roomObj = require("./rooms");

/**
 * Checks for valid session and returns the user
 * object attached to session or a 401 message
 */
function session(req, res) {
  if (!req.user) {
    // I understand why I tried this here. Cookie developement and express env vs CRA server.
    // Because I'm serving the app from express...and setting the xsrf cookie at sendfile.
    // I think I will try to enable this for client-dev, logout will be broken? maybe? Seems to work here fine actually
    // res.cookie("XSRF-TOKEN", req.csrfToken(), { sameSite: true });
    return res.sendStatus(401);
  }
  console.log(req.session.cookie._expires);
  res.send({
    name: req.user.name,
    id: req.user.id,
  });
}

function login(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(401)
        .send({ error: "User does not exist, or wrong password." });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.send(user);
    });
  })(req, res, next);
}

async function signup(req, res) {
  const name = req.body.username;
  const password = req.body.password;

  try {
    const { rows: rA } = await db.lookupUser(name);
    const userInDatabase = rA[0];

    if (userInDatabase) {
      res.send({ error: "Username already exist" });
      throw new Error("Username already exists.");
    }

    const pwHash = await argon2.hash(password);
    const { rows: rB } = await db.createNewUser(name, pwHash);
    const newUser = rB[0];

    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }

      return res.send({ id: newUser.id, name: newUser.name });
    });
  } catch (err) {
    // This setImmediate comes from node-postgres examples in the docs
    // Found this info too:
    // https://nodejs.org/dist/latest-v14.x/docs/api/events.html#events_asynchronous_vs_synchronous
    setImmediate(() => {
      console.error(err);
    });
  }
}

function logout(req, res) {
  if (!req.user) {
    res.send({
      message: `User was logged out already because the 2h token expired.`,
    });
    return;
  }

  const name = req.user.name;
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return;
    }

    req.logout(); // Clears session from redis
    res.clearCookie("seshypoo4you"); // Clears cookie on client
    res.clearCookie("XSRF-TOKEN");
    res.send({ message: `User ${name} has been logged out.` });
  });
}

// Prob need to make this an authenticated route
function createRoom(req, res) {
  // Room id will be the last section of the uuid from the host/user that created the room
  const roomID = req.user.id.split("-").slice(-1)[0];

  // Add a room to the rooms object
  roomObj.createRoom({
    id: roomID,
    name: req.body.name,
    video: req.body.url,
  });

  // Make sure it's there, might not need
  if (roomObj.rooms.hasOwnProperty(roomID)) {
    res.send(roomID);
  } else {
    res.send("Something went wrong creating the room.");
  }
}

function getRooms(req, res) {
  const rooms = [];

  for (const roomID in roomObj.rooms) {
    const r = roomObj.rooms[roomID];
    rooms.push({
      id: roomID,
      name: r.name,
      users: Array.from(r.users.keys()),
      video: r.video,
    });
  }

  res.send(rooms);
}

module.exports = {
  session,
  signup,
  login,
  logout,
  createRoom,
  getRooms,
};
