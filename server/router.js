const router = require("express").Router();
const {
  session,
  signup,
  login,
  logout,
  createRoom,
  getRooms,
} = require("./routeHandlers");

// Auth
router.get("/session", session);
router.get("/logout", logout);
router.post("/login", login);
router.post("/signup", signup);

router.post("/createroom", createRoom); // This needs to be authenticated
router.get("/getrooms", getRooms);

module.exports = router;
