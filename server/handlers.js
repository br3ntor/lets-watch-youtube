const argon2 = require("argon2");

const db = require("./postgres");
const passport = require("./passport");

function sendSession(req, res) {
  if (!req.user) {
    return res.sendStatus(401);
  }

  res.send({
    name: req.user.name,
  });
}

function handleLogin(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // return res.send({ error: "User does not exist, or wrong password." });
      return res
        .status(401)
        .send({ error: "User does not exist, or wrong password." });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.send({ id: user.id, name: user.name });
    });
  })(req, res, next);
}

async function handleSignup(req, res) {
  const name = req.body.username;
  const password = req.body.password;

  try {
    const { rows } = await db.lookupUser(name);
    const userInDatabase = rows[0];

    if (!userInDatabase) {
      const pwHash = await argon2.hash(password);
      const { rows } = await db.createNewUser(name, pwHash);
      const userObj = rows[0];
      req.logIn(userObj, (err) => {
        if (err) {
          return next(err);
        }

        // FIXME: Inconsistency between the user object variable name here and above in the login function
        return res.send({ id: userObj.id, name: userObj.name });
        // return res.send({
        //   message: "User created and logged in as " + userObj.name,
        // });
      });
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

// I got three functions here but not sure which are necessary or in what order.
function handleLogout(req, res) {
  if (!req.user) {
    return;
  }

  const name = req.user.name;
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return;
    }
    req.logout();
    res.clearCookie("connect.sid");
    res.send({ message: `User ${name} has been logged out.` });
  });
}

module.exports = {
  sendSession,
  handleLogin,
  handleLogout,
  handleSignup,
};
