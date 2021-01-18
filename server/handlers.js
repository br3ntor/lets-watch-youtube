const db = require("./postgres");

function sendSession(req, res) {
  if (req.cookies.username) {
    res.send({
      username: req.cookies.username,
    });
  } else {
    // Better to send a message?
    res.sendStatus(401);
  }
}

async function handleLogin(req, res) {
  const name = req.body.username;
  const password = req.body.password;

  try {
    const { rows } = await db.lookupUser(name);
    const userObject = rows[0];

    if (userObject && password === userObject.password) {
      res.cookie("username", name);
      res.send({ message: "Logged in as " + name });
    } else {
      res.send({ error: "User does not exist, or wrong password." });
    }
  } catch (err) {
    setImmediate(() => {
      console.error(err);
    });
  }
}

// FIXME: I don't think this needs to be async does it...
async function handleLogout(req, res) {
  try {
    console.log(req.cookies);
    const name = req.cookies.username;
    res.clearCookie("username");
    res.send({ message: `User ${name} has been logged out.` });
  } catch (e) {
    console.error(e);
  }
}

async function handleSignup(req, res) {
  const name = req.body.username;
  const password = req.body.password;

  try {
    const { rows } = await db.lookupUser(name);
    const userInDatabase = rows[0];

    if (!userInDatabase) {
      await db.createNewUser(name, password);
      res.cookie("username", name);
      res.send({ message: "User created" });
    } else {
      res.send({ error: "User already exist" });
    }
  } catch (err) {
    // This setImmediate comes from node-postgres examples in the docs
    setImmediate(() => {
      console.error(err);
    });
  }
}

module.exports = {
  sendSession,
  handleLogin,
  handleLogout,
  handleSignup,
};
