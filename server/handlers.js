const db = require("./postgres");

function sendSession(req, res) {
  if (req.session.username) {
    res.send({
      name: req.session.username,
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
      req.session.username = name;
      res.send({ message: "Logged in as " + name });
    } else {
      res.send({ error: "User does not exist, or wrong password." });
    }
  } catch (err) {
    // TODO: Look into the significance of this setImmediate here and if it'd be good anywhere else
    // Look into the docs for....postgres me thinks
    setImmediate(() => {
      console.error(err);
    });
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
      req.session.username = name;
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

// FIXME: I don't think this needs to be async does it...
async function handleLogout(req, res) {
  try {
    const name = req.session.username;
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return;
      }

      res.clearCookie("connect.sid");
      res.send({ message: `User ${name} has been logged out.` });
    });
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  sendSession,
  handleLogin,
  handleLogout,
  handleSignup,
};
