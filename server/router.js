const router = require("express").Router();
const {
  session,
  signup,
  login,
  logout,
  createRoom,
  getRooms,
} = require("./routeHandlers");

// These all have to do with creating, destroying, or lookup of a session
router.get("/session", session);
router.get("/logout", logout);
router.post("/login", login);
router.post("/signup", signup);

// This seems most like pure API
router.get("/getrooms", getRooms);

// Routes that should only work for authorized user session
// TODO: Add auth check middleware from password I think
router.post("/createroom", createRoom);

// All other get requests will be handled on the client.
router.get("*", (req, res) => {
  res.sendFile("/build/index.html", { root: __dirname });
});

module.exports = router;
