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
const csrf = require("csurf");
var csrfProtection = csrf();

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
router.get("/session", csrfProtection, session);
router.get("/logout", logout);
// router.post("/login", rateLimiterRedisMiddleware, login);
router.post("/login", csrfProtection, login);
router.post("/signup", signup);

// This seems most like pure API
router.get("/getrooms", getRooms);

// Routes that should only work for authorized user session
// TODO: Add auth check middleware from password I think
router.post("/createroom", protected, createRoom);

// All other get requests will be handled on the client.
router.get("*", (req, res) => {
  // res.cookie("XSRF-TOKEN", req.csrfToken());
  res.sendFile("/build/index.html", { root: __dirname });
});

module.exports = router;
