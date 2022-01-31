const router = require("express").Router();
const {
  session,
  signup,
  login,
  logout,
  createRoom,
  getRooms,
} = require("./routeHandlers");
// const rateLimiterRedisMiddleware = require("./middleware/rateLimiterRedis");

// I have write this middleware instead of using passport.authenticate
// Because I'm sending json, not redirecting. SPA :P
function protected(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send("Not authorized for this action.");
  }
}

// These all have to do with creating, destroying, or lookup of a session
// router.get("/session", csrfProtection, session);
router.get("/session", session);
router.get("/logout", logout);

router.post("/login", login);
router.post("/signup", signup);

// This seems most like pure API
router.get("/getrooms", getRooms);

// Routes that should only work for authorized user session
router.post("/createroom", protected, createRoom);

// Last routes

// Hmmm, why did I need this again?
// router.get("/", (req, res) => {
//   console.log("Root / route.");
//   res.cookie("XSRF-TOKEN", req.csrfToken(), { sameSite: true });
//   res.sendFile("/build/index.html", { root: __dirname });
// });

// All other get requests will be handled on the client.
router.get("*", (req, res) => {
  console.log("**********************Last route**********************");
  // res.cookie("XSRF-TOKEN", req.csrfToken(), { sameSite: true });
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    sameSite: true,
    maxAge: 60 * 60000,
  });
  res.sendFile("/build/index.html", { root: __dirname });
});

module.exports = router;
