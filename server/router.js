const router = require("express").Router();
const {
  sendSession,
  handleLogin,
  handleSignup,
  handleLogout,
  createRoom,
  getRooms,
} = require("./handlers");

// Auth
router.get("/session", sendSession);
router.get("/logout", handleLogout);
router.post("/login", handleLogin);
router.post("/signup", handleSignup);

router.post("/createroom", createRoom); // This needs to be authenticated
router.get("/getrooms", getRooms);

module.exports = router;
