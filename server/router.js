const router = require("express").Router();
const {
  sendSession,
  handleLogin,
  handleSignup,
  handleLogout,
  createRoom,
} = require("./handlers");

// Auth
router.get("/session", sendSession);
router.get("/logout", handleLogout);
router.post("/login", handleLogin);
router.post("/signup", handleSignup);

router.get("/createroom", createRoom);

module.exports = router;
