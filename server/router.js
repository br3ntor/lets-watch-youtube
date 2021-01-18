const router = require("express").Router();
const {
  sendSession,
  handleLogin,
  handleSignup,
  handleLogout,
} = require("./handlers");

router.get("/session", sendSession);
router.get("/logout", handleLogout);
router.post("/login", handleLogin);
router.post("/signup", handleSignup);

module.exports = router;
